// controllers/patientsController.js
// Business logic for patients CRUD operations.

const pool = require('../config/db');

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const [rows] = await pool.promise().query(
      `SELECT p.*, d.name AS doctor_name, r.room_type AS room_type FROM patients p
       LEFT JOIN doctors d ON p.doctor_id = d.doctor_id
       LEFT JOIN rooms r ON p.room_id = r.room_id`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get patients' });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.promise().query('SELECT * FROM patients WHERE patient_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get patient' });
  }
};

// Create patient
exports.createPatient = async (req, res) => {
  const { name, age, gender, contact, address, admission_date, discharge_date, doctor_id, room_id } = req.body;
  try {
    // Validate foreign keys: doctor_id and room_id (if provided) exist
    if (doctor_id) {
      const [docRows] = await pool.promise().query('SELECT doctor_id FROM doctors WHERE doctor_id = ?', [doctor_id]);
      if (docRows.length === 0) return res.status(400).json({ error: 'Invalid doctor_id: referenced doctor does not exist' });
    }
    if (room_id) {
      const [roomRows] = await pool.promise().query('SELECT room_id FROM rooms WHERE room_id = ?', [room_id]);
      if (roomRows.length === 0) return res.status(400).json({ error: 'Invalid room_id: referenced room does not exist' });
    }
    // Find the smallest available patient_id
    const [rows] = await pool.promise().query('SELECT patient_id FROM patients ORDER BY patient_id');
    const ids = rows.map(r => r.patient_id);
    let newId = 1;
    while (ids.includes(newId)) newId++;
    const [result] = await pool.promise().query(
      `INSERT INTO patients (patient_id, name, age, gender, contact, address, admission_date, discharge_date, doctor_id, room_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newId, name, age, gender, contact, address, admission_date || null, discharge_date || null, doctor_id || null, room_id || null]
    );
    res.status(201).json({ patient_id: newId, message: 'Patient created' });
  } catch (err) {
    console.error('createPatient error:', err.message || err);
    // Map common SQL errors to friendly responses
    if (err && err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Foreign key constraint failed: referenced record not found' });
    }
    res.status(500).json({ error: 'Failed to create patient', details: err.message });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, contact, address, admission_date, discharge_date, doctor_id, room_id } = req.body;
  try {
    const [result] = await pool.promise().query(
      `UPDATE patients SET name = ?, age = ?, gender = ?, contact = ?, address = ?, admission_date = ?, discharge_date = ?, doctor_id = ?, room_id = ? WHERE patient_id = ?`,
      [name, age, gender, contact, address, admission_date || null, discharge_date || null, doctor_id || null, room_id || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update patient' });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.promise().query('DELETE FROM patients WHERE patient_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete patient' });
  }
};
