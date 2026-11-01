"""End-to-end smoke tests against the built React app and a mocked remote API.

Test data stays fictional; requests never reach the real GoIT API.
Install Playwright and Chromium before running.
"""

import json
import subprocess
import time
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import urlopen
import unittest

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent.parent
SITE = "http://127.0.0.1:4173"
API = "https://connections-api.goit.global"
EXAMPLE = {"id": "contact-1", "name": "Anna Example", "number": "+46 70 123 45 67"}


class FakeAPI:
    def __init__(self):
        self.contacts = [EXAMPLE.copy()]
        self.patches = []
        self.fail_next_patch = False

    def route(self, route):
        request = route.request
        method = request.method
        path = urlparse(request.url).path
        headers = {
            "access-control-allow-origin": "*",
            "access-control-allow-headers": "Authorization, Content-Type",
            "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
        }
        if method == "OPTIONS":
            route.fulfill(status=204, headers=headers)
            return

        status, body = 200, {}
        if (method, path) == ("POST", "/users/login"):
            body = {
                "token": "fictional-test-token",
                "user": {"name": "Demo User", "email": "demo@example.test"},
            }
        elif (method, path) == ("GET", "/users/current"):
            body = {"name": "Demo User", "email": "demo@example.test"}
        elif (method, path) == ("GET", "/contacts"):
            body = self.contacts
        elif method == "PATCH" and path == "/contacts/contact-1":
            payload = request.post_data_json
            self.patches.append(payload)
            if self.fail_next_patch:
                self.fail_next_patch = False
                status, body = 503, {"message": "Temporary service issue"}
            else:
                updated = {**self.contacts[0], **payload}
                self.contacts = [updated]
                body = updated
        else:
            status, body = 404, {"message": f"Unmocked endpoint: {method} {path}"}

        route.fulfill(
            status=status,
            headers=headers,
            content_type="application/json",
            body=json.dumps(body),
        )


class BrowserContactTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server = subprocess.Popen(
            ["node", "node_modules/vite/bin/vite.js", "preview",
             "--host", "127.0.0.1", "--port", "4173", "--strictPort"],
            cwd=ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        for _ in range(80):
            if cls.server.poll() is not None:
                raise RuntimeError("Vite preview terminated before tests")
            try:
                with urlopen(SITE, timeout=1) as response:
                    if response.status == 200:
                        break
            except (URLError, TimeoutError):
                time.sleep(0.25)
        else:
            cls.server.terminate()
            raise RuntimeError("Vite preview did not become available")

        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.terminate()
        try:
            cls.server.communicate(timeout=5)
        except subprocess.TimeoutExpired:
            cls.server.kill()
            cls.server.communicate(timeout=5)

    def setUp(self):
        self.context = self.browser.new_context(
            viewport={"width": 1280, "height": 850},
            reduced_motion="reduce",
        )
        self.api = FakeAPI()
        self.context.route(API + "/**", self.api.route)
        self.page = self.context.new_page()
        self.page.goto(SITE + "/login")
        self.page.get_by_placeholder("Email").fill("demo@example.test")
        self.page.get_by_placeholder("Password").fill("test-password")
        self.page.get_by_role("button", name="Log In").click()
        self.page.get_by_text(EXAMPLE["name"], exact=True).wait_for(state="visible")

    def tearDown(self):
        self.context.close()

    def open_editor(self):
        self.page.get_by_role("button", name="Edit", exact=True).click()
        return (
            self.page.get_by_placeholder("Name", exact=True),
            self.page.get_by_placeholder("Number", exact=True),
        )

    def test_authenticated_contact_list_renders(self):
        self.assertTrue(self.page.get_by_text(EXAMPLE["name"], exact=True).is_visible())
        self.assertEqual(self.api.patches, [])

    def test_edit_success_updates_contact(self):
        name, _ = self.open_editor()
        name.fill("Jordan Example")
        self.page.get_by_role("button", name="Save").click()
        self.page.get_by_text("Jordan Example", exact=True).wait_for(state="visible")
        self.assertEqual(len(self.api.patches), 1)
        self.assertEqual(self.api.patches[0]["name"], "Jordan Example")

    def test_invalid_edit_keeps_form_open_and_sends_no_patch(self):
        name, number = self.open_editor()
        name.fill("123")
        self.page.get_by_role("button", name="Save").click()
        self.page.get_by_role("alert").filter(has_text="Name must contain").wait_for()
        self.assertTrue(number.is_visible())
        self.assertEqual(self.api.patches, [])

    def test_cancel_restores_original_value(self):
        name, _ = self.open_editor()
        name.fill("Unsaved Example")
        self.page.get_by_role("button", name="Cancel").click()
        self.page.get_by_text(EXAMPLE["name"], exact=True).wait_for(state="visible")
        name, _ = self.open_editor()
        self.assertEqual(name.input_value(), EXAMPLE["name"])
        self.assertEqual(self.api.patches, [])

    def test_failed_save_keeps_draft_and_allows_retry(self):
        self.api.fail_next_patch = True
        name, _ = self.open_editor()
        name.fill("Retry Example")
        self.page.get_by_role("button", name="Save").click()
        self.page.get_by_role("alert").filter(has_text="Unable to save").wait_for()
        self.assertEqual(name.input_value(), "Retry Example")
        self.assertEqual(len(self.api.patches), 1)
        self.page.get_by_role("button", name="Save").click()
        self.page.get_by_text("Retry Example", exact=True).wait_for(state="visible")
        self.assertEqual(len(self.api.patches), 2)

    def test_double_click_sends_one_patch(self):
        name, _ = self.open_editor()
        name.fill("Double Click")
        self.page.get_by_role("button", name="Save").dblclick()
        self.page.get_by_text("Double Click", exact=True).wait_for(state="visible")
        self.assertEqual(len(self.api.patches), 1)

    def test_mobile_viewport_has_no_horizontal_scroll(self):
        self.page.set_viewport_size({"width": 375, "height": 812})
        self.assertLessEqual(
            self.page.evaluate("document.documentElement.scrollWidth"),
            376,
            "375 px contacts page has horizontal overflow",
        )
        # A clipped layout can have zero overflow while hiding all contact
        # cards offscreen; verify the real content is reachable and visible.
        card = self.page.locator('[class*="contactItem"]')
        card.scroll_into_view_if_needed()
        bounds = card.bounding_box()
        self.assertIsNotNone(bounds)
        self.assertGreaterEqual(bounds["x"], -1, bounds)
        self.assertLessEqual(bounds["x"] + bounds["width"], 376, bounds)
        self.assertTrue(self.page.get_by_role("button", name="Edit").is_visible())
        self.assertGreater(
            self.page.evaluate("document.documentElement.scrollHeight"),
            812,
            "Mobile page should scroll vertically to reach contacts",
        )

    def test_preview_screenshots(self):
        output = ROOT / "screenshots"
        output.mkdir(exist_ok=True)
        self.page.screenshot(
            path=str(output / "contacts-desktop.png"),
            full_page=True,
            animations="disabled",
        )
        self.page.set_viewport_size({"width": 375, "height": 812})
        self.page.get_by_text(EXAMPLE["name"], exact=True).scroll_into_view_if_needed()
        self.page.screenshot(
            path=str(output / "contacts-mobile.png"),
            full_page=True,
            animations="disabled",
        )


if __name__ == "__main__":
    unittest.main()
