import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json

BASE_URL = "https://eng.merolagani.com"

def scrape_summary():
    while True:  # Loop the scraping function
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
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "table[data-live-label='#label-market-summary-1']"))
            )

            # Wait for the span with id='label-market-summary-1' to load
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "label-market-summary-1"))
            )
            
            # Get the rendered page source
            page_source = driver.page_source

            # Parse the page source with BeautifulSoup
            soup = BeautifulSoup(page_source, "html.parser")

            # Extract the span with id='label-market-summary-1'
            heading = soup.find('span', id='label-market-summary-1')
            heading_text = heading.text.strip() if heading else "Market Summary"

            # Format the heading
            formatted_heading = f"Market Summary {heading_text}"

            # Extract the table with data-live-label='#label-market-summary-1'
            table = soup.find('table', attrs={'data-live-label': '#label-market-summary-1'})
            summary_data = {}
            if table:
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all('td')
                    if len(cells) == 2:
                        key = cells[0].get_text(strip=True)
                        value = cells[1].get_text(strip=True)
                        summary_data[key] = value
            else:
                print("Table not found")
            
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
        
        # Wait for 30 seconds before running again
        time.sleep(30)

if __name__ == "__main__":
    scrape_summary()
