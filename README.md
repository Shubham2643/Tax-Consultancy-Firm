# Shree Chamunda Associates — Tax Consultancy Platform

A modern, secure, and production-ready tax consultancy platform built with the MERN stack. This system provides a public landing page for marketing, an interactive Client Portal for documents, bookings, and payments, and an Admin Control Center for Chartered Accountants (CAs) to manage tasks, invoices, and scheduling.

---

## 🚀 Key Features

### 🌐 Public Landing Page
* Modern brand styling with clean, responsive typography and color schemes.
* Dynamic Services listing (GST, Income Tax, Bookkeeping, Payroll).
* Live FAQ Search & Accordion view.
* Online Contact Form that streams client inquiries directly to the CA Admin Panel.

### 🔒 Secure Client Portal
* **Dashboard Metrics**: Quick summary of active inquiries, pending documents, and billing status.
* **Service Tracker**: Live timeline showing current progress on service requests with an interactive chat feed for discussions.
* **Document Vault**: Upload/download folders for tax documents, slips, and completed returns.
* **Meeting Scheduler**: Book live consultation slots directly with CAs.
* **Billing Vault**: Integrated **Razorpay Checkout** supporting cards, netbanking, and UPI (Google Pay, PhonePe, Paytm) with backend cryptographic signature verification.

### 🛠️ Admin Control Center
* **Operations Hub**: Quick summary of pending actions, open client tickets, and system statuses.
* **Invoices Builder**: Auto-generate unique invoices and amount receipts.
* **Consultations Dashboard**: View pending, approved, and completed appointment slots.
* **CMS Controllers**: Dynamic management interface to create/edit/delete services, FAQ entries, and blog posts.

---

## 🛠️ Technology Stack

* **Frontend**: React, Vite, Vanilla CSS, React Router DOM, Socket.io-client.
* **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, Razorpay SDK, Web-Push.
* **Dev Tools**: Nodemon, Git.

---

## 📂 Project Structure

```text
├── client/              # Vite + React Frontend Client
│   ├── public/          # Public assets, icons, logo
│   ├── src/             # Frontend source code
│   │   ├── api/         # Axios network endpoints
│   │   ├── components/  # Reusable UI widgets
│   │   └── pages/       # Dashboard & public viewport layouts
├── server/              # Node.js + Express Backend Server
│   ├── config/          # MongoDB database connector
│   ├── controllers/     # Route business logic handlers
│   ├── models/          # Mongoose DB Schemas
│   ├── routes/          # REST Endpoint routes
│   └── server.js        # Main Express and Socket.io server
├── .gitignore           # File exclusion configurations (ignores secrets/node_modules)
└── README.md            # Project documentation manual
```

---

## ⚙️ Local Development Setup

### 1. Configure Environment variables
Create a `.env` file at the root of the project (`/F:/PROJECTS/TAX FIRM/.env`) and add the following config templates:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shreechamunda
NODE_ENV=development

# SMTP Configuration (Gmail App Passwords)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Admin Credentials (For initial seed)
ADMIN_EMAIL=admin@shreechamunda.com

# Razorpay API Credentials
RAZORPAY_KEY_ID=rzp_test_xxxxxx
RAZORPAY_KEY_SECRET=yyyyyyyy
```

### 2. Start the Backend Server
```bash
cd server
npm install
npm run dev
```

### 3. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```

The server will run on `http://localhost:5000` and the client portal will launch on `http://localhost:5173`.

---

## 🛡️ Security & Integrity

* **Session Validation**: Uses active database sessions in the database for stateful validation.
* **SHA-256 HMAC Signatures**: Razorpay checkouts are validated on the server via SHA-256 HMAC cryptographic checksum hashes.
* **Environment Exclusions**: Secret keys are ignored by Git via the root `.gitignore` to prevent leaks.
