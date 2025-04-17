import os
import json
import joblib
import numpy as np
import base64
from io import BytesIO
from datetime import datetime, timedelta
from dotenv import load_dotenv

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

import torch
import torch.nn as nn
import matplotlib
matplotlib.use('Agg')  # Use 'Agg' backend to prevent GUI warnings in non-GUI servers
import matplotlib.pyplot as plt

import pandas as pd
import google.generativeai as genai
from PIL import Image


load_dotenv()

SQL_USERNAME = os.getenv('SQL_USERNAME')
SQL_PASSWORD = os.getenv('SQL_PASSWORD')
SQL_HOST = os.getenv('SQL_HOST', 'localhost')  # Default to localhost
SQL_DB = os.getenv('SQL_DB')
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
# Initialize Flask application
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{SQL_USERNAME}:{SQL_PASSWORD}@{SQL_HOST}/{SQL_DB}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = SECRET_KEY

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# =========================
# 1. Define the PyTorch Model
# =========================

class StockLSTM(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, output_size):
        super(StockLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.4)
        self.fc_layers = nn.Sequential(
            nn.Linear(hidden_size, 64),
            nn.ReLU(),
            nn.Linear(64, 16),
            nn.ReLU(),
            nn.Linear(16, output_size)
        )

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        out, _ = self.lstm(x, (h0, c0))
        out = self.fc_layers(out[:, -1, :])
        return out

# =========================
# 2. Model Loading Function (Fixed input_size)
# =========================

def load_model_and_scaler(symbol):
    """
    Loads a trained PyTorch model, a scaler, and relevant data based on the symbol.
    """
    try:
        model_dir = os.path.join('D:\\Model', symbol, 'model_components')
        historical_path = os.path.join(
            'C:\\Users\\DELL\\Desktop\\Stock Prices',
            f"{symbol}.csv"
        )
        model_path = os.path.join(model_dir, f'{symbol}_model.pth')
        scaler_path = os.path.join(model_dir, f'{symbol}_scaler.pkl')
        sequence_path = os.path.join(model_dir, f'{symbol.lower()}_last_sequence.npy')

        # Check if all required files exist
        required_files = [model_path, scaler_path, historical_path, sequence_path]
        for path in required_files:
            if not os.path.exists(path):
                print(f"Missing file: {path}")
                return None, None, None, None

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load model with correct input_size (26 features)
        model = StockLSTM(
            input_size=26,  # Updated to match trained model's expected input
            hidden_size=128,
            num_layers=3,
            output_size=1
        ).to(device)
        
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.eval()
        
        scaler = joblib.load(scaler_path)
        historical_df = pd.read_csv(historical_path, index_col=0, parse_dates=True)
        
        if 'Close' not in historical_df.columns:
            print("Missing 'Close' column in historical data")
            return None, None, None, None
            
        # Filter out any NaT values in the index
        historical_df = historical_df[~pd.isna(historical_df.index)]
        historical_data = historical_df[['Close']]
        last_sequence = np.load(sequence_path, allow_pickle=True)

        # Validate and reshape sequence
        if last_sequence.ndim == 1:
            last_sequence = last_sequence.reshape((-1, 26))  # Match input_size
        elif last_sequence.shape[1] != 26:
            last_sequence = last_sequence[:, -26:]

        return model, scaler, historical_data, last_sequence

    except Exception as e:
        print(f"Error loading model for {symbol}: {str(e)}")
        return None, None, None, None

# =========================
# 3. Fallback Prediction Generation Function
# =========================

def generate_mock_prediction(symbol):
    """
    Generates a mock prediction for symbols that don't have model data.
    This is used as a fallback when real model data is not available.
    Fixed to use the correct historical date range.
    """
    try:
        # Generate some random prediction data
        np.random.seed(hash(symbol) % 10000)  # Use symbol name as seed for consistency
        
        # Sample price range based on the symbol
        base_price = {
            'SCB': 500,
            'NABIL': 1200,
            'JBBL': 400,
            'API': 300,
            'NTC': 900
        }.get(symbol, 500)  # Default to 500 if symbol not found
        
        # Use 2024-12-10 as the last historical date as specified
        last_historical_date = pd.Timestamp("2024-12-10")
        
        # Generate random historical data ending at the last historical date
        end_date = last_historical_date
        start_date = end_date - pd.Timedelta(days=100)
        dates = pd.date_range(start=start_date, end=end_date)
        price_volatility = 0.02  # 2% daily volatility
        
        # Create a somewhat realistic price movement
        random_walk = np.random.normal(0, price_volatility, len(dates)).cumsum()
        historical_prices = base_price * (1 + random_walk)
        
        # Create DataFrame for historical data
        historical_data = pd.DataFrame({
            'Close': historical_prices
        }, index=dates)
        
        # Generate predictions for the next 30 days starting from the day after the last historical date
        future_dates = pd.date_range(
            start=last_historical_date + pd.Timedelta(days=1),
            periods=30,
            freq='D'
        )
        
        # Generate prediction with a slight trend based on recent movement
        trend = 0.001 * (historical_prices[-1] - historical_prices[-10]) / historical_prices[-10]
        prediction_walk = np.random.normal(trend, price_volatility * 0.8, 30).cumsum()
        predictions = historical_prices[-1] * (1 + prediction_walk)
        
        # Create plot
        graph = create_prediction_plot(historical_data, predictions, future_dates, symbol, is_mock=True)
        
        return {
            'success': True,
            'symbol': symbol,
            'predictions': predictions.tolist(),
            'graph': graph,
            'dates': [d.strftime('%Y-%m-%d') for d in future_dates],
            'is_mock': True
        }
        
    except Exception as e:
        print(f"Error generating mock prediction for {symbol}: {str(e)}")
        # Fall back to even simpler approach with fixed dates
        try:
            # Generate minimal prediction data
            base_price = {
                'SCB': 500, 'NABIL': 1200, 'JBBL': 400, 'API': 300, 'NTC': 900
            }.get(symbol, 500)
            
            predictions = [base_price * (1 + np.random.normal(0, 0.01) * i) for i in range(30)]
            
            # Use fixed dates starting from 2024-12-11 (day after 2024-12-10)
            last_date = pd.Timestamp("2024-12-10")
            future_dates = pd.date_range(
                start=last_date + pd.Timedelta(days=1),
                periods=30,
                freq='D'
            )
            
            # Create a simple historical dataset
            historical_dates = pd.date_range(
                end=last_date,
                periods=100,
                freq='D'
            )
            historical_prices = [base_price * (1 + np.random.normal(0, 0.015) * i) for i in range(100)]
            historical_data = pd.DataFrame({'Close': historical_prices}, index=historical_dates)
            
            # Create plot
            graph = create_prediction_plot(historical_data, predictions, future_dates, symbol, is_mock=True)
            
            return {
                'success': True,
                'symbol': symbol,
                'predictions': predictions,
                'graph': graph,
                'dates': [d.strftime('%Y-%m-%d') for d in future_dates],
                'is_mock': True,
                'is_fallback': True
            }
        except Exception as e:
            print(f"Fallback error for {symbol}: {str(e)}")
            # Last resort fallback with no visualization
            return {
                'success': False,
                'error': f"Failed to generate prediction for {symbol}."
            }

# =========================
# 4. Load Data Function
# =========================

def load_data(filename):
    """
    Loads JSON data from the specified filename located in the 'data' directory.
    """
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, 'data', filename)
        
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading data from {filename}: {str(e)}")
        return []

# =========================
# 5. Database Models
# =========================

from datetime import datetime

class User(db.Model):
    """
    User model for storing user information.
    """
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email
        }

class Portfolio(db.Model):
    """
    Portfolio model for storing user stock holdings.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    avg_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

# =========================
# 6. Authentication Routes
# =========================

@app.route('/api/register', methods=['POST'])
def register():
    """
    Registers a new user.

    Expected JSON Payload:
    {
        "email": "user@example.com",
        "password": "securepassword",
        "full_name": "John Doe"
    }
    """
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('email', 'password', 'full_name')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if email is already registered
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    # Hash the password for security
    hashed_password = generate_password_hash(data['password'])

    # Create a new user instance
    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        password=hashed_password
    )
    
    try:
        # Add and commit the new user to the database
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Registration successful'}), 201
    except Exception as e:
        # Rollback in case of error
        db.session.rollback()
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """
    Logs in an existing user.

    Expected JSON Payload:
    {
        "email": "user@example.com",
        "password": "securepassword"
    }
    """
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'message': 'Missing email or password'}), 400
    
    # Retrieve the user from the database
    user = User.query.filter_by(email=data['email']).first()
    
    # Validate user credentials
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Store user ID in session
    session['user_id'] = user.id
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict()
    }), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    """
    Logs out the current user by clearing the session.
    """
    try:
        # Clear session data
        session.clear()
        
        # Clear cookies if any (example: token)
        response = jsonify({'message': 'Successfully logged out'})
        response.delete_cookie('token')  # Modify if using different cookie names
        
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    """
    Checks if the user is authenticated.
    """
    if 'user_id' in session:
        return jsonify({'authenticated': True}), 200
    return jsonify({'authenticated': False}), 401

# =========================
# 7. Portfolio Routes
# =========================

@app.route('/api/companies', methods=['GET'])
def get_companies():
    """
    Retrieves a list of companies.
    """
    try:
        companies = load_data('companies.json')  # Ensure 'companies.json' exists in the 'data' directory
        # Add unique ID to each company
        for i, company in enumerate(companies):
            company['id'] = i + 1
        return jsonify(companies)
    except Exception as e:
        print(f"Error in get_companies: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/sectors', methods=['GET'])
def get_sectors():
    """
    Retrieves a list of unique sectors from companies.
    """
    try:
        companies = load_data('companies.json')  # Ensure 'companies.json' exists in the 'data' directory
        # Extract unique sectors
        sectors = list(set(company['sector'] for company in companies if 'sector' in company))
        sectors.sort()  # Sort sectors alphabetically
        return jsonify(sectors)
    except Exception as e:
        print(f"Error in get_sectors: {str(e)}")
        return jsonify({'error': str(e)}), 500

# =========================
# 8. Prediction Routes
# =========================

@app.route('/api/predict/<symbol>', methods=['GET'])
def predict(symbol):
    """
    Generates prediction for a given stock symbol.
    If model data is not available, falls back to mock prediction.
    
    Parameters:
    - symbol (str): The stock symbol (e.g., SCB, NABIL).
    """
    # Define supported symbols based on frontend
    supported_symbols = ['SCB', 'NABIL', 'JBBL', 'API', 'NTC']
    
    if symbol not in supported_symbols:
        return jsonify({'success': False, 'error': f"Symbol {symbol} not supported."}), 400

    # Try loading model components
    result = load_model_and_scaler(symbol)
    
    # If model components are available, use them for prediction
    if result and not any(x is None for x in result):
        model, scaler, historical_data, last_sequence = result
        
        try:
            device = next(model.parameters()).device
            
            # Ensure sequence shape is correct [1, sequence_length, features]
            input_tensor = torch.FloatTensor(last_sequence).unsqueeze(0).to(device)
            if input_tensor.shape[2] != 26:
                return jsonify({'success': False, 'error': "Invalid input sequence shape"}), 500

            predictions = []
            current_sequence = input_tensor.clone()
            
            for _ in range(30):
                with torch.no_grad():
                    output = model(current_sequence).cpu().numpy()

                # Inverse transform prediction
                dummy = np.zeros((1, scaler.n_features_in_))
                dummy[0, 0] = output[0][0]
                pred_price = scaler.inverse_transform(dummy)[0, 0]
                predictions.append(pred_price)

                # Update sequence
                new_seq = current_sequence.cpu().numpy().squeeze(0)
                new_seq = np.roll(new_seq, -1, axis=0)
                new_seq[-1, 0] = output[0][0]  # Update only the 'Close' feature
                current_sequence = torch.FloatTensor(new_seq).unsqueeze(0).to(device)

            # IMPORTANT: Get the last valid date from historical data for predictions to start from
            # Sort the index to ensure we get the latest date
            sorted_index = sorted(historical_data.index)
            # Find the last valid date (not NaT)
            last_valid_date = None
            for idx in reversed(sorted_index):
                if not pd.isna(idx):
                    last_valid_date = idx
                    break
                    
            if last_valid_date is None:
                print(f"No valid dates found in historical data for {symbol}, using 2024-12-10")
                # If no valid date found, use 2024-12-10 as specified
                last_valid_date = pd.Timestamp("2024-12-10")
            
            # Generate future dates starting from the day after the last historical date
            future_dates = pd.date_range(
                start=last_valid_date + pd.Timedelta(days=1),
                periods=30,
                freq='D'
            )

            # Create visualization
            graph = create_prediction_plot(historical_data, predictions, future_dates, symbol)

            return jsonify({
                'success': True,
                'symbol': symbol,
                'predictions': predictions,
                'graph': graph,
                'dates': [d.strftime('%Y-%m-%d') for d in future_dates],
                'is_mock': False
            })

        except Exception as e:
            print(f"Prediction error for {symbol}: {str(e)}")
            # Fall back to mock prediction on error
            return jsonify(generate_mock_prediction(symbol))
    else:
        # If model components are not available, use mock prediction
        print(f"Model components not found for {symbol}, using mock prediction.")
        return jsonify(generate_mock_prediction(symbol))

# =========================
# 9. Plot Generation Function
# =========================

def create_prediction_plot(historical_data, predictions, future_dates, symbol, is_mock=False):
    """
    Creates a visualization of historical data and predictions.
    
    Parameters:
    - historical_data (DataFrame): Historical stock data.
    - predictions (list/array): Predicted stock prices.
    - future_dates (DatetimeIndex): Dates for predictions.
    - symbol (str): Stock symbol.
    - is_mock (bool): Whether the data is mock data.
    
    Returns:
    - str: Base64-encoded PNG image.
    """
    try:
        plt.figure(figsize=(15, 8))
        
        # Filter out any NaT values in historical_data
        valid_historical_data = historical_data[~pd.isna(historical_data.index)]
        
        # Plot historical data (last 100 points or all if less)
        historical_display_count = min(100, len(valid_historical_data))
        if historical_display_count > 0:
            historical_dates = valid_historical_data.index[-historical_display_count:]
            historical_values = valid_historical_data['Close'].values[-historical_display_count:]
            plt.plot(historical_dates, historical_values, 
                    label='Historical Close', color='blue', linewidth=2)
        
        # Ensure future_dates is a proper DatetimeIndex
        if not isinstance(future_dates, pd.DatetimeIndex):
            # Convert to DatetimeIndex if it's a list of datetime-like objects
            try:
                future_dates = pd.DatetimeIndex(future_dates)
            except:
                # Fall back to creating a new DatetimeIndex from today
                future_dates = pd.date_range(
                    start=pd.Timestamp.now().normalize(),
                    periods=len(predictions),
                    freq='D'
                )
        
        # Plot predictions
        plt.plot(future_dates, predictions, label='Predicted Close', 
                color='red', linestyle='-', marker='o', markersize=5)
        
        title = f'{symbol} Price Prediction'
        if is_mock:
            title += ' (Simulated Data)'
        plt.title(title, fontsize=16)
        plt.xlabel('Date', fontsize=12)
        plt.ylabel('Price (NPR)', fontsize=12)
        plt.legend()
        plt.grid(True)
        plt.xticks(rotation=45)
        plt.tight_layout()

        # Save to buffer
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=150)
        plt.close()
        return base64.b64encode(buffer.getvalue()).decode()
    
    except Exception as e:
        print(f"Error creating prediction plot: {str(e)}")
        # Create a simple fallback plot
        try:
            plt.figure(figsize=(15, 8))
            plt.plot(range(len(predictions)), predictions, color='red', label='Predicted')
            plt.title(f"{symbol} Price Prediction (Fallback Plot)")
            plt.grid(True)
            plt.legend()
            
            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=150)
            plt.close()
            return base64.b64encode(buffer.getvalue()).decode()
        except:
            # Last resort if even the fallback plot fails
            return ""

# =========================
# 10. News Routes
# =========================

@app.route('/api/news/<category>', methods=['GET'])
@app.route('/api/news', methods=['GET'])
def get_news(category=None):
    """
    Retrieves news articles based on the specified category.

    Parameters:
    - category (str, optional): The news category. Defaults to 'all'.
    """
    if category is None:
        category = request.args.get('category', 'all')
    
    try:
        # Get the absolute path to news_links.json
        current_dir = os.path.dirname(os.path.abspath(__file__))
        news_file_path = os.path.join(current_dir, 'news_links.json')

        # Check if file exists
        if not os.path.exists(news_file_path):
            return jsonify([])  # Return empty array if file doesn't exist

        # Read the news data
        with open(news_file_path, 'r', encoding='utf-8') as f:
            news_data = json.load(f)

        # Handle category selection
        if category.lower() == 'all':
            all_news = []
            for cat_news in news_data.values():
                if isinstance(cat_news, list):
                    all_news.extend(cat_news)
            return jsonify(all_news)

        # Return category-specific news or empty list if category doesn't exist
        return jsonify(news_data.get(category, []))

    except Exception as e:
        print(f"Error fetching news: {str(e)}")  # Log the error
        return jsonify([])  # Return empty array on error

# =========================
# 11. Market Summary Route
# =========================

@app.route('/api/market-summary', methods=['GET'])
def get_market_summary():
    """
    Retrieves market summary data.
    """
    try:
        with open('market-summary-1.json', 'r') as f:
            market_summary_data = json.load(f)
        return jsonify(market_summary_data)
    except FileNotFoundError:
        return jsonify({"error": "Market summary data not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error parsing market summary data"}), 500

# =========================
# 12. Analysis Route
# =========================
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        script = data.get('script')
        image_data = data.get('image')
        
        if not script or not image_data:
            return jsonify({'error': 'Missing script or image data'}), 400

        # Extract base64 data
        if 'base64,' in image_data:
            image_data = image_data.split('base64,')[1]
        
        # Attempt to decode the base64 string to verify it's valid
        try:
            image_bytes = base64.b64decode(image_data)
            # Make sure it's a valid image of reasonable size
            if len(image_bytes) < 100:
                raise ValueError("Image data too small")
        except Exception as img_error:
            print(f"Invalid image data: {str(img_error)}")
            # Generate fallback analysis instead of returning an error
            return generate_fallback_analysis(script)

        # Create the prompt
        prompt = f"""Analyze stock ${script} based on the provided image.
                    Market Performance: Briefly compare actual market performance to the predicted price trend.
                    Risk Factors: Suggest concise entry and exit strategies for both traders and investors.
                    Market Trend: Identify the overall market trend based on the image.
                    Provide concise, actionable insights with no explanations."""

        # Generate response with error handling
        try:
            response = model.generate_content([
                prompt,
                {
                    'mime_type': 'image/png',
                    'data': image_bytes
                }
            ])
            
            if not hasattr(response, 'text') or not response.text:
                return generate_fallback_analysis(script)
                
            return jsonify({'analysis': response.text})
                
        except Exception as ai_error:
            print(f"AI generation error: {str(ai_error)}")
            return generate_fallback_analysis(script)
            
    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}")
        return generate_fallback_analysis(script)

def generate_fallback_analysis(script):
    """Generate fallback analysis when the AI model fails"""
    
    # Define custom analysis templates for each script
    script_templates = {
        'SCB': {
            'trend': 'upward',
            'performance': 'strong consistent growth',
            'entry': '480-500',
            'exit': '550-570',
            'risk': 'medium',
        },
        'NABIL': {
            'trend': 'bullish with volatility',
            'performance': 'outperforming the sector',
            'entry': '1150-1180',
            'exit': '1250-1280',
            'risk': 'medium-low',
        },
        'JBBL': {
            'trend': 'sideways with upward potential',
            'performance': 'stable with moderate growth',
            'entry': '380-400',
            'exit': '430-450',
            'risk': 'medium',
        },
        'API': {
            'trend': 'moderately bullish',
            'performance': 'recovering from recent dips',
            'entry': '290-305',
            'exit': '330-345',
            'risk': 'medium-high',
        },
        'NTC': {
            'trend': 'upward with resistance',
            'performance': 'steady growth with periodic consolidation',
            'entry': '880-900',
            'exit': '940-960',
            'risk': 'low',
        },
    }
    
    # Default template if script not found
    default_template = {
        'trend': 'neutral',
        'performance': 'following market average',
        'entry': 'current support levels',
        'exit': '8-10% above entry point',
        'risk': 'medium',
    }
    
    # Get template for this script or use default
    template = script_templates.get(script, default_template)
    
    # Create fallback analysis
    analysis = f"""## {script} Stock Analysis

### Market Performance
The stock shows a {template['trend']} trend with {template['performance']}. The prediction indicates potential for continued growth in the short to medium term.

### Risk Factors
- **Entry Strategy**: Consider entering at {template['entry']} price range during pullbacks.
- **Exit Strategy**: Set profit targets at {template['exit']} with stop losses 5-7% below entry.
- **Risk Level**: {template['risk'].capitalize()} risk profile based on recent volatility patterns.

### Market Trend
Overall market trend appears {template['trend']} with potential resistance at higher levels. Volume remains supportive of the current trend direction."""

    return jsonify({'analysis': analysis, 'is_fallback': True})

# =========================
# 13. Stock Directory Structure Check
# =========================

@app.route('/api/check-model-availability', methods=['GET'])
def check_model_availability():
    """
    Checks which stock models are available and returns their status.
    Useful for frontend to determine which models can provide real predictions.
    """
    supported_symbols = ['SCB', 'NABIL', 'JBBL', 'API', 'NTC']
    model_status = {}
    
    for symbol in supported_symbols:
        model_dir = os.path.join('D:\\Model', symbol, 'model_components')
        model_path = os.path.join(model_dir, f'{symbol}_model.pth')
        scaler_path = os.path.join(model_dir, f'{symbol}_scaler.pkl')
        sequence_path = os.path.join(model_dir, f'{symbol.lower()}_last_sequence.npy')
        
        # Check if required files exist
        has_model = os.path.exists(model_path)
        has_scaler = os.path.exists(scaler_path)
        has_sequence = os.path.exists(sequence_path)
        
        model_status[symbol] = {
            'available': has_model and has_scaler and has_sequence,
            'files': {
                'model': has_model,
                'scaler': has_scaler,
                'sequence': has_sequence
            }
        }
    
    return jsonify(model_status)

# =========================
# 14. Main Execution
# =========================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)