# LeavePilot AI

A full-stack AI-powered Leave Management System built using Next.js, Node.js, MongoDB, and Google Gemini.

## 🚀 Features

* JWT Authentication with role-based access (Employee, Manager, Admin)
* Leave application system (Sick, Casual, WFH, Comp-off)
* Manager approval/rejection workflow
* Employee dashboard (leave balance, history)
* Manager dashboard (pending requests)
* AI-powered leave parsing (natural language → structured form)
* Voice input for leave application
* Responsive UI (mobile + desktop)

## 🧠 AI Features

* Natural Language Leave Parsing using Gemini
* Manager Insights (AI-generated summary & recommendation)

## 🛠 Tech Stack

* Frontend: Next.js, Tailwind CSS
* Backend: Node.js, Express
* Database: MongoDB
* AI: Google Gemini API

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/mohd-hassan17/teamleavee.git
cd teamleavee
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
```

Run backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Roles

* Employee: Apply leave, view history
* Manager: Approve/reject requests
* Admin: Full access

---

## 📌 Notes

* AI feature is implemented using Gemini API
* Voice input uses browser SpeechRecognition API

---
