# AI Prompt Log

## Prompt 1

"Create Express server with JWT auth and role-based access"

Response:
Generated auth routes and middleware

Issue:
Role validation was missing

Fix:
Added role-based middleware manually

---

## Prompt 2

"Fix API route mismatch between frontend and backend"

Response:
Suggested correct route mounting

Fix:
Updated backend route to /api/auth

---

## Prompt 3

"Create leave management APIs"

Response:
Generated basic CRUD APIs

Issue:
Validation was incomplete

Fix:
Added manual validation for dates and leave type

---

## Prompt 4

"Integrate Gemini API for leave parsing"

Response:
Created AI endpoint

Issue:
Response format inconsistent

Fix:
Adjusted prompt to enforce JSON output

---

## Prompt 5

"Build Next.js routing and dashboard"

Response:
Generated pages and components

Issue:
Everything was in one file

Fix:
Refactored into proper structure manually

---

Fix leave apply API issue in my full-stack app.

Issues:
- Leave apply is not working

Tasks:
1. Verify backend route:
   POST /api/leave/apply
   with authentication middleware

2. Ensure request body validation:
   type, startDate, endDate, reason

3. Ensure JWT token is required and validated

4. Fix frontend API call:
   - Correct endpoint
   - Send Authorization header with Bearer token

5. Add debug logs to track request and errors

Keep implementation simple and correct.

---
