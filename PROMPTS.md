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

## Prompt 6

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

## Prompt 7

Fix Gemini AI integration and improve UI responsiveness in my full-stack app.

Issues:
- Error: model "gemini-1.5-flash" not found
- AI feature not working on admin/manager page
- UI is not fully responsive or polished

Tasks:

1. Fix Gemini API:
- Replace model with "gemini-1.5-flash-latest"
- Ensure correct SDK usage (Google Generative AI)
- Use generateContent properly
- Add error handling for AI response
- Ensure response is valid JSON for leave parsing

2. Backend AI endpoints:
- Fix /api/ai/parse-leave
- Fix /api/ai/manager-insight
- Ensure both endpoints return structured JSON

3. Improve frontend AI integration:
- Call AI APIs correctly
- Show loading state while AI response is processing
- Handle errors gracefully

4. UI Improvements (IMPORTANT):
- Use Tailwind CSS properly
- Make layout fully responsive:
  - Mobile (stack layout)
  - Tablet
  - Desktop (grid/cards)
- Improve:
  - Dashboard cards
  - Forms spacing
  - Buttons (hover, padding)
  - Navbar responsiveness

5. Clean structure:
- Separate components (Form, Card, Navbar)
- Avoid large single files

6. Keep UI simple but professional (no overdesign)

Goal:
- AI feature works correctly
- UI looks clean and responsive
- No runtime errors

--

## Prompt 8

Review and fix the Admin and Manager dashboard UI in my Next.js app.

Issues:
- Leave table UI is not properly structured
- Layout is not responsive
- Data is not clearly readable

Tasks:

1. Fix Leave Table UI:
- Display columns clearly:
  - Employee Name
  - Leave Type
  - Start Date
  - End Date
  - Status (pending/approved/rejected)
  - Manager Comment
- Add proper spacing, alignment, and borders
- Use table or responsive card layout

2. Improve UI Design:
- Use Tailwind CSS properly
- Add:
  - padding, margin
  - hover effects
  - rounded cards
  - clean typography

3. Make it Responsive:
- Desktop: table view
- Mobile: stacked card layout
- Ensure no overflow or broken layout

4. Manager Actions:
- Add Approve and Reject buttons clearly
- Buttons should be visible and styled
- Disable buttons after action

5. Improve UX:
- Add loading state while fetching data
- Add empty state ("No leave requests")
- Add status color coding:
  - Pending → yellow
  - Approved → green
  - Rejected → red

6. Clean Code:
- Move table into reusable component
- Avoid putting everything in one file

7. Keep design simple and professional (no overdesign)

Goal:
- Clean, readable, responsive leave table UI
- Professional dashboard layout for admin and manager 
 
--