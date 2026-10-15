import time
import os
import undetected_chromedriver as uc
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

SEARCH_TERM = "strapless bra"
TIKTOK_SEARCH_URL = f"https://www.tiktok.com/search?q={SEARCH_TERM.replace(' ', '%20')}"
LINKS_FILE = "scraper/links.txt"


def init_browser(headless=False):
    options = uc.ChromeOptions()
    options.add_argument("--user-data-dir=selenium")  # Reuse login session
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-blink-features=AutomationControlled")
    if headless:
        options.add_argument("--headless=new")

    return uc.Chrome(version_main=137, options=options)


def login_and_scrape_links():
    print("🔍 Launching browser and navigating to TikTok search page...")
    driver = init_browser()

    try:
        driver.get(TIKTOK_SEARCH_URL)
        time.sleep(3)

        input("👉 Please log in manually if needed, then press ENTER here to continue...")

        print("📜 Scrolling and collecting video links...")
        for _ in range(3):
            driver.execute_script("window.scrollBy(0, 1000)")
            time.sleep(2)

        video_elements = driver.find_elements(By.CSS_SELECTOR, 'a[href*="/video/"]')
        video_links = list(set([el.get_attribute("href") for el in video_elements if el.get_attribute("href")]))

        os.makedirs(os.path.dirname(LINKS_FILE), exist_ok=True)
        with open(LINKS_FILE, "w") as f:
            for link in video_links:
                f.write(link + "\n")

        print(f"\n✅ Found {len(video_links)} unique video links:")
        for link in video_links:
            print(link)

        input("\nPress ENTER to close the browser...")
    except Exception as e:
        print(f"❌ Error while scraping links: {e}")
    finally:
        driver.quit()


def download_from_snaptik(tiktok_link):
    print(f"\n🎬 Downloading from SnapTik: {tiktok_link}")
    driver = init_browser()

    try:
        driver.get("https://snaptik.kim/")
        time.sleep(2)

        input_box = driver.find_element(By.NAME, "page")
        input_box.send_keys(tiktok_link)

        submit_btn = driver.find_element(By.XPATH, "//button[contains(text(),'Download')]")
        submit_btn.click()

        print("⏳ Waiting for download options...")
        WebDriverWait(driver, 15).until(
            EC.element_to_be_clickable((By.XPATH, "//a[contains(@class, 'btn-dl') and contains(text(), 'Download')]"))
        ).click()

        time.sleep(10)  # Let the file begin downloading

        download_links = driver.find_elements(By.PARTIAL_LINK_TEXT, "Download Server")
        if download_links:
            print("✅ Clicking download link...")
            download_links[0].click()
            time.sleep(10)
        else:
            print("❌ No download links found.")

    except Exception as e:
        print(f"❌ Error downloading video: {e}")
    finally:
        driver.quit()


def main():
    login_and_scrape_links()

    print("\n📁 Starting downloads...")
    if os.path.exists(LINKS_FILE):
        with open(LINKS_FILE, "r") as f:
            for line in f:
                link = line.strip()
                if link:
                    download_from_snaptik(link)
    else:
        print("❌ No links found. Run scraping first.")


if __name__ == "__main__":
    main()
