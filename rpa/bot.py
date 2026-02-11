import os
import requests
from playwright.sync_api import sync_playwright

API_BASE_URL = os.getenv("API_BASE_URL", "http://backend:8000")

def run_wiki_rpa(search_term: str):
    result = {"status": "error", "message": "Unknown error", "data": None}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # 1. Open Wikipedia
            print(f"Opening Wikipedia to search for: {search_term}")
            page.goto("https://en.wikipedia.org/wiki/Main_Page")
            
            # 2. Search for term
            page.fill("input[name='search']", search_term)
            page.press("input[name='search']", "Enter")
            
            # Wait for results
            page.wait_for_selector("#mw-content-text")
            
            # 3. Extract first paragraph
            print("Extracting content...")
            first_paragraph = page.locator("#mw-content-text .mw-parser-output > p:not(.mw-empty-elt)").first.inner_text()
            
            print(f"Extracted: {first_paragraph[:50]}...")
            
            # 4. Login to get Token
            print("Authenticating...")
            login_response = requests.post(
                f"{API_BASE_URL}/auth/login",
                data={"username": "TRUE", "password": "TALENT"},
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            
            if login_response.status_code != 200:
                return {"status": "error", "message": f"Login Failed: {login_response.text}"}

            token = login_response.json()["access_token"]
            
            # 5. Send to Assistant API
            print("Sending to API for summarization...")
            response = requests.post(
                f"{API_BASE_URL}/assistant/summarize",
                json={"text": first_paragraph},
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code == 200:
                result = {"status": "success", "data": response.json()}
            else:
                result = {"status": "error", "message": f"Summarize Failed: {response.text}"}
                
        except Exception as e:
            print(f"RPA Error: {e}")
            result = {"status": "error", "message": str(e)}
            
        finally:
            browser.close()
            
    return result
