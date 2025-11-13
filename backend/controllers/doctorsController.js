// controllers/doctorsController.js
// Business logic for doctors CRUD operations

const pool = require('../config/db');

exports.getAllDoctors = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM doctors');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get doctors' });
  }
};

exports.getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.promise().query('SELECT * FROM doctors WHERE doctor_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get doctor' });
  }
};

exports.createDoctor = async (req, res) => {
  const { name, specialization, phone, email } = req.body;
  try {
    // Find the smallest available doctor_id
    const [rows] = await pool.promise().query('SELECT doctor_id FROM doctors ORDER BY doctor_id');
    const ids = rows.map(r => r.doctor_id);
    let newId = 1;
    while (ids.includes(newId)) newId++;
    const [result] = await pool.promise().query(
      'INSERT INTO doctors (doctor_id, name, specialization, phone, email) VALUES (?, ?, ?, ?, ?)',
      [newId, name, specialization, phone, email]
    );
    res.status(201).json({ doctor_id: newId, message: 'Doctor created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
};

exports.updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { name, specialization, phone, email } = req.body;
  try {
    const [result] = await pool.promise().query(
      'UPDATE doctors SET name = ?, specialization = ?, phone = ?, email = ? WHERE doctor_id = ?',
      [name, specialization, phone, email, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
};

exports.deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.promise().query('DELETE FROM doctors WHERE doctor_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete doctor' });
  }
};
