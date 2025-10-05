from playwright.sync_api import sync_playwright, Page

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Listen for all console events and print them
    page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

    try:
        print("Navigating to registration page to capture console logs...")
        page.goto("http://localhost:5173/register", wait_until="networkidle")

        print("\nTaking a final screenshot for visual inspection.")
        page.screenshot(path="jules-scratch/verification/debug_console_screenshot.png")
        print("Debug screenshot taken. Please inspect 'debug_console_screenshot.png'.")

    except Exception as e:
        print(f"\nAn error occurred during navigation: {e}")

    finally:
        print("\nClosing browser.")
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)