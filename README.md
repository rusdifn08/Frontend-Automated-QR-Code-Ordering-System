# Automated QR-Code Table Ordering System - Frontend UI

![Next.js](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

This is the Next.js App Router frontend for the Automated QR-Code Table Ordering System. Designed with a sleek, Professional Corporate aesthetic, it provides an intuitive, frictionless experience for restaurant customers and staff alike.

## 🌟 Key Features
- **Modern Corporate Aesthetic**: Beautiful UI featuring Midnight Blues, Slate Grays, and Glassmorphism effects using Tailwind CSS.
- **Dynamic Digital Menu**: Customers scan a QR code and land instantly on their table's dynamic menu catalog.
- **Zustand State Management**: Smooth, lightning-fast cart operations across the app without prop drilling.
- **Real-Time Order Tracking**: Customers can watch their order progress from "Received" to "Served" in real-time.
- **Call Waiter Feature**: A single tap allows customers to request assistance from staff directly from their phone.
- **Kitchen Display System (KDS)**: Dedicated `/admin/kds` Kanban board for staff to manage active orders and track latency metrics.

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js 18+
- npm, pnpm, or yarn

### 2. Clone and Install
```bash
git clone https://github.com/rusdifn08/Frontend-Automated-QR-Code-Ordering-System.git
cd frontend
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. How to Use
- **Customer View**: Navigate to `http://localhost:3000/1` (simulating scanning the QR code for Table 1). Browse the menu, add items to the cart, and place an order. Click the 🛎️ icon to call a waiter.
- **Admin/Staff View**: Navigate to `http://localhost:3000/admin/kds` to view the Kitchen Display System. You can move orders through their lifecycle and click "View System Metrics" to check backend performance.

*(Ensure the Golang backend is running on port 8080 so the frontend can fetch data).*
