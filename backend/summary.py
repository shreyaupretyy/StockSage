import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

BASE_URL = "https://eng.merolagani.com"

def scrape_summary():
    # Set up Chrome options for headless mode
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    
    # Initialize Selenium WebDriver with the options for headless mode
    driver = webdriver.Chrome(options=options)
    driver.get(BASE_URL)
    
    try:
        # Wait for the table with data-live-label='#label-market-summary-1' to load
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "table[data-live-label='#label-market-summary-1']"))
        )

        # Ensure dynamic updates by adding an additional wait
        time.sleep(5)  # Adjust this as needed for the website's loading time

        # Use JavaScript to get the updated HTML of the table
        table_html = driver.execute_script(
            "return document.querySelector('table[data-live-label=\"#label-market-summary-1\"]').outerHTML;"
        )

        # Use JavaScript to get the updated heading
        heading_text = driver.execute_script(
            "return document.getElementById('label-market-summary-1').innerText.trim();"
        )

        # Format the heading
        formatted_heading = f"Market Summary {heading_text}"

        # Process the table HTML using BeautifulSoup
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(table_html, "html.parser")

        # Extract rows from the table
        summary_data = {}
        rows = soup.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) == 2:
                key = cells[0].get_text(strip=True)
                value = cells[1].get_text(strip=True)
                summary_data[key] = value
        
        # Combine formatted heading and table data
        result = {
            "heading": formatted_heading,
            "summary": summary_data
        }

        # Save the result as a JSON file
        with open("market-summary-1.json", "w") as json_file:
            json.dump(result, json_file, indent=4)

        print("Data has been saved to market-summary-1.json")
    
    except Exception as e:
        print(f"An error occurred: {e}")
    
    finally:
        driver.quit()  # Close the browser

if __name__ == "__main__":
    scrape_summary()
