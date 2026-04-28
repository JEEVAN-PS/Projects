# Hospital Management System

A full-stack hospital management application with a React frontend and Spring Boot backend.

## Project Overview

This project consists of two main applications:
- **hospital-frontend**: React-based user interface for patients and admins
- **hospital-management**: Spring Boot REST API backend with MySQL database

---

## 📁 Project Structure

### hospital-frontend/ (React)
```
hospital-frontend/
├── public/                 # Static files
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── pages/             # React components
│   │   ├── Admin.js
│   │   ├── AdminLogin.js
│   │   ├── AdminRegister.js
│   │   ├── Appointments.js
│   │   ├── ChangePassword.js
│   │   ├── Dashboard.js
│   │   ├── Doctors.js
│   │   ├── ForgotPassword.js
│   │   ├── ModernAuth.js
│   │   ├── UserLogin.js
│   │   └── UserRegister.js
│   ├── services/
│   │   └── api.js        # API calls to backend
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   └── setupTests.js
├── package.json          # Dependencies
└── README.md
```

### hospital-management/ (Spring Boot)
```
hospital-management/
├── src/
│   ├── main/java/com/hospital/
│   │   ├── HospitalManagementApplication.java
│   │   ├── config/              # Configuration classes
│   │   │   ├── SwaggerConfig.java
│   │   │   └── WebConfig.java
│   │   ├── controller/          # REST endpoints
│   │   │   ├── AdminAuthController.java
│   │   │   ├── AppointmentController.java
│   │   │   ├── DoctorController.java
│   │   │   └── UserAuthController.java
│   │   ├── dto/                 # Data transfer objects
│   │   │   ├── AppointmentResponse.java
│   │   │   └── LoginRequest.java
│   │   ├── model/               # Entity models
│   │   │   ├── Appointment.java
│   │   │   ├── Doctor.java
│   │   │   └── User.java
│   │   ├── repository/          # Data access layer
│   │   │   ├── AppointmentRepository.java
│   │   │   ├── DoctorRepository.java
│   │   │   └── UserRepository.java
│   │   ├── security/            # JWT & authentication
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── JwtFilter.java
│   │   │   └── JwtUtil.java
│   │   └── service/             # Business logic layer
│   ├── resources/
│   │   └── application.properties
│   └── test/java/              # Unit tests
├── pom.xml                      # Maven dependencies
├── mvnw / mvnw.cmd             # Maven wrapper
└── HELP.md
```

---

## 🛠 Tech Stack

**Frontend:**
- React.js
- CSS3
- Axios (for API calls)

**Backend:**
- Java 8+
- Spring Boot 3.x
- Spring Security (JWT authentication)
- Spring Data JPA
- MySQL Database
- Swagger/OpenAPI

---

## 🚀 Getting Started

### Frontend Setup
```bash
cd hospital-frontend
npm install
npm start
```
Runs on: http://localhost:3000

### Backend Setup
```bash
cd hospital-management
mvn clean install
mvn spring-boot:run
```
Runs on: http://localhost:8080

---

## 📋 Key Features

- User authentication (Patient & Admin login/register)
- Doctor management
- Appointment booking system
- Password change functionality
- JWT-based security
- RESTful API endpoints
- Responsive UI

---

## 👥 User Roles & Permissions

### 1. User Registration & Login
Users can create an account and login to access:
- 📅 Book appointments with doctors
- ❌ Cancel appointments
- 👨‍⚕️ View available doctors
- 📋 View their appointments

### 2. Admin Registration & Login
Admins can create an account and login to access:
- ➕ Add new doctors
- 🗑️ Delete doctors
- 👨‍⚕️ View all doctors
- 📊 Manage all appointments

---

## 📋 Queue Management System

The system uses a queue-based appointment management approach:
- **Appointment Queue**: Appointments are queued based on booking time
- **First-Come, First-Serve**: Patients are served in the order they book appointments
- **Doctor Availability**: Each doctor has a queue of scheduled appointments
- **Status Tracking**: Appointments move through states (Pending → Scheduled → Completed/Cancelled)
- **Real-time Updates**: Users and admins can view live queue status
- **Smart Scheduling**: System prevents double-booking and manages doctor availability
- **Cancellation Updates**: When an appointment is cancelled, the queue is automatically updated and adjusted for better scheduling

