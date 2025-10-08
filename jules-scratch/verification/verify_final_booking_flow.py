import time
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    try:
        # --- PATIENT FLOW ---

        # 1. Register a new patient
        print("Navigating to registration page...")
        page.goto("http://localhost:5173/register")
        expect(page.get_by_role("heading", name="Create Your Account")).to_be_visible()

        timestamp = int(time.time())
        patient_email = f"patient{timestamp}@example.com"
        patient_password = "Password123!"
        patient_firstname = f"TestPatient{timestamp}"

        print(f"Registering new patient: {patient_email}")
        page.get_by_label("First Name").fill(patient_firstname)
        page.get_by_label("Last Name").fill("User")
        page.get_by_label("Username").fill(f"patient{timestamp}")
        page.get_by_label("Email Address").fill(patient_email)
        page.get_by_label("Phone Number").fill("1112223333")
        page.get_by_label("Password *").first.fill(patient_password)
        page.get_by_label("Confirm Password").fill(patient_password)
        page.get_by_role("button", name="Create Account").click()

        # 2. Login as the new patient
        print("Waiting for redirection to login page...")
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)

        print("Logging in as new patient...")
        page.get_by_label("Email Address").fill(patient_email)
        page.get_by_label("Password").fill(patient_password)
        page.get_by_role("button", name="Sign in").click()

        # 3. Patient is redirected to their bookings page
        print("Waiting for redirection to patient bookings page...")
        expect(page.get_by_role("heading", name="My Upcoming Appointments")).to_be_visible(timeout=10000)
        print("Patient bookings page loaded.")

        # 4. Patient creates a new appointment
        print("Creating a new appointment...")
        page.get_by_role("button", name="Book New Appointment").click()
        expect(page.get_by_role("heading", name="Book New Appointment")).to_be_visible()

        appointment_patient_name = f"{patient_firstname} Doe"
        page.get_by_label("Patient Name *").fill(appointment_patient_name)
        page.get_by_label("Age *").fill("40")
        page.get_by_label("Gender *").select_option("Female")
        page.get_by_label("Phone Number *").fill("3334445555")
        page.get_by_label("Appointment Date *").fill("2025-11-20")
        page.get_by_label("Start Time *").fill("15:00")
        page.get_by_label("Address *").fill("789 Wellness Ave")
        page.get_by_role("button", name="Proceed to Payment").click()

        # 5. Verify the payment form is displayed
        print("Verifying payment form is displayed...")
        expect(page.get_by_text("Complete Your Payment")).to_be_visible(timeout=10000)
        expect(page.locator("form").get_by_role("button", name="Pay & Confirm Appointment")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/01_payment_form.png")
        print("Payment form verified.")

        # NOTE: We cannot test the actual Stripe payment. This is a limitation.
        # We will assume this flow works and proceed with verification of the admin side.

        # 6. Patient logs out
        print("Patient logging out...")
        page.get_by_role("button", name="Logout").click()
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)
        print("Patient logout successful.")

        # --- ADMIN FLOW ---

        # 7. Login as admin
        print("Logging in as admin...")
        page.get_by_label("Email Address").fill("goutam164@gmail.com")
        page.get_by_label("Password").fill("YourPassword123!")
        page.get_by_role("button", name="Sign in").click()

        # 8. Admin is redirected to their bookings page
        print("Waiting for redirection to admin bookings page...")
        expect(page.get_by_role("heading", name="Appointment Management")).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/02_admin_bookings_list.png")
        print("Admin bookings page verified.")

        # 9. Admin navigates to the users list
        print("Navigating to users list...")
        page.get_by_role("link", name="Users").click()
        expect(page.get_by_role("heading", name="Registered Patient List")).to_be_visible(timeout=10000)

        # 10. Verify the new patient is on the user list
        print("Verifying new patient on user list...")
        expect(page.get_by_text(patient_email)).to_be_visible(timeout=5000)
        page.screenshot(path="jules-scratch/verification/03_admin_users_list.png")
        print("New patient verified.")

        # 11. Admin logs out
        print("Admin logging out...")
        page.get_by_role("button", name="Logout").click()
        expect(page.get_by_role("heading", name="Welcome to MediBook")).to_be_visible(timeout=10000)
        print("Admin logout successful.")

        print("\nFull E2E verification script completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)