import requests
from bs4 import BeautifulSoup
import json

BASE_URL = "https://eng.merolagani.com"

def scrape_news():
    response = requests.get(BASE_URL)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Let's print the HTML to debug    
    news_data = {
        "all": [],
        "company": [],
        "market": [],
        "corporate": []
    }
    
    loop_through = {
        '1': 'StockMarketNews',
        '2': 'CompanyNews',
        '4': 'CorporateNews'
    }

    for key, value in loop_through.items():
        # Print the ID we're looking for
        search_id = f"ctl00_ContentPlaceHolder1_rpt{value}_ctl00_NewsBlock{key}_divNewsBlock"
        print(f"Searching for ID: {search_id}")
        
        articles = soup.find(id=search_id)
        if articles is None:
            print(f"Could not find element with ID: {search_id}")
            continue
            
        for article in articles.find_all('a'):
            title = article.text.strip()
            url = BASE_URL + article.get("href")
            if url and title:
                news_data["all"].append({"title": title, "url": url})
                
                category_map = {
                    'StockMarketNews': 'market',
                    'CompanyNews': 'company',
                    'CorporateNews': 'corporate'
                }
                
                if value in category_map:
                    category = category_map[value]
                    news_data[category].append({"title": title, "url": url})

    # Save the data
    with open('news_links.json', 'w') as f:
        json.dump(news_data, f, indent=4)

    return news_data

try:
    scrape_news()
except Exception as e:
    print(f"Error occurred: {str(e)}")
