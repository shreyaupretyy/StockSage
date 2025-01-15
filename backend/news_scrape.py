import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_sharesansar():
    options = webdriver.ChromeOptions()
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        # URL to scrape
        url = 'https://www.sharesansar.com/company/scb'
        driver.get(url)
        
        # Wait for initial page load
        time.sleep(5)
        
        # Click the news tab
        news_tab = driver.find_element(By.CSS_SELECTOR, "a[href='#cnews']")
        driver.execute_script("arguments[0].click();", news_tab)
        time.sleep(3)
        
        # Wait for the DataTable to be fully loaded
        wait = WebDriverWait(driver, 10)
        table = wait.until(EC.presence_of_element_located((By.ID, "myTableCNews")))
        
        # Open CSV file for writing
        with open('sharesansar_news.csv', mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Date', 'Title', 'URL'])  # Write the header row

            # Loop through each page
            page_number = 1
            while True:
                # Wait for rows to be present on the current page
                rows = wait.until(EC.presence_of_all_elements_located(
                    (By.CSS_SELECTOR, "#myTableCNews tbody tr")
                ))
                
                print(f"\nScraping page {page_number}")
                print("-" * 100)
                
                # Process each row
                for index, row in enumerate(rows, 1):
                    try:
                        # Get date and title columns
                        cols = row.find_elements(By.TAG_NAME, "td")
                        if len(cols) >= 2:
                            date = cols[0].text.strip()
                            title_cell = cols[1]
                            
                            # Get link if present
                            links = title_cell.find_elements(By.TAG_NAME, "a")
                            if links:
                                title = links[0].text.strip()
                                url = links[0].get_attribute('href')
                            else:
                                title = title_cell.text.strip()
                                url = 'N/A'
                            
                            # Write data to CSV file
                            writer.writerow([date, title, url])
                
                    except Exception as e:
                        print(f"Error processing row {index}: {str(e)}")
                        continue

                # Check for the "Next" button for pagination
                try:
                    next_button = driver.find_element(By.CSS_SELECTOR, "#myTableCNews_next")
                    if "disabled" not in next_button.get_attribute('class'):
                        next_button.click()
                        time.sleep(3)  # Adjust this sleep time if needed
                        page_number += 1
                    else:
                        break  # No more pages
                except NoSuchElementException:
                    print("\nNo pagination found")
                    break

    except Exception as e:
        print(f"An error occurred: {str(e)}")
    finally:
        driver.quit()

if __name__ == "__main__":
    scrape_sharesansar()
