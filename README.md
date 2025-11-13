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


## Notes
- The backend uses a connection pool and prepared statements via `mysql2`.
- The frontend expects the backend at `http://localhost:5000/api` by default; set `VITE_API_BASE` to change.

## Images
<img width="1732" height="847" alt="image" src="https://github.com/user-attachments/assets/c3c42113-6833-4cc3-80a6-e63c47b90c6d" />

<img width="1650" height="715" alt="image" src="https://github.com/user-attachments/assets/bf343216-079f-4ecc-8e3f-6dd72b923f37" />

<img width="1678" height="621" alt="image" src="https://github.com/user-attachments/assets/133676f8-8020-4dc0-9c6b-9427118cad56" />
<img width="1674" height="745" alt="image" src="https://github.com/user-attachments/assets/be11a609-d2d9-4c6d-b46b-39d3b9b168f2" />
<img width="1726" height="963" alt="image" src="https://github.com/user-attachments/assets/acf1d67e-5665-4b96-b973-e843a7f20273" />
<img width="1689" height="617" alt="image" src="https://github.com/user-attachments/assets/fa0e9aae-f577-49a9-a68a-48dced9be0be" />
<img width="1702" height="963" alt="image" src="https://github.com/user-attachments/assets/45b28b57-40e9-4618-8f91-99a3aa4230fd" />








