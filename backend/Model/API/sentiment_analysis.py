import os
import gc
import nltk
import numpy as np
import pandas as pd
import torch
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline


def clean_gpu_memory():
    """Cleans up GPU memory."""
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()


def check_gpu_memory(required_memory_mb=2000):
    """Checks if there's enough GPU memory."""
    if not torch.cuda.is_available():
        return False
    total_memory = torch.cuda.get_device_properties(0).total_memory / 1024**2
    allocated_memory = torch.cuda.memory_allocated() / 1024**2
    available_memory = total_memory - allocated_memory
    print(f"\nGPU Memory Available: {available_memory:.2f} MB")
    return available_memory >= required_memory_mb


def reduce_memory_usage(df):
    """Reduces memory usage of a dataframe."""
    numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
    start_mem = df.memory_usage().sum() / 1024**2

    for col in df.columns:
        col_type = df[col].dtypes
        if col_type in numerics:
            c_min = df[col].min()
            c_max = df[col].max()

            if str(col_type)[:3] == 'int':
                if c_min > np.iinfo(np.int8).min and c_max < np.iinfo(np.int8).max:
                    df[col] = df[col].astype(np.int8)
                elif c_min > np.iinfo(np.int16).min and c_max < np.iinfo(np.int16).max:
                    df[col] = df[col].astype(np.int16)
                elif c_min > np.iinfo(np.int32).min and c_max < np.iinfo(np.int32).max:
                    df[col] = df[col].astype(np.int32)
            else:
                if c_min > np.finfo(np.float16).min and c_max < np.finfo(np.float16).max:
                    df[col] = df[col].astype(np.float16)
                elif c_min > np.finfo(np.float32).min and c_max < np.finfo(np.float32).max:
                    df[col] = df[col].astype(np.float32)

    end_mem = df.memory_usage().sum() / 1024**2
    print(f'Memory usage reduced from {start_mem:.2f} MB to {end_mem:.2f} MB ({100 * (start_mem - end_mem) / start_mem:.2f}% reduction)')
    return df


def setup_nltk():
    """Set up NLTK resources and verify their availability."""
    # Check all possible NLTK data directories
    possible_paths = [
        os.path.expanduser('~/nltk_data'),
        os.path.expanduser('~/AppData/Roaming/nltk_data'),
        os.path.expanduser('~/AppData/Local/Programs/Python/Python312/nltk_data'),
    ]
    
    # Add all possible paths to NLTK's search path
    for path in possible_paths:
        if path not in nltk.data.path:
            nltk.data.path.append(path)
    
    # Download required NLTK data
    nltk.download('punkt')
    nltk.download('stopwords')
    
    # Verify resources are available
    try:
        # Test tokenizer
        test_text = "This is a test sentence."
        tokens = word_tokenize(test_text)
        # Test stopwords
        stop_words = set(stopwords.words('english'))
        print("NLTK setup successful!")
        return True
    except LookupError as e:
        print(f"Error verifying NLTK resources: {str(e)}")
        return False


def clean_text(text):
    """Clean the input text by removing punctuation and stopwords."""
    # Convert to string and lowercase
    text = str(text).lower()
    
    # Remove punctuation
    text = ''.join(char for char in text if char.isalnum() or char.isspace())
    
    # Tokenize and remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text)
    cleaned_tokens = [word for word in tokens if word not in stop_words]
    
    # Join tokens back into a string
    cleaned_text = ' '.join(cleaned_tokens)
    
    return cleaned_text


def get_finbert_sentiment_scores(text, sentiment_pipeline):
    """Get FinBERT sentiment scores for the given text."""
    try:
        # Get raw pipeline output
        results = sentiment_pipeline(text, truncation=True, max_length=512)
        
        if isinstance(results, list) and len(results) > 0:
            # Extract scores from the first result (list of dictionaries)
            results = results[0]
        else:
            return {'positive': 0, 'negative': 0, 'neutral': 0}
        
        # Extract sentiment scores
        scores = {item['label']: item['score'] for item in results}
        
        return {
            'positive': scores.get('positive', 0),
            'negative': scores.get('negative', 0),
            'neutral': scores.get('neutral', 0)
        }
    except Exception as e:
        print(f"Error analyzing text with FinBERT: {str(e)}")
        return {'positive': 0, 'negative': 0, 'neutral': 0}


def compute_finbert_composite(positive_score, negative_score, neutral_score):
    """
    Compute a single sentiment score from FinBERT's positive, negative, and neutral scores.
    Returns a value in the range [-1, 1].
    """
    total = positive_score + negative_score + neutral_score
    if total == 0:
        return 0  # If all scores are zero, default to neutral
    
    # Weighted sum interpretation:
    #   positive contributes +1
    #   negative contributes -1
    #   neutral contributes 0
    weighted_sum = (positive_score * 1) + (negative_score * -1) + (neutral_score * 0)

    return weighted_sum / total


def process_finbert_sentiment(input_path, output_path=None):
    """
    Process news data, clean text, and apply FinBERT sentiment analysis.
    Save the results to a CSV file with only the finbert_composite score.
    
    Args:
        input_path: Path to the input CSV file containing news data
        output_path: Path to save the output CSV file (default: 'finbert_sentiment_df.csv')
    
    Returns:
        DataFrame with FinBERT sentiment analysis results
    """
    if output_path is None:
        output_path = 'finbert_sentiment_df.csv'
    
    print("Setting up NLTK...")
    setup_nltk()
    
    print(f"Reading news data from {input_path}...")
    try:
        df = pd.read_csv(input_path, parse_dates=['Date'], index_col='Date')
    except (FileNotFoundError, KeyError):
        try:
            # Try without the Date column as index
            df = pd.read_csv(input_path)
            # Check if 'Date' column exists
            if 'Date' in df.columns:
                df['Date'] = pd.to_datetime(df['Date'])
                df.set_index('Date', inplace=True)
        except FileNotFoundError:
            print(f"Error: Input CSV file not found at {input_path}")
            return None
    
    # Check if we have the necessary columns
    if 'Title' in df.columns:
        news_column = 'Title'
    elif 'News' in df.columns:
        news_column = 'News'
    else:
        print("Error: Could not find a column named 'Title' or 'News' in the CSV file.")
        return None
    
    print("Cleaning news text...")
    df['Cleaned News'] = df[news_column].apply(clean_text)
    
    print("Initializing FinBERT model...")
    # Initialize FinBERT model and tokenizer
    model_name = "ProsusAI/finbert"
    
    try:
        # Check if we have enough GPU memory
        has_gpu = check_gpu_memory(2000)
        device = torch.device("cuda" if has_gpu else "cpu")
        print(f"Using device: {device}")
        
        # Load model to appropriate device
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForSequenceClassification.from_pretrained(model_name).to(device)
        sentiment_pipeline = pipeline("text-classification", model=model, tokenizer=tokenizer, 
                                      return_all_scores=True, device=0 if has_gpu else -1)
        
        print("Applying FinBERT sentiment analysis (this may take a while)...")
        # Apply FinBERT sentiment in batches to manage memory
        batch_size = 32
        scores = []
        
        for i in range(0, len(df), batch_size):
            batch_texts = df['Cleaned News'].iloc[i:i+batch_size].tolist()
            batch_scores = []
            
            for text in batch_texts:
                result = get_finbert_sentiment_scores(text, sentiment_pipeline)
                batch_scores.append(result)
            
            scores.extend(batch_scores)
            
            # Clear GPU memory after each batch
            clean_gpu_memory()
            
        # Add sentiment scores to the dataframe
        df['positive_score'] = [score['positive'] for score in scores]
        df['negative_score'] = [score['negative'] for score in scores]
        df['neutral_score'] = [score['neutral'] for score in scores]
        
        # Create composite FinBERT score
        df['finbert_composite'] = df.apply(
            lambda row: compute_finbert_composite(
                row['positive_score'], row['negative_score'], row['neutral_score']),
            axis=1)
        
        # Free up GPU memory after processing
        clean_gpu_memory()
        
        # Create a simplified dataframe with only the necessary columns
        result_df = df[['finbert_composite', 'Cleaned News']].copy()
        
        # Optionally reduce memory usage before saving
        result_df = reduce_memory_usage(result_df)
        
        # Save the results to CSV
        print(f"Saving FinBERT sentiment results to {output_path}...")
        result_df.to_csv(output_path)
        print(f"FinBERT sentiment analysis complete! Results saved to {output_path}")
        
        return result_df
    
    except Exception as e:
        print(f"Error during sentiment analysis: {str(e)}")
        # Clean up memory in case of error
        clean_gpu_memory()
        return None


if __name__ == "__main__":
    # Example usage
    input_file = "D:/StockSage/backend/API/sharesansar_news.csv"  # Change this to your input file path
    output_file = "combined_sentiment_df.csv"  # Change this to your desired output file path
    
    print(f"\nStarting FinBERT sentiment analysis for {input_file}...")
    sentiment_df = process_finbert_sentiment(input_file, output_file)
    
    if sentiment_df is not None:
        print("\nSample of FinBERT sentiment analysis results:")
        print(sentiment_df[['finbert_composite']].head())
    
    print("\nProcess completed!")