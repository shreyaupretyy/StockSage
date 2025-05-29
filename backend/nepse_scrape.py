import socket
import json
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import (
    TimeoutException,
    NoSuchElementException,
    ElementClickInterceptedException,
    ElementNotInteractableException,
)
from webdriver_manager.chrome import ChromeDriverManager

def check_internet_connection():
    """
    Checks if the internet connection is active by attempting to connect to Google's DNS.
    
    Returns:
        bool: True if the connection is successful, False otherwise.
    """
    try:
        # Attempt to connect to Google's DNS server
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return True
    except OSError:
        return False

def setup_driver():
    """
    Sets up the Selenium WebDriver with the necessary configurations.
    
    Returns:
        webdriver.Chrome: Configured Chrome WebDriver instance.
    """
    options = Options()
    # Uncomment the next line to run Chrome in headless mode (no GUI)
    # options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')  # Ensures all elements are visible
    options.add_argument('--start-maximized')  # Starts the browser maximized

    # Initialize WebDriver using webdriver_manager for automatic driver management
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(30)
    driver.set_script_timeout(30)

    return driver

def scrape_sectors_and_companies(driver, url):
    """
    Navigates to the specified URL, iterates through each sector (including the default),
    and scrapes company data.
    
    Args:
        driver (webdriver.Chrome): The Selenium WebDriver instance.
        url (str): The URL of the ShareSansar company list page.
    
    Returns:
        tuple: A tuple containing a list of sectors and a list of companies.
    """
    try:
        print("Navigating to URL...")
        driver.get(url)
        wait = WebDriverWait(driver, 20)

        # Locate the sector dropdown by its name attribute
        sector_dropdown = wait.until(EC.presence_of_element_located((By.NAME, "sector")))
        select = Select(sector_dropdown)

        # Retrieve the default selected sector (e.g., "Commercial Bank")
        default_sector_option = select.first_selected_option
        default_sector_id = default_sector_option.get_attribute('value')
        default_sector_name = default_sector_option.text.strip()

        all_companies = []
        sectors = []

        # Process the default selected sector first
        if default_sector_id:
            print(f"\nProcessing default sector: {default_sector_name}")

            # Click the search button to load companies for the default sector
            try:
                search_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Search')]")
                if search_buttons:
                    search_buttons[0].click()
                    print(f"Clicked search button for sector: {default_sector_name}")
                else:
                    print(f"Warning: Could not find search button for sector {default_sector_name}")
                    # Optionally, you can choose to skip processing this sector
            except (ElementClickInterceptedException, ElementNotInteractableException) as e:
                print(f"Error clicking search button for {default_sector_name}: {e}")
                # Continue to the next sector if unable to click search
                pass

            # Wait for the table to load by checking the presence of the table container
            try:
                wait.until(EC.presence_of_element_located((By.CLASS_NAME, "table-responsive")))
                time.sleep(2)  # Additional wait to ensure AJAX content is fully loaded
            except TimeoutException:
                print(f"Timeout waiting for table to load for sector {default_sector_name}")
                # Optionally, you can choose to skip processing this sector
                pass

            # Locate the updated table
            try:
                table = driver.find_element(By.CLASS_NAME, "table-responsive")
                rows = table.find_elements(By.CSS_SELECTOR, "tbody tr")
            except NoSuchElementException:
                print(f"Error: Table not found for sector {default_sector_name}")
                rows = []

            # Extract company data from each row
            sector_companies = []
            for row in rows:
                try:
                    cols = row.find_elements(By.TAG_NAME, "td")
                    if len(cols) >= 8:  # Ensure the row has the required columns
                        company = {
                            'symbol': cols[1].text.strip(),
                            'name': cols[2].text.strip(),
                            'sector': default_sector_name,
                            'listed_shares': cols[3].text.strip(),
                            'paid_up': cols[4].text.strip(),
                            'total_paid_up_capital': cols[5].text.strip(),
                            'market_capitalization': cols[6].text.strip(),
                            'market_price': cols[8].text.strip(),
                            'as_of': cols[9].text.strip()
                        }
                        sector_companies.append(company)
                except Exception as row_error:
                    print(f"Error processing row in {default_sector_name}: {row_error}")

            print(f"Found {len(sector_companies)} companies in {default_sector_name}")
            sectors.append({'id': default_sector_id, 'name': default_sector_name})
            all_companies.extend(sector_companies)

            # Pause briefly before processing the next sector
            time.sleep(1)

        # Now, iterate over the remaining sector options
        sector_options = select.options[1:]  # Skip the first option if it's a placeholder

        for option in sector_options:
            sector_id = option.get_attribute('value')
            sector_name = option.text.strip()

            if not sector_id or sector_id == default_sector_id:
                continue  # Skip if no valid sector ID or it's the default sector already processed

            print(f"\nProcessing sector: {sector_name}")

            # Select the sector from the dropdown
            select.select_by_value(sector_id)

            # Wait briefly to ensure the selection is registered
            time.sleep(1)

            # Click the search button to load companies for the selected sector
            try:
                search_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Search')]")
                if search_buttons:
                    search_buttons[0].click()
                    print(f"Clicked search button for sector: {sector_name}")
                else:
                    print(f"Warning: Could not find search button for sector {sector_name}")
                    continue  # Skip to the next sector if search button not found
            except (ElementClickInterceptedException, ElementNotInteractableException) as e:
                print(f"Error clicking search button for {sector_name}: {e}")
                continue  # Skip to the next sector if unable to click search

            # Wait for the table to load by checking the presence of the table container
            try:
                wait.until(EC.presence_of_element_located((By.CLASS_NAME, "table-responsive")))
                time.sleep(2)  # Additional wait to ensure AJAX content is fully loaded
            except TimeoutException:
                print(f"Timeout waiting for table to load for sector {sector_name}")
                continue  # Skip to the next sector if table doesn't load

            # Locate the updated table
            try:
                table = driver.find_element(By.CLASS_NAME, "table-responsive")
                rows = table.find_elements(By.CSS_SELECTOR, "tbody tr")
            except NoSuchElementException:
                print(f"Error: Table not found for sector {sector_name}")
                rows = []

            # Extract company data from each row
            sector_companies = []
            for row in rows:
                try:
                    cols = row.find_elements(By.TAG_NAME, "td")
                    if len(cols) >= 8:  # Ensure the row has the required columns
                        company = {
                            'symbol': cols[1].text.strip(),
                            'name': cols[2].text.strip(),
                            'sector': sector_name,
                            'listed_shares': cols[3].text.strip(),
                            'paid_up': cols[4].text.strip(),
                            'total_paid_up_capital': cols[5].text.strip(),
                            'market_capitalization': cols[6].text.strip(),
                            'market_price': cols[8].text.strip(),
                            'as_of': cols[9].text.strip()
                            
                            
                        }
                        sector_companies.append(company)
                except Exception as row_error:
                    print(f"Error processing row in {sector_name}: {row_error}")

            print(f"Found {len(sector_companies)} companies in {sector_name}")
            sectors.append({'id': sector_id, 'name': sector_name})
            all_companies.extend(sector_companies)

            # Pause briefly before processing the next sector
            time.sleep(1)

        print(f"\nTotal sectors processed: {len(sectors)}")
        print(f"Total companies scraped: {len(all_companies)}")
        return sectors, all_companies
    
    except:
        return

def save_data():
    """
    Main function to execute the scraping process and save the data to JSON files.
    
    Returns:
        bool: True if data is saved successfully, False otherwise.
    """
    # Check for internet connectivity before proceeding
    if not check_internet_connection():
        print("No internet connection. Please check your connection and try again.")
        return False

    driver = None
    try:
        driver = setup_driver()
        url = "https://www.sharesansar.com/company-list"

        sectors, companies = scrape_sectors_and_companies(driver, url)

        if sectors and companies:
            # Create 'data' directory if it doesn't exist
            if not os.path.exists('data'):
                os.makedirs('data')

            # Save sectors to JSON
            with open('data/sectors.json', 'w', encoding='utf-8') as f:
                json.dump(sectors, f, indent=2, ensure_ascii=False)

            # Save companies to JSON
            with open('data/companies.json', 'w', encoding='utf-8') as f:
                json.dump(companies, f, indent=2, ensure_ascii=False)

            print(f"Successfully saved {len(sectors)} sectors and {len(companies)} companies.")
            return True
        else:
            print("No data to save.")
            return False

    except Exception as e:
        print(f"Error in main process: {str(e)}")
        return False

    finally:
        if driver:
            driver.quit()
            print("WebDriver closed successfully.")

if __name__ == "__main__":
    save_data()