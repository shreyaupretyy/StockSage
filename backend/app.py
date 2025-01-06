from flask import Flask, jsonify, request
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True)
