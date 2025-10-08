
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the My Bookings page and take a screenshot
        page.goto("http://localhost:5173/patient/bookings")
        page.screenshot(path="jules-scratch/verification/my_bookings_page.png")

        # Navigate to the Book Appointment page and take a screenshot
        page.goto("http://localhost:5173/patient/book-appointment")
        page.screenshot(path="jules-scratch/verification/book_appointment_page.png")

        browser.close()

if __name__ == "__main__":
    run()
