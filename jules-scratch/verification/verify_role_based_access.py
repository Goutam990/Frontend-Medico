import time
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        # --- Test Patient Flow ---

        # 1. Go to registration page and register a new patient
        print("Navigating to registration page...")
        page.goto("http://localhost:5173/register")
        expect(page.get_by_role("heading", name="Create Your Account")).to_be_visible()

        print("Registering a new patient...")
        timestamp = int(time.time())
        patient_email = f"patient{timestamp}@example.com"

        page.get_by_label("First Name").fill("Test")
        page.get_by_label("Last Name").fill("Patient")
        page.get_by_label("Username").fill(f"patient{timestamp}")
        page.get_by_label("Email Address").fill(patient_email)
        page.get_by_label("Phone Number").fill("1234567890")
        page.get_by_label("Password *").first.fill("Password123!")
        page.get_by_label("Confirm Password").fill("Password123!")
        page.get_by_role("button", name="Create Account").click()

        # 2. Log in as the new patient
        print("Waiting for redirection to login page...")
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)

        print("Logging in as patient...")
        page.get_by_label("Email Address").fill(patient_email)
        page.get_by_label("Password").fill("Password123!")
        page.get_by_role("button", name="Sign in").click()

        # 3. Verify redirection to Patient Dashboard
        print("Verifying redirection to Patient Dashboard...")
        expect(page.get_by_role("heading", name="Welcome, Test!")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/01_patient_dashboard.png")
        print("Patient login and redirection successful.")

        # 4. Log out
        print("Logging out as patient...")
        page.get_by_role("button", name="Logout").click()
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)
        print("Logout successful.")

        # --- Test Admin/Doctor Flow ---

        # 5. Log in as the Admin/Doctor
        print("Logging in as Admin/Doctor...")
        page.get_by_label("Email Address").fill("goutam164@gmail.com")
        page.get_by_label("Password").fill("YourPassword123!")
        page.get_by_role("button", name="Sign in").click()

        # 6. Verify redirection to Admin Dashboard
        print("Verifying redirection to Admin Dashboard...")
        expect(page.get_by_role("heading", name="Admin Dashboard")).to_be_visible(timeout=10000)
        expect(page.get_by_text("Welcome! Here is a list of all registered users.")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/02_admin_dashboard.png")
        print("Admin login and redirection successful.")

        print("\nVerification script completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)