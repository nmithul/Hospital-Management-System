import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Alert from '../components/Alert'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

function AddPatientForm({ onAdded, doctors, rooms, patients }) {
  const [form, setForm] = useState({ name: '', age: '', gender: 'Other', contact: '', address: '', doctor_id: '', room_id: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.age.trim()) newErrors.age = 'Age is required'
    else if (isNaN(form.age) || parseInt(form.age) <= 0 || parseInt(form.age) > 150) newErrors.age = 'Age must be a number between 1 and 150'
    if (!form.contact.trim()) newErrors.contact = 'Contact is required'
    else if (!/^\d{10}$/.test(form.contact)) newErrors.contact = 'Contact must be a 10-digit number'
    else if (patients.some(p => p.contact === form.contact)) newErrors.contact = 'Contact number already exists'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      // convert empty strings to null for optional fields
      const payload = { ...form }
      if (!payload.doctor_id) payload.doctor_id = null
      if (!payload.room_id) payload.room_id = null
      const res = await api.post('/patients', payload)
      setMessage('Patient added successfully')
      setForm({ name: '', age: '', gender: 'Other', contact: '', address: '', doctor_id: '', room_id: '' })
      setErrors({})
      onAdded()
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed to create patient'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-3">
      {message && <Alert type="success" onClose={() => setMessage(null)}>{message}</Alert>}
      {error && <Alert type="danger" onClose={() => setError(null)}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="form-control" required />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
          </div>
          <div className="col-md-2">
            <input name="age" value={form.age} onChange={handleChange} placeholder="Age" className="form-control" type="number"/>
            {errors.age && <div className="text-danger small">{errors.age}</div>}
          </div>
          <div className="col-md-3">
            <select name="gender" value={form.gender} onChange={handleChange} className="form-control">
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-md-3">
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" className="form-control"/>
            {errors.contact && <div className="text-danger small">{errors.contact}</div>}
          </div>
        </div>



        <div className="mt-2">
          <textarea name="address" value={form.address} onChange={handleChange} placeholder="Address" className="form-control"/>
        </div>
        <button className="btn btn-primary mt-2" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Patient'}</button>
      </form>
    </div>
  )
}

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [editing, setEditing] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [pRes, dRes, rRes] = await Promise.all([
        api.get('/patients'),
        api.get('/doctors'),
        api.get('/rooms')
      ])
      setPatients(pRes.data)
      setDoctors(dRes.data)
      setRooms(rRes.data)
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally { setLoading(false) }
  }

  const fetchPatients = async () => { const res = await api.get('/patients'); setPatients(res.data) }
  const deletePatient = async id => { await api.delete(`/patients/${id}`); fetchPatients() }

  const startEdit = p => setEditing(p)
  const cancelEdit = () => setEditing(null)
  const saveEdit = async () => {
    await api.put(`/patients/${editing.patient_id}`, editing)
    setEditing(null)
    fetchPatients()
  }

  return (
    <div>
  <PageHeader title="Patients" subtitle="manage patient records" variant="patients" />

      <Card className="mb-3 page-inner">
        <div className="card-title">New patient</div>
        <AddPatientForm onAdded={fetchPatients} doctors={doctors} rooms={rooms} patients={patients} />
      </Card>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {patients.length === 0 ? (
            <div className="alert alert-secondary">No patients found. Create the first patient above.</div>
          ) : (
            <table className="table table-striped">
              <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Actions</th></tr></thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.patient_id}>
                    <td>{p.patient_id}</td>
                    <td>{editing && editing.patient_id===p.patient_id ? <input className="form-control" value={editing.name} onChange={e=>setEditing({...editing,name:e.target.value})}/> : p.name}</td>
                    <td>{editing && editing.patient_id===p.patient_id ? <input className="form-control" value={editing.age} onChange={e=>setEditing({...editing,age:e.target.value})}/> : p.age}</td>
                    <td>{p.gender}</td>
                    <td>
                      {editing && editing.patient_id===p.patient_id ? (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={saveEdit}>Save</button>
                          <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-primary me-1" onClick={()=>startEdit(p)}>Edit</button>
                          <button className="btn btn-sm btn-danger" onClick={()=>deletePatient(p.patient_id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
