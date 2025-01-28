from flask import Flask, jsonify, request, json
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import google.generativeai as genai
import os
import requests
from dotenv import load_dotenv
import base64

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/stocksage_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'root'  # Change this!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro-vision')

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    def __repr__(self):
        return f'<User {self.email}>'

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not all(k in data for k in ('email', 'password', 'full_name')):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        full_name=data['full_name'],
        email=data['email'],
        password=hashed_password
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Registration successful'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'message': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    access_token = create_access_token(identity=user.email)
    
    return jsonify({
        'token': access_token,
        'user': {
            'email': user.email,
            'full_name': user.full_name
        }
    }), 200

# Analysis Route
@app.route('/api/analyze', methods=['POST'])
@jwt_required()
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
        prompt = f"""Analyze the stock {script} as a financial expert. Consider:
        - Recent market performance
        - Key financial indicators
        - Industry trends
        - Risk factors
        Provide concise, actionable insights in bullet points. 
        Include the chart analysis from the provided image."""

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

# Existing news API
@app.route('/api/news', methods=['GET'])
@jwt_required()
def get_news():
    with open('news_links.json', 'r') as f:
        news_data = json.load(f)

    category = request.args.get('category', 'all')

    if category == 'all':
        all_news = []
        for cat_news in news_data.values():
            all_news.extend(cat_news)
        return jsonify(all_news)

    return jsonify(news_data.get(category, []))

# Market summary API
@app.route('/api/market-summary', methods=['GET'])
@jwt_required()
def get_market_summary():
    try:
        with open('market-summary-1.json', 'r') as f:
            market_summary_data = json.load(f)
        return jsonify(market_summary_data)
    except FileNotFoundError:
        return jsonify({"error": "market-summary-1.json file not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding the JSON file"}), 500

# Protected route
@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'logged_in_as': current_user}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)