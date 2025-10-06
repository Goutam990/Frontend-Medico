import time
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Listen for console messages
    page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

    try:
        # 1. Go to registration page
        print("Navigating to registration page...")
        page.goto("http://localhost:5173/register")
        expect(page.get_by_role("heading", name="Create Your Account")).to_be_visible()

        # 2. Register a new user
        print("Registering a new user...")
        timestamp = int(time.time())
        username = f"testuser{timestamp}"
        email = f"test{timestamp}@example.com"
        password = "password123"

        page.get_by_label("Username").fill(username)
        page.get_by_label("Email Address").fill(email)
        page.get_by_label("Password *").first.fill(password)
        page.get_by_label("Confirm Password").fill(password)
        page.get_by_role("button", name="Create Account").click()

        # 3. Wait for a moment to see if navigation happens
        print("Waiting for navigation to occur...")
        page.wait_for_timeout(5000) # Wait 5 seconds

        print("\nVerification script completed.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)