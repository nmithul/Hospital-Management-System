// controllers/roomsController.js
// CRUD for rooms

const pool = require('../config/db');

exports.getAllRooms = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM rooms');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get rooms' });
  }
};

exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.promise().query('SELECT * FROM rooms WHERE room_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Room not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get room' });
  }
};

exports.createRoom = async (req, res) => {
  const { room_type, availability, charges } = req.body;
  try {
    // Find the smallest available room_id
    const [rows] = await pool.promise().query('SELECT room_id FROM rooms ORDER BY room_id');
    const ids = rows.map(r => r.room_id);
    let newId = 1;
    while (ids.includes(newId)) newId++;
    const [result] = await pool.promise().query(
      'INSERT INTO rooms (room_id, room_type, availability, charges) VALUES (?, ?, ?, ?)',
      [newId, room_type, availability, charges]
    );
    res.status(201).json({ room_id: newId, message: 'Room created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { room_type, availability, charges } = req.body;
  try {
    const [result] = await pool.promise().query(
      'UPDATE rooms SET room_type = ?, availability = ?, charges = ? WHERE room_id = ?',
      [room_type, availability, charges, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.promise().query('DELETE FROM rooms WHERE room_id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};
