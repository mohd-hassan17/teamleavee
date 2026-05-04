# Architecture Overview

## 🧱 System Design

The application follows a full-stack architecture with clear separation of concerns:

* Frontend (Next.js)
* Backend (Node.js + Express)
* Database (MongoDB)
* AI Layer (Gemini API)

---

## 🔹 Backend Structure

server/

* models/

  * User.js
  * LeaveRequest.js
* routes/

  * authRoutes.js
  * leaveRoutes.js
  * aiRoutes.js
* controllers/

  * authController.js
  * leaveController.js
  * aiController.js
* middleware/

  * authMiddleware.js
  * roleMiddleware.js
* config/

  * db.js
* server.js

---

## 🔹 Frontend Structure

client/

* app/

  * login/
  * dashboard/
  * apply-leave/
  * manager/
* components/

  * Navbar.jsx
  * LeaveForm.jsx
  * DashboardCard.jsx
* services/

  * api.js
  * auth.js

---

## 🔹 Database Schema

### User

* name
* email
* password
* role

### LeaveRequest

* userId
* type
* startDate
* endDate
* reason
* status
* managerId
* comment

---

## 🔹 API Design

### Auth

* POST /api/auth/signup
* POST /api/auth/login
* GET /api/auth/me

### Leave

* POST /api/leave/apply
* GET /api/leave/my
* GET /api/leave/pending
* PATCH /api/leave/:id/approve
* PATCH /api/leave/:id/reject

### AI

* POST /api/ai/parse-leave
* POST /api/ai/manager-insight

---

## 🤖 AI Architecture

* Gemini API used for NLP processing
* Input: natural language text
* Output: structured JSON
* Used in:

  * Leave form autofill
  * Manager decision support

---

## 📈 Improvements (if more time)

* Real-time updates (WebSockets)
* Email notifications
* Calendar integration
* Better AI prompt tuning

---

## 🗄️ Database Schema

### User
- name: String
- email: String (unique)
- password: String (hashed)
- role: employee | manager | admin
- createdAt, updatedAt

### LeaveRequest
- userId: ObjectId (ref User)
- type: Sick | Casual | WFH | Comp-off
- startDate: Date
- endDate: Date
- reason: String
- workingDays: Number
- status: pending | approved | rejected
- managerId: ObjectId (ref User)
- comment: String
- createdAt, updatedAt

--