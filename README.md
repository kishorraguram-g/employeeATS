# 👥 Employee Attendance Tracking System

A full-featured web-based system to manage employee roles and attendance tracking across an organization, with layered role-based access for **Admins**, **HR**, **Managers**, and **Employees**.

## 📌 Project Overview

The **Employee Attendance Tracking System** is designed to simplify workforce management in companies by digitizing attendance, role assignments, and team structures. This system supports:

- Admin operations (like creating HRs and Managers),
- HR operations (like adding employees, creating teams, and marking/editing attendance),
- Manager-level views of their respective teams,
- And employee-level self-service to track their own attendance records.

This project demonstrates scalable role-based access control and real-time data handling for modern enterprise use.

---

## 🧩 Roles & Features

### 🔐 Admin
- Create and manage **HRs** and **Managers**
- Modify employee records across all departments

### 🧑‍💼 HR
- Create and manage **Employees**
- Create and assign **Teams**
- Mark/edit **Attendance** for employees
- View **Overall Attendance** reports

### 📊 Manager
- View **Team Members' Attendance**
- View assigned team structures

### 👤 Employee
- View **Personal Attendance** history

---

## 🧰 Tech Stack

- **Frontend**: React.js / Next.js (optional)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT / Role-based Access Control
- **Styling**: Tailwind CSS / Bootstrap (optional)
- **APIs**: RESTful APIs for all user roles

---

## 📁 Folder Structure

.
├── client/               # Frontend application
│   ├── pages/
│   ├── components/
│   └── public/
├── server/               # Backend Node.js application
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/       # Auth & Role-check logic
│   └── utils/
├── .env
├── .gitignore
└── README.md
