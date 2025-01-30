# StockSage

StockSage is a web application designed for stock prediction. The application integrates advanced machine learning models with a user-friendly interface to provide accurate stock predictions.

## Features

- **Stock Prediction**: Leverages LSTM models for time-series forecasting.
- **Sentiment Analysis**: Utilizes FinBERT and VADER for sentiment analysis of financial news.
- **User-Friendly Interface**: Intuitive interface built with React.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/)
- **Backend**: [Flask](https://flask.palletsprojects.com/)
- **Machine Learning**: LSTM Model, [FinBERT](https://github.com/ProsusAI/finBERT), [VADER](https://github.com/cjhutto/vaderSentiment)

## Installation

### Prerequisites

- Node.js and npm
- Python 3.8+
- Virtual Environment (optional but recommended)

### Frontend Setup

1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

### Backend Setup

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. (Optional) Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Start the Flask server:
    ```bash
    flask run
    ```

## Usage

Once both the frontend and backend servers are running, open your browser and navigate to `http://localhost:3000` to access the StockSage application.

## Acknowledgements

- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [FinBERT](https://github.com/ProsusAI/finBERT)
- [VADER](https://github.com/cjhutto/vaderSentiment)

---

*StockSage* - Predicting the future, managing the present.
