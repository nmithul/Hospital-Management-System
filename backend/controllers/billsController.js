// controllers/billsController.js
// CRUD for bills

const pool = require('../config/db');

exports.getAllBills = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT b.*, p.name AS patient_name FROM bills b JOIN patients p ON b.patient_id = p.patient_id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get bills' });
  }
};

exports.getBillById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.promise().query('SELECT * FROM bills WHERE bill_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Bill not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get bill' });
  }
};

exports.createBill = async (req, res) => {
  const { patient_id, total_amount, payment_status, payment_date } = req.body;
  try {
    // Find the smallest available bill_id
    const [rows] = await pool.promise().query('SELECT bill_id FROM bills ORDER BY bill_id');
    const ids = rows.map(r => r.bill_id);
    let newId = 1;
    while (ids.includes(newId)) newId++;
    const [result] = await pool.promise().query(
      'INSERT INTO bills (bill_id, patient_id, total_amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?)',
      [newId, patient_id, total_amount, payment_status, payment_date || null]
    );
    res.status(201).json({ bill_id: newId, message: 'Bill created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create bill' });
  }
};

exports.updateBill = async (req, res) => {
  const { id } = req.params;
  const { patient_id, total_amount, payment_status, payment_date } = req.body;
  try {
    const [result] = await pool.promise().query(
      'UPDATE bills SET patient_id = ?, total_amount = ?, payment_status = ?, payment_date = ? WHERE bill_id = ?',
      [patient_id, total_amount, payment_status, payment_date || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Bill not found' });
    res.json({ message: 'Bill updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update bill' });
  }
};

exports.deleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.promise().query('DELETE FROM bills WHERE bill_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Bill not found' });
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
};
