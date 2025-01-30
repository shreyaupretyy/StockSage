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
            'C:\\Users\\DELL\\Desktop\\For Students IOE\\Merolagani Nepse Data\\ALL STOCK CHARTS\\Commercial Banks',
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
# 3. Load Data Function
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
# 4. Database Models
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
# 5. Authentication Routes
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
# 6. Portfolio Routes
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
# 7. Prediction Routes
# =========================

@app.route('/api/predict/<symbol>', methods=['GET'])
def predict(symbol):
    supported_symbols = ['SCB']
    if symbol not in supported_symbols:
        return jsonify({'success': False, 'error': f"Symbol {symbol} not supported."}), 400

    # Load model components
    result = load_model_and_scaler(symbol)
    if result is None or any(x is None for x in result):
        return jsonify({'success': False, 'error': "Failed to load model components."}), 500
    
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

        # Generate future dates
        future_dates = pd.date_range(
            start=historical_data.index[-1] + pd.Timedelta(days=1),
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
            'dates': [d.strftime('%Y-%m-%d') for d in future_dates]
        })

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# =========================
# 4. Plot Generation Function
# =========================

def create_prediction_plot(historical_data, predictions, future_dates, symbol):
    plt.figure(figsize=(15, 8))
    
    # Plot historical data
    historical_dates = historical_data.index[-100:]
    plt.plot(historical_dates, historical_data['Close'].values[-100:], 
             label='Historical Close', color='blue', linewidth=2)
    
    # Plot predictions
    plt.plot(future_dates, predictions, label='Predicted Close', 
             color='red', linestyle='-', marker='o', markersize=5)
    
    plt.title(f'{symbol} Price Prediction', fontsize=16)
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



# =========================
# 9. News Routes
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
# 10. Market Summary Route
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
# 11. Analysis Route
# =========================
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/api/analyze', methods=['POST'])
# @jwt_required()
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

        # Create the prompt
        prompt = f"""Analyze stock ${script} based on the provided image.
                    Market Performance: Briefly compare actual market performance to the predicted price trend.
                    Risk Factors: Suggest concise entry and exit strategies for both traders and investors.
                    Market Trend: Identify the overall market trend based on the image.
                    Provide concise, actionable insights with no explanations."""

        # Generate response
        response = model.generate_content([
            prompt,
            {
                'mime_type': 'image/png',
                'data': base64.b64decode(image_data)
            }
        ])

        return jsonify({'analysis': response.text})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Analysis failed. Please try again.'}), 500
# =========================
# 13. Main Execution
# =========================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)