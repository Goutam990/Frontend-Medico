
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Register a new user
        page.goto("http://localhost:5173/register")
        page.fill('input[name="firstName"]', "Test")
        page.fill('input[name="lastName"]', "User")
        page.fill('input[name="username"]', "testuser")
        page.fill('input[name="email"]', "test@example.com")
        page.fill('input[name="phoneNumber"]', "1234567890")
        page.fill('input[name="password"]', "password123")
        page.fill('input[name="confirmPassword"]', "password123")
        page.click('button[type="submit"]')

        # Wait for navigation to login page after successful registration
        page.wait_for_url("http://localhost:5173/login", timeout=5000)

        # Login
        page.fill('input[name="email"]', "test@example.com")
        page.fill('input[name="password"]', "password123")
        page.click('button[type="submit"]')

        # Navigate to My Bookings and book an appointment
        page.goto("http://localhost:5173/patient/bookings")
        page.click('a[href="/patient/book-appointment"]')

        page.fill('input[name="doctor"]', "Dr. Smith")
        page.fill('input[name="date"]', "2025-12-25")
        page.fill('input[name="time"]', "10:00")
        page.click('button[type="submit"]')

        # Verify the appointment is on the My Bookings page
        expect(page.locator('text="Dr. Smith"')).to_be_visible()
        expect(page.locator('text="12/25/2025"')).to_be_visible()
        expect(page.locator('text="10:00"')).to_be_visible()

        page.screenshot(path="jules-scratch/verification/booking_verification.png")
        browser.close()

if __name__ == "__main__":
    run()
