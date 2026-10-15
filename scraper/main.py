tiktoklinks = ["https://www.tiktok.com/t/ZTrFmBf2d/"]

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
import time
from selenium import webdriver


print("Launching browser...")

# THIS IS TIKTOK RIPS
def get_links():
   options = uc.ChromeOptions()
   options.add_argument("--user-data-dir=selenium")  # Reuses login session
   options.add_argument("--no-sandbox")
   options.add_argument("--disable-blink-features=AutomationControlled")

   try:
       driver = uc.Chrome(options=options)
       print("Browser launched. Opening TikTok...")


       driver.get(f"{tiktoklinks[0]}")
       time.sleep(3)

### This is to rip searches

    #    input("👉 Please log in manually in the browser window. Then press ENTER here to continue...")


    #    print("Navigating to search page...")
    #    search_term = "strapless bra"
    #    driver.get(f"https://www.tiktok.com/search?q={search_term.replace(' ', '%20')}")
    #    time.sleep(5)


    #    print("Scrolling and collecting links...")
    #    for _ in range(3):
    #        driver.execute_script("window.scrollBy(0, 1000)")
    #        time.sleep(2)


    #    print("Scraping links...")
    #    videos = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"]')
    #    links = list(set([v.get_attribute("href") for v in videos if v.get_attribute("href")]))
    #    with open("scraper/links.txt", "w") as f:
    #        for link in links:
    #            f.write(link + "\n")
    #    print(f"\n✅ Found {len(links)} video links:")
    #    for link in links:
    #        print(link)


       input("\nPress ENTER to close the browser...")


   except Exception as e:
       print(f"❌ An error occurred: {e}")
   finally:
       try:
           driver.quit()
       except:
           pass


from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def download_from_snaptik(tiktok_link):
   options = uc.ChromeOptions()
   options.add_argument("--no-sandbox")
   options.add_argument("--disable-blink-features=AutomationControlled")

   driver = uc.Chrome(headless=False, use_subprocess=True, options=options)



   driver.get("https://snaptik.kim/")
   time.sleep(2)


   print("Pasting TikTok link...")
   input_box = driver.find_element(By.NAME, "page")
   input_box.send_keys(tiktok_link)


   submit = driver.find_element(By.XPATH, "//button[contains(text(),'Download')]")
   submit.click()


   print("Waiting for SnapTik to process the link...")
   time.sleep(5)  # Wait for result links to appear
   try:
       # Wait for the final download <a> tag
       final_button = WebDriverWait(driver, 15).until(
           EC.element_to_be_clickable((By.XPATH, "//a[contains(@class, 'btn-dl') and contains(text(), 'Download')]"))
       )


       print("✅ Final download button found! Clicking it...")
       final_button.click()
       time.sleep(10)  # Let the file download
   except Exception as e:
       print(f"❌ Could not find or click final download button: {e}")
   download_links = driver.find_elements(By.PARTIAL_LINK_TEXT, "Download Server")
   if download_links:
       print("✅ Download link found!")
       download_links[0].click()
       time.sleep(10)  # Let it download in browser
   else:
       print("❌ Download link not found")


   driver.quit()


# Example usage
# get_links() enter search product
with open("scraper/links.txt", "r") as f:
   for line in f:
       link = line.strip()
       if link:
           download_from_snaptik(link)
  

