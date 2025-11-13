// controllers/appointmentsController.js
// Business logic for appointments CRUD

const pool = require('../config/db');

exports.getAllAppointments = async (req, res) => {
  try {
    // Optional filtering by date or doctor
    const { doctor_id, date } = req.query;
    let sql = `SELECT a.*, p.name AS patient_name, d.name AS doctor_name FROM appointments a
               JOIN patients p ON a.patient_id = p.patient_id
               JOIN doctors d ON a.doctor_id = d.doctor_id`;
    const params = [];
    const conditions = [];
    if (doctor_id) {
      conditions.push('a.doctor_id = ?');
      params.push(doctor_id);
    }
    if (date) {
      conditions.push('DATE(a.appointment_date) = ?');
      params.push(date);
    }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY a.appointment_date DESC';
    const [rows] = await pool.promise().query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
};

exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.promise().query('SELECT * FROM appointments WHERE appointment_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get appointment' });
  }
};

exports.createAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, diagnosis, prescription } = req.body;
  try {
    // Find the smallest available appointment_id
    const [rows] = await pool.promise().query('SELECT appointment_id FROM appointments ORDER BY appointment_id');
    const ids = rows.map(r => r.appointment_id);
    let newId = 1;
    while (ids.includes(newId)) newId++;
    const [result] = await pool.promise().query(
      'INSERT INTO appointments (appointment_id, patient_id, doctor_id, appointment_date, diagnosis, prescription) VALUES (?, ?, ?, ?, ?, ?)',
      [newId, patient_id, doctor_id, appointment_date, diagnosis, prescription]
    );
    res.status(201).json({ appointment_id: newId, message: 'Appointment created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id, appointment_date, diagnosis, prescription } = req.body;
  try {
    const [result] = await pool.promise().query(
      'UPDATE appointments SET patient_id = ?, doctor_id = ?, appointment_date = ?, diagnosis = ?, prescription = ? WHERE appointment_id = ?',
      [patient_id, doctor_id, appointment_date, diagnosis, prescription, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.promise().query('DELETE FROM appointments WHERE appointment_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};
