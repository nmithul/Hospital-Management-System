-- hospital_management.sql
-- MySQL schema + sample data for Hospital Management System

DROP DATABASE IF EXISTS hospital_management;
CREATE DATABASE hospital_management;
USE hospital_management;

-- Doctors
CREATE TABLE doctors (
  doctor_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(100) UNIQUE
) ENGINE=InnoDB;

-- Rooms
CREATE TABLE rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  room_type VARCHAR(50) NOT NULL,
  availability BOOLEAN DEFAULT TRUE,
  charges DECIMAL(10,2) DEFAULT 0.00
) ENGINE=InnoDB;

-- Patients
CREATE TABLE patients (
  patient_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INT,
  gender ENUM('Male','Female','Other') DEFAULT 'Other',
  contact VARCHAR(50),
  address TEXT,
  admission_date DATE,
  discharge_date DATE,
  doctor_id INT,
  room_id INT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Appointments
CREATE TABLE appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATETIME NOT NULL,
  diagnosis TEXT,
  prescription TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Bills
CREATE TABLE bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  total_amount DECIMAL(12,2) DEFAULT 0.00,
  payment_status ENUM('Pending','Paid','Cancelled') DEFAULT 'Pending',
  payment_date DATE,
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Staff
CREATE TABLE staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  contact VARCHAR(50),
  salary DECIMAL(12,2) DEFAULT 0.00
) ENGINE=InnoDB;

-- Sample Data: Doctors (10)
INSERT INTO doctors (name, specialization, phone, email) VALUES
('Dr. Alice Smith','Cardiology','+1-555-0101','alice.smith@example.com'),
('Dr. Bob Johnson','Neurology','+1-555-0102','bob.johnson@example.com'),
('Dr. Carol Lee','Pediatrics','+1-555-0103','carol.lee@example.com'),
('Dr. David Kim','Orthopedics','+1-555-0104','david.kim@example.com'),
('Dr. Eva Brown','Dermatology','+1-555-0105','eva.brown@example.com'),
('Dr. Frank Green','General Medicine','+1-555-0106','frank.green@example.com'),
('Dr. Grace White','Oncology','+1-555-0107','grace.white@example.com'),
('Dr. Henry Black','Radiology','+1-555-0108','henry.black@example.com'),
('Dr. Irene Gold','ENT','+1-555-0109','irene.gold@example.com'),
('Dr. Jason Blue','Psychiatry','+1-555-0110','jason.blue@example.com');

-- Sample Data: Rooms (10)
INSERT INTO rooms (room_type, availability, charges) VALUES
('General Ward', TRUE, 500.00),
('Private Room', TRUE, 2000.00),
('ICU', TRUE, 5000.00),
('Semi-Private', TRUE, 1200.00),
('Deluxe', TRUE, 3500.00),
('Maternity', TRUE, 1800.00),
('Pediatric Ward', TRUE, 800.00),
('Operation Theater', FALSE, 0.00),
('Recovery', TRUE, 600.00),
('Observation', TRUE, 400.00);

-- Sample Data: Patients (10) referencing doctors 1-10 and rooms 1-10
INSERT INTO patients (name, age, gender, contact, address, admission_date, discharge_date, doctor_id, room_id) VALUES
('John Doe',35,'Male','+1-555-0201','123 Main St','2025-10-01',NULL,1,2),
('Mary Jane',28,'Female','+1-555-0202','456 Oak Ave','2025-10-05','2025-10-12',2,1),
('Peter Parker',18,'Male','+1-555-0203','789 Pine Rd','2025-11-01',NULL,3,7),
('Bruce Wayne',45,'Male','+1-555-0204','1007 Mountain Dr','2025-09-20','2025-09-25',4,3),
('Diana Prince',32,'Female','+1-555-0205','200 Amazon Ln','2025-11-03',NULL,5,5),
('Clark Kent',30,'Male','+1-555-0206','500 Daily Planet','2025-10-21','2025-10-28',6,4),
('Natasha Romanoff',35,'Female','+1-555-0207','777 Spy St','2025-10-30',NULL,7,6),
('Tony Stark',50,'Male','+1-555-0208','10885 Malibu','2025-11-05',NULL,8,9),
('Steve Rogers',102,'Male','+1-555-0209','Brooklyn, NY','2025-09-01','2025-09-10',9,8),
('Wanda Maximoff',29,'Female','+1-555-0210','Wanda St','2025-11-07',NULL,10,10);

-- Sample Data: Appointments (10)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, diagnosis, prescription) VALUES
(1,1,'2025-10-02 10:00:00','Hypertension','Amlodipine 5mg daily'),
(2,2,'2025-10-06 11:00:00','Migraine','Sumatriptan as needed'),
(3,3,'2025-11-02 09:30:00','Flu','Rest and fluids'),
(4,4,'2025-09-21 14:00:00','Fracture','Cast & analgesics'),
(5,5,'2025-11-04 13:00:00','Eczema','Topical steroid'),
(6,6,'2025-10-22 15:00:00','Fever','Paracetamol'),
(7,7,'2025-10-31 10:30:00','Cancer follow-up','Chemotherapy plan'),
(8,8,'2025-11-06 16:00:00','Chest pain','ECG & observation'),
(9,9,'2025-09-02 12:00:00','Ear infection','Antibiotics'),
(10,10,'2025-11-08 09:00:00','Anxiety','Therapy + SSRI');

-- Sample Data: Bills (10)
INSERT INTO bills (patient_id, total_amount, payment_status, payment_date) VALUES
(1,1500.00,'Paid','2025-10-15'),
(2,800.00,'Paid','2025-10-13'),
(3,300.00,'Pending',NULL),
(4,2500.00,'Paid','2025-09-30'),
(5,500.00,'Pending',NULL),
(6,1200.00,'Paid','2025-11-01'),
(7,10000.00,'Pending',NULL),
(8,4000.00,'Pending',NULL),
(9,700.00,'Paid','2025-09-12'),
(10,450.00,'Pending',NULL);

-- Sample Data: Staff (10)
INSERT INTO staff (name, role, contact, salary) VALUES
('Alice Admin','Receptionist','+1-555-0301',3000.00),
('Bob Cleaner','Maintenance','+1-555-0302',2000.00),
('Carol Nurse','Nurse','+1-555-0303',4500.00),
('David Nurse','Nurse','+1-555-0304',4600.00),
('Eva Accountant','Accountant','+1-555-0305',5000.00),
('Frank Tech','Lab Technician','+1-555-0306',4200.00),
('Grace HR','HR Manager','+1-555-0307',5500.00),
('Henry Driver','Driver','+1-555-0308',2500.00),
('Irene Pharmacist','Pharmacist','+1-555-0309',4800.00),
('Jason Security','Security','+1-555-0310',2800.00);

-- End of sample data
