import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Alert from '../components/Alert'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

export default function DoctorsPage(){
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({name:'', specialization:'', phone:'', email:''})
  const [errors, setErrors] = useState({})
  useEffect(()=>{fetchDoctors()},[])
  const fetchDoctors=async()=>{const res=await api.get('/doctors');setDoctors(res.data)}
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.specialization.trim()) newErrors.specialization = 'Specialization is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = 'Phone must be a 10-digit number'
    else if (doctors.some(d => d.phone === form.phone)) newErrors.phone = 'Phone number already exists'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Email must be valid'
    else if (doctors.some(d => d.email === form.email)) newErrors.email = 'Email already exists'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const add=async e=>{
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      await api.post('/doctors',form)
      setMessage('Doctor added successfully')
      setForm({name:'', specialization:'', phone:'', email:''})
      setErrors({})
      fetchDoctors()
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Failed to create doctor'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }
  const del=async id=>{await api.delete(`/doctors/${id}`);fetchDoctors()}
  return (
    <div>
      <PageHeader title="Doctors" subtitle="manage medical practitioners" variant="doctors">
        <div className="page-actions">
          {/* header-level actions can go here */}
        </div>
      </PageHeader>

      <Card className="mb-3 page-inner">
        <div className="card-title">Create doctor</div>
        {message && <Alert type="success" onClose={() => setMessage(null)}>{message}</Alert>}
        {error && <Alert type="danger" onClose={() => setError(null)}>{error}</Alert>}
        <form onSubmit={add} className="mb-0 row g-2">
          <div className="col">
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="form-control" placeholder="Name" required/>
            {errors.name && <div className="text-danger small">{errors.name}</div>}
          </div>
          <div className="col">
            <input value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} className="form-control" placeholder="Specialization"/>
            {errors.specialization && <div className="text-danger small">{errors.specialization}</div>}
          </div>
          <div className="col">
            <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="form-control" placeholder="Phone"/>
            {errors.phone && <div className="text-danger small">{errors.phone}</div>}
          </div>
          <div className="col">
            <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="form-control" placeholder="Email"/>
            {errors.email && <div className="text-danger small">{errors.email}</div>}
          </div>
          <div className="col-12"><button className="btn btn-primary mt-2" disabled={loading}>{loading ? 'Creating...' : 'Create Doctor'}</button></div>
        </form>
      </Card>

      <table className="table table-bordered">
        <thead><tr><th>ID</th><th>Name</th><th>Spec</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody>
          {doctors.map(d=> (
            <tr key={d.doctor_id}><td>{d.doctor_id}</td><td>{d.name}</td><td>{d.specialization}</td><td>{d.phone}</td><td>{d.email}</td><td><button className="btn btn-sm btn-danger" onClick={()=>del(d.doctor_id)}>Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
