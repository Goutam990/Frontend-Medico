import time
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        # 1. Go to registration page
        print("Navigating to registration page...")
        page.goto("http://localhost:5173/register")
        expect(page).to_have_title("Doctor Patient Booking Management Portal")
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

        # 3. Wait for successful registration and navigation to login page
        print("Waiting for redirection to login page...")
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/01_after_registration.png")
        print("Registration successful, screenshot taken.")

        # 4. Log in with the new user
        print("Logging in...")
        page.get_by_label("Username").fill(username)
        page.get_by_label("Password").fill(password)
        page.get_by_role("button", name="Sign in").click()

        # 5. Wait for successful login and navigation to bookings page
        print("Waiting for redirection to bookings page...")
        expect(page.get_by_role("heading", name="Booking Management")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/02_bookings_page.png")
        print("Login successful, bookings page screenshot taken.")

        # 6. Navigate to the Patients page
        print("Navigating to patients page...")
        page.get_by_role("link", name="Patients").click()
        expect(page.get_by_role("heading", name="Patient Management")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/03_patients_page.png")
        print("Patients page screenshot taken.")

        # 7. Logout
        print("Logging out...")
        page.get_by_role("button", name="Logout").click()

        # 8. Verify logout and redirection to login page
        print("Verifying logout...")
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/04_after_logout.png")
        print("Logout successful, final screenshot taken.")

        print("\nVerification script completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        # Take a screenshot on error for debugging
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)