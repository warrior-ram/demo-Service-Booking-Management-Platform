# Service Booking Platform - Team Plan (Ram & Sujit)

## 🎯 Team Structure

- **Ram (Frontend Lead & Design)**: Focus on the "Look & Feel", User Experience, and Frontend Logic.
- **Sujit (Backend Lead & Core)**: Focus on the "Brain", Database, APIs, and Security.

---

## 📅 Part 1: Ram's Responsibilities (Frontend & UI)

### 1. Setup & Design System

* **Initialize Next.js Project**: Set up the App Router, Install Dependencies.
- **Visual Identity**: Setup Tailwind CSS, fonts (Inter/Outfit), and color palette.
- **UI Components**: Install Shadcn/UI components (Buttons, Cards, Modals, Forms).
- **Layouts**: Build the main `Navbar` (responsive), `Footer`, and `DashboardLayout`.

### 2. Public Facing Pages

- [x] Landing Page: Create a stunning "Hero" section, Features list, and Testimonials.
- [ ] Services Page: A grid layout displaying all available coaching services/plans.
- [ ] About & Contact: Standard informational pages.

### 3. Client Interaction Modules

* **Auth UI**: Beautiful Login and Signup forms (connected to Sujit's API).
- **Booking Widget**: The core UI feature.
  - Calendar View (Select Date).
  - Time Slot Picker (Select Time).
  - Booking Summary & Confirmation.
- **User Dashboard**: "My Bookings" page where clients see their history.

### 4. Admin Frontend

* **Dashboard UI**: Clean interface for you to manage the business.
- **Service Manager**: Forms to Add/Edit services (Name, Price, Duration).
- **Booking Manager**: A view to see who booked what and Approve/Cancel them.

---

## ⚙️ Part 2: Sujit's Responsibilities (Backend & Data)

### 1. Setup & Architecture

* **Initialize FastAPI Project**: Set up the folder structure (`app/main.py`, `app/api`).
- **Database Design**: Define SQLModel schemas for `User`, `Service`, `Booking`, `Availability`.
- **Database Connection**: Setup connection to PostgreSQL (or SQLite for dev).

### 2. Authentication & Security

* **Auth System**: Implement JWT (JSON Web Token) handling.
- **Security**: Password hashing (bcrypt) and HTTP-only Cookie management.
- **Dependencies**: Create `get_current_user` and `get_admin_user` for API protection.

### 3. Core Logic (The Brains)

* **Availability Algorithm**: The complex logic that calculates which slots are free based on working hours and existing bookings.
- **Booking Transaction**: The API that accepts a booking, checks for double-bookings, and saves it.
- **CRUD APIs**: Endpoints to Create, Read, Update, Delete Services and Bookings.

### 4. Notifications & Ops

* **Email System**: Background tasks to send confirmation emails when a booking is made.
- **Admin Data**: APIs to aggregate stats (e.g., "Total Revenue this Month") for Ram's dashboard.

---

## 🤝 Coordination Points (Do not skip)

1. **API Contract**: Before Sujit builds an API, he must tell Ram the URL and the JSON format.
    - *Example*: `GET /services` returns `[{ "id": 1, "name": "Consulting", "price": 100 }]`
2. **Auth Handshake**: Ram needs to know exactly where to send the Login request and how to handle the Cookie.
3. **Merge Days**: Decide when to merge code if working in the same repo (recommended: use Git branches `feature/frontend` and `feature/backend`).
