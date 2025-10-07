import time
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    def log_response(response):
        print(f"\n--- Network Response ---")
        print(f"URL: {response.url}")
        print(f"Status: {response.status}")
        try:
            print(f"Body: {response.json()}")
        except Exception:
            print(f"Body (text): {response.text()}")
        print(f"----------------------\n")

    page.on("response", log_response)

    try:
        print("Navigating to registration page...")
        page.goto("http://localhost:5173/register")
        expect(page.get_by_role("heading", name="Create Your Account")).to_be_visible()

        print("Registering a new user to capture network response...")
        timestamp = int(time.time())
        patient_email = f"patient{timestamp}@example.com"

        page.get_by_label("First Name").fill("Debug")
        page.get_by_label("Last Name").fill("User")
        page.get_by_label("Username").fill(f"debuguser{timestamp}")
        page.get_by_label("Email Address").fill(patient_email)
        page.get_by_label("Phone Number").fill("5555555555")
        page.get_by_label("Password *").first.fill("Password123!")
        page.get_by_label("Confirm Password").fill("Password123!")
        page.get_by_role("button", name="Create Account").click()

        print("Registration form submitted. Waiting for network response...")
        page.wait_for_timeout(5000) # Wait for 5 seconds to ensure response is captured

        print("\nDebug script finished.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)