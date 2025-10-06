import time
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        # 1. Go to registration page
        print("Navigating to registration page...")
        page.goto("http://localhost:5173/register")
        expect(page.get_by_role("heading", name="Create Your Account")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/01_register_page.png")

        # 2. Register a new user
        print("Registering a new user...")
        timestamp = int(time.time())
        username = f"testuser{timestamp}"
        email = f"test{timestamp}@example.com"

        page.get_by_label("First Name").fill("Test")
        page.get_by_label("Last Name").fill("User")
        page.get_by_label("Username").fill(username)
        page.get_by_label("Email Address").fill(email)
        page.get_by_label("Phone Number").fill("1234567890")
        page.get_by_label("Password *").first.fill("Password123!")
        page.get_by_label("Confirm Password").fill("Password123!")
        page.get_by_role("button", name="Create Account").click()

        # 3. Wait for successful registration and navigation to login page
        print("Waiting for redirection to login page...")
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/02_login_page.png")
        print("Registration successful.")

        # 4. Log in with the new user
        print("Logging in...")
        page.get_by_label("Email Address").fill(email)
        page.get_by_label("Password").fill("Password123!")
        page.get_by_role("button", name="Sign in").click()

        # 5. Wait for successful login and navigation to appointments page
        print("Waiting for redirection to appointments page...")
        expect(page.get_by_role("heading", name="Appointment Management")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/03_appointments_page.png")
        print("Login successful.")

        # 6. Navigate to the Users page
        print("Navigating to Users page...")
        page.get_by_role("link", name="Users").click()
        expect(page.get_by_role("heading", name="User Management")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/04_users_page.png")
        print("Users page navigation successful.")

        # 7. Navigate back to appointments and create a new one
        print("Creating a new appointment...")
        page.get_by_role("link", name="Appointments").click()
        page.get_by_role("button", name="New Appointment").click()
        expect(page.get_by_role("heading", name="Book New Appointment")).to_be_visible()

        page.get_by_label("Patient Name").fill("John Test")
        page.get_by_label("Age").fill("30")
        page.get_by_label("Gender").select_option("Male")
        page.get_by_label("Phone Number").fill("0987654321")
        page.get_by_label("Appointment Date").fill("2025-12-25")
        page.get_by_label("Appointment Time").fill("10:30")
        page.get_by_label("Address").fill("123 Test Street")
        page.get_by_role("button", name="Create Appointment").click()

        # 8. Verify the new appointment is in the table
        print("Verifying new appointment...")
        expect(page.get_by_text("John Test")).to_be_visible(timeout=5000)
        page.screenshot(path="jules-scratch/verification/05_appointment_created.png")
        print("Appointment created successfully.")

        # 9. Logout
        print("Logging out...")
        page.get_by_role("button", name="Logout").click()

        # 10. Verify logout and redirection to login page
        print("Verifying logout...")
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/06_after_logout.png")
        print("Logout successful.")

        print("\nVerification script completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)