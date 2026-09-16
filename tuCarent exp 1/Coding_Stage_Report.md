# Project Coding Stage Report

**Name:** Kay  
**Project name:** tuCarent  
**Deadline of submission:** 9th March 7:00pm  

---

### 1. Project Overview
**a) Brief recap of the project goal and scope.**
The goal of the project is to develop **tuCarent**, a premium car rental platform that allows users to discover, book, and manage luxury vehicle rentals. The system provides a seamless user experience for both self-drive bookings and chauffeur-driven services. It centralizes everything by offering administrative tools for managing the fleet inventory, chauffeurs, and user bookings.

**b) Key features planned for the final product.**
- **User Portal:** An intuitive interface for browsing vehicles with dynamic pricing and an interactive booking system (with map integration for pickup locations).
- **Service Types:** Options to choose between self-drive or hiring a professional chauffeur.
- **Chauffeur Dashboard:** A dedicated interface where chauffeurs can view assigned trips and mark them as completed.
- **Admin Panel:** A comprehensive system to manage users, vehicle inventory, and monitor all bookings.
- **Design:** A premium, modern UI with responsive design.

---

### 2. Development Progress
*Project is currently at 50% completion.*

**a) Modules/ components already implemented.**
- **Frontend Core & UI:** Initialized with React, Vite, and TailwindCSS. The homepage features a modern masonry grid layout and Framer Motion animations.
- **Vehicle Discovery Module:** Implemented the `CarList` component to display vehicles, including dynamic pricing logic that adjusts by time of day.
- **Booking Engine:** The `BookingPage` is active, featuring calendar date selection, conflict prevention (disabling already booked dates), and interactive map functionality (Leaflet) to set pickup locations.
- **Backend Architecture & APIs:** A robust Python backend built with FastAPI and SQLite. Endpoints exist for fetching vehicles, getting booked dates, fetching available chauffeurs, and creating bookings.
- **Panel Routing:** Setup routing structures for Users, Admin (AdminLogin, AdminPanel), and Chauffeur access in the application.

**b) Screenshots of your code.**
*> [!NOTE]*  
*> **Please paste your own screenshots here before submitting!***  
- *[Screenshot 1 Placeholder: e.g., A screenshot of your `BookingPage.jsx` React code]*
- *[Screenshot 2 Placeholder: e.g., A screenshot of your `models.py` or `main.py` Backend code]*

---

### 3. Technical Details
**a) Programming languages, frameworks, and tools used.**
- **Frontend:** React 18, Vite, TailwindCSS (for styling), `framer-motion` (for animations), `react-leaflet` (for maps).
- **Backend:** Python, FastAPI, Uvicorn (ASGI server).
- **Database:** SQLite (using local .db storage).

**b) System architecture diagram**
*> [!NOTE]*  
*> **If required, draw a quick diagram in tool like Draw.io or Paint, take a screenshot, and paste it here.***  
Basic structure: 
**Client (React SPA)** ← REST API Calls → **Server (FastAPI)** ← queries → **Database (SQLite)**

**c) Database schema/dataset/ML training or API design.**
- **Users Table:** `id`, `username`, `email`, `password_hash`, `role`
- **Vehicles Table:** `id`, `make`, `model`, `type`, `daily_rate`, `mileage`, `color`, `img`
- **Bookings Table:** `id`, `user_id`, `vehicle_id`, `start_date`, `end_date`, `service_type`, `chauffeur_id`, `pickup_location`
- **Chauffeurs Table:** `id`, `name`, `daily_rate`, `status`
- **Key APIs:** `GET /vehicles`, `GET /bookings/{id}/dates`, `POST /bookings`

---

### 4. Testing & Validation
**a) Any known bugs or limitations.**
- **Map Rendering:** Occasionally, the Leaflet map tiles may delay loading on standard network speeds.
- **Real-Time Booking Clashes:** If multiple users look at the same car simultaneously before refreshing, live-booking clashing could occur on edge cases.
- **Payment processing:** Actual payment processing is not yet integrated; the system currently only calculates the final bill.

---

### 5. Challenges and how you will overcome them
**a) Problems encountered during coding.**
- Preventing duplicate bookings on the exact same dates for the same car without causing UI confusion.
- Safely handling map state interactions and reverse geocoding inside React components to fetch pickup addresses.

**b) How will you solve them?**
- Built an API endpoint that looks up a vehicle's `booked_dates`. These are then fed directly into the frontend calendar (`react-datepicker` as `excludeDates`) to prevent the user from clicking them. We validate these again on the backend upon submission.
- Used `react-leaflet` to manage the map safely inside React, and utilized the free Nominatim OpenStreetMap API to accurately translate map clicks into readable Location Strings for the user.

---

### 6. Collaboration environments
**a) Collaboration methods (GitHub, Trello, etc.). share screenshots**
- **Local Development environment:** Using modern IDEs (VSCode) running parallel terminals (FastAPI backend + Vite frontend local servers).
*> [!NOTE]*  
*> **Paste a screenshot of your VS Code workspace (showing your frontend/backend folders) or if you use GitHub, a screenshot of your Github Repo.***

---

### 7. Next Steps
**a) Features still under development.**
- Finalizing the Admin Dashboard overview panels and Analytics.
- Developing actual user authentication and profile persistence.
- Optional: Integration of email notifications or a payment sandbox like Stripe.

**b) Timeline for completion before the final submission.**
- **Next 1-2 Weeks:** Polish Admin UI and Chauffeur completed states backend logic.
- **Following Week:** Finalize Authentication and security hardening.
- **Final Days:** Final end-to-end testing, bug squashing, and presentation preparation.

**c) % of work remaining, when exactly are you finishing**
- **% remaining:** 50% of the work remains.
- **Expected finish date:** Within 2-3 weeks (in time for the final submission phase).

---

### 8. Any references to documentation.
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/docs
- React Leaflet: https://react-leaflet.js.org/
