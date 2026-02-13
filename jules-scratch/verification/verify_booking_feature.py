
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Login with provided credentials
        page.goto("http://localhost:5174/login")
        page.fill('input[id="email"]', "tiwarigoutam8@gmail.com")
        page.fill('input[id="password"]', "Tech#master990")
        page.click('button[type="submit"]')

        # Take a screenshot to see the result of the login attempt
        page.screenshot(path="jules-scratch/verification/login_attempt.png")

        # Wait for navigation to the bookings page (or some other authenticated page)
        # page.wait_for_url("http://localhost:5174/patient/bookings", timeout=10000)

        # # From My Bookings, click to book a new appointment
        # page.click('a[href="/patient/book-appointment"]')
        # page.wait_for_url("http://localhost:5174/patient/book-appointment")

        # # Fill out the appointment form
        # doctor = "Dr. Adams"
        # date = "2026-01-15"
        # time = "11:30"
        # page.fill('input[name="doctor"]', doctor)
        # page.fill('input[name="date"]', date)
        # page.fill('input[name="time"]', time)
        # page.click('button[type="submit"]')

        # # Verify the appointment is on the My Bookings page
        # page.wait_for_url("http://localhost:5174/patient/bookings")

        # expect(page.locator(f'text="{doctor}"')).to_be_visible()
        # expect(page.locator('text="1/15/2026"')).to_be_visible()
        # expect(page.locator(f'text="{time}"')).to_be_visible()

        # page.screenshot(path="jules-scratch/verification/booking_feature_verified.png")
        browser.close()

if __name__ == "__main__":
    run()
