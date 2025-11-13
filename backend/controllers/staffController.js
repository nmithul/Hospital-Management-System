// controllers/staffController.js
// CRUD for staff

const pool = require('../config/db');

exports.getAllStaff = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM staff');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get staff' });
  }
};

exports.getStaffById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.promise().query('SELECT * FROM staff WHERE staff_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Staff not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get staff' });
  }
};

exports.createStaff = async (req, res) => {
  const { name, role, contact, salary } = req.body;
  try {
    // Find the smallest available staff_id
    const [rows] = await pool.promise().query('SELECT staff_id FROM staff ORDER BY staff_id');
    const ids = rows.map(r => r.staff_id);
    let newId = 1;
    while (ids.includes(newId)) newId++;
    const [result] = await pool.promise().query(
      'INSERT INTO staff (staff_id, name, role, contact, salary) VALUES (?, ?, ?, ?, ?)',
      [newId, name, role, contact, salary]
    );
    res.status(201).json({ staff_id: newId, message: 'Staff created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, role, contact, salary } = req.body;
  try {
    const [result] = await pool.promise().query(
      'UPDATE staff SET name = ?, role = ?, contact = ?, salary = ? WHERE staff_id = ?',
      [name, role, contact, salary, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Staff not found' });
    res.json({ message: 'Staff updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update staff' });
  }
};

exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.promise().query('DELETE FROM staff WHERE staff_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Staff not found' });
    res.json({ message: 'Staff deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete staff' });
  }
};
