from flask import Flask, jsonify, request
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Existing news API
@app.route('/api/news', methods=['GET'])
def get_news():
    with open('news_links.json', 'r') as f:
        news_data = json.load(f)

    # Get the category from the query parameter
    category = request.args.get('category', 'all')  # Default to 'all' if undefined

    if category == 'all':
        # Combine all categories into one list
        all_news = []
        for cat_news in news_data.values():
            all_news.extend(cat_news)
        return jsonify(all_news)

    # Return news for the requested category, or empty list if invalid category
    return jsonify(news_data.get(category, []))


# New market-summary API
@app.route('/api/market-summary', methods=['GET'])
def get_market_summary():
    try:
        # Read the market-summary-1.json file
        with open('market-summary-1.json', 'r') as f:
            market_summary_data = json.load(f)
        
        # Return the data as JSON
        return jsonify(market_summary_data)

    except FileNotFoundError:
        return jsonify({"error": "market-summary-1.json file not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Error decoding the JSON file"}), 500


if __name__ == '__main__':
    app.run(debug=True)
