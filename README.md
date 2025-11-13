# Hospital Management System

This repository contains a simple Hospital Management System built with React (frontend), Node.js + Express (backend), and MySQL (database).

## Features
- Manage Patients, Doctors, Appointments, Rooms, Bills, and Staff
- CRUD operations for all entities
- Filter appointments by date or doctor
- Display relationships (patient-doctor-room)

## Tech Stack
- Frontend: React, Vite, Axios, Bootstrap
- Backend: Node.js, Express, mysql2
- Database: MySQL

## Database Schema (Mermaid)

```mermaid
erDiagram
    DOCTORS ||--o{ PATIENTS : treats
    DOCTORS ||--o{ APPOINTMENTS : has
    PATIENTS ||--o{ APPOINTMENTS : "has"
    PATIENTS ||--o{ BILLS : "billed"
    ROOMS ||--o{ PATIENTS : assigned_to
    STAFF {
        int staff_id
        string name
        string role
        string contact
        decimal salary
    }
    DOCTORS {
        int doctor_id
        string name
        string specialization
        string phone
        string email
    }
    PATIENTS {
        int patient_id
        string name
        int age
        string gender
        string contact
        string address
        date admission_date
        date discharge_date
        int doctor_id
        int room_id
    }
    APPOINTMENTS {
        int appointment_id
        int patient_id
        int doctor_id
        datetime appointment_date
        string diagnosis
        string prescription
    }
    ROOMS {
        int room_id
        string room_type
        bool availability
        decimal charges
    }
    BILLS {
        int bill_id
        int patient_id
        decimal total_amount
        string payment_status
        date payment_date
    }
```

## Installation
1. Create the database and tables by running the `hospital_management.sql` script in a MySQL client.
2. Backend:

```powershell
cd backend
npm install
copy .env.example .env
# Edit .env to set DB credentials
npm run dev
```

3. Frontend:

```powershell
cd frontend
npm install
npm run dev
```

## API Endpoints
- /api/patients
- /api/doctors
- /api/appointments
- /api/rooms
- /api/bills
- /api/staff

## Notes
- The backend uses a connection pool and prepared statements via `mysql2`.
- The frontend expects the backend at `http://localhost:5000/api` by default; set `VITE_API_BASE` to change.

