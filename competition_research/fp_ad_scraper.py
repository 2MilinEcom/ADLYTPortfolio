from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def search_facebook_ads(keyword):
    # Set up Chrome options
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")

    # Initialize the driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    wait = WebDriverWait(driver, 15)

    # Navigate directly to the filtered Ad Library page
    url = f"https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q={keyword}&search_type=keyword_unordered"
    print(f"🌐 Navigating to: {url}")
    driver.get(url)
    
    # Wait for page load
    print("⏳ Waiting for page to load...")
    try:
        selectors = [
            "div[role='main']",
            "div[data-testid='ad-card']",
            "div[class*='ad']",
            "div[class*='feed']",
            "body"
        ]
        page_loaded = False
        for selector in selectors:
            try:
                wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                print(f"✅ Page loaded successfully with selector: {selector}")
                page_loaded = True
                break
            except:
                continue
        if not page_loaded:
            print("⚠️ Could not detect page load, continuing anyway...")
    except Exception as e:
        print(f"⚠️ Error waiting for page: {e}. Continuing anyway...")
    
    time.sleep(3)

    # Updated scroll logic — keep scrolling until no new ads load
    print("🔄 Scrolling to load all ads...")
    previous_height = driver.execute_script("return document.body.scrollHeight")
    scroll_attempts = 0
    max_scrolls = 25  # Increase if needed

    while scroll_attempts < max_scrolls:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == previous_height:
            print("📉 No more content to load.")
            break
        previous_height = new_height
        scroll_attempts += 1
        print(f"⬇️ Scroll {scroll_attempts} complete...")

    print("🔍 Scanning for page names (sponsors)...")

    page_names = []
    exclude_words = [
        'sponsored', 'ad', 'facebook', 'privacy', 'terms', 'cookies', 'help',
        'instagram', 'launched', 'watch more', 'results', 'live sale', 'shop now',
        'install now', 'learn more', 'cookies',
        'english (us)', 'branded content', 'insta', 'play.google.com'
    ]

    # Method 1: CSS selectors
    try:
        selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'div[role="heading"]',
            'span[class*="title"]',
            'a[class*="title"]',
            'div[class*="name"]',
            'span[class*="name"]'
        ]
        for selector in selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                for element in elements:
                    text = element.text.strip()
                    if text and 2 < len(text) < 100:
                        if not any(word.lower() in text.lower() for word in exclude_words):
                            page_names.append(text)
            except:
                continue
        print(f"✅ Method 1 found {len(page_names)} potential page names")
    except Exception as e:
        print(f"❌ Method 1 error: {e}")
    
    # Method 2: Text before "Sponsored"
    try:
        sponsored_elements = driver.find_elements(By.XPATH, "//*[contains(text(), 'Sponsored')]")
        for element in sponsored_elements:
            try:
                parent = element.find_element(By.XPATH, "./..")
                full_text = parent.text.strip()
                if 'Sponsored' in full_text:
                    page_name = full_text.split('Sponsored')[0].strip()
                    if page_name and len(page_name) > 2:
                        if not any(word.lower() in page_name.lower() for word in exclude_words):
                            page_names.append(page_name)
            except:
                continue
        print(f"✅ Method 2 found {len(page_names)} potential page names")
    except Exception as e:
        print(f"❌ Method 2 error: {e}")

    # Method 3: Links
    try:
        links = driver.find_elements(By.TAG_NAME, 'a')
        for link in links:
            try:
                text = link.text.strip()
                href = link.get_attribute('href') or ''
                if (text and 2 < len(text) < 100 and 
                    ('facebook.com' in href or '/ads/library' in href) and
                    not any(word.lower() in text.lower() for word in exclude_words)):
                    page_names.append(text)
            except:
                continue
        print(f"✅ Method 3 found {len(page_names)} potential page names")
    except Exception as e:
        print(f"❌ Method 3 error: {e}")

    # Final deduplication
    unique_page_names = list(set(name.strip() for name in page_names if name.strip()))
    print(f"\n📊 Found {len(unique_page_names)} unique page names (sponsors):\n")
    for i, name in enumerate(unique_page_names, 1):
        print(f"{i}. {name}")

    print(f"\n🎯 Total unique sponsors for '{keyword}': {len(unique_page_names)}")

    try:
        print(f"\n📄 Page title: {driver.title}")
        print(f"🌐 Current URL: {driver.current_url}")
    except:
        pass

    driver.quit()

if __name__ == "__main__":
    search_facebook_ads("Striped Pajamas")
