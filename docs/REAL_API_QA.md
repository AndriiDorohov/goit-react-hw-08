# Real GoIT API acceptance check — Contacts Book

**Status:** PENDING (requires a dedicated test account and a browser).
**PR:** https://github.com/AndriiDorohov/goit-react-hw-08/pull/1
**PR preview:** https://goit-react-hw-08-git-fix-conta-9d7409-andriis-projects-a2d81702.vercel.app/
**Backend:** https://connections-api.goit.global

Automated CI already tests the app against a **mocked** API. This checklist
covers what mocks cannot prove: whether Vercel, browser CORS, the real GoIT
backend, and the app's persisted JWT work together.

## Privacy and setup

- Only use a **separate test account** and an email address you control.
  Do not put its credentials, bearer tokens, or actual personal contacts
  in issues, screenshots, PR comments, or CI logs.
- Use the fictional contact `Demo Example`, `+1 202-555-0142` (a North
  American 555 fictional-use number). Do not press Call / messaging actions.
- Use a private/incognito window if you already have a real account.
- Do not run these scenarios against the production deployment.

## Manual acceptance scenarios

- [ ] **Preview / auth.** The preview opens. Sign in or register a test account.
  Verify Contacts loads without a CORS or 401 failure in DevTools → Network.
- [ ] **Create.** Add `Demo Example`, `+1 202-555-0142`; its card appears.
- [ ] **Cancel.** Edit the name to `Unsaved Example`, press Cancel, edit again.
  The original name is still in the field; no PATCH was sent.
- [ ] **Validate.** Edit the name to `123`, press Save. Inline validation
  appears and no PATCH is sent.
- [ ] **Save and persist.** Change the name to `Updated Example`, press Save.
  The card updates. Reload the page; the updated name persists.
- [ ] **Failure and retry.** Edit again, switch DevTools → Network → Offline,
  press Save. The form remains open, the draft remains intact, and an error
  appears. Restore Online, press Save again, and confirm the update persists.
- [ ] **Repeated click.** Edit the name, double-click Save; Network must show
  one PATCH for this edit (no duplicated concurrent updates).
- [ ] **Responsive.** Use DevTools responsive mode (320 px and 375 px):
  form, filters, and contact cards should be reachable; mobile must scroll
  vertically and have no horizontal clipping.
- [ ] **Cleanup.** Delete only the fictional contact created for the test
  (and any other temporary test contacts). Do not delete real contacts.

## Evidence

Record a simple PASS / FAIL for each check and the browser/device tested.
If a step fails, note the symptom, HTTP status, and response message after
redacting all credentials, JWTs, emails, and personal data.

**Merge rule:** do not mark this PR ready or merge until real API checks
pass (or the remaining risk has been explicitly reviewed).
