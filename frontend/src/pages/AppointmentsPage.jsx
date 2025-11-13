import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

export default function AppointmentsPage(){
  const [appointments, setAppointments] = useState([])
  const [filters, setFilters] = useState({doctor_id:'', date:''})
  const [form, setForm] = useState({patient_id:'', doctor_id:'', appointment_date:'', diagnosis:'', prescription:''})
  const [errors, setErrors] = useState({})

  useEffect(()=>{fetchAppointments()},[])
  const fetchAppointments=async ()=>{
    const res = await api.get('/appointments', { params: filters })
    setAppointments(res.data)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.patient_id.trim()) newErrors.patient_id = 'Patient ID is required'
    if (!form.doctor_id.trim()) newErrors.doctor_id = 'Doctor ID is required'
    if (!form.appointment_date.trim()) newErrors.appointment_date = 'Appointment date is required'
    if (!form.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required'
    if (!form.prescription.trim()) newErrors.prescription = 'Prescription is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const add = async e => {
    e.preventDefault()
    if (!validateForm()) return
    await api.post('/appointments', form)
    setForm({patient_id:'', doctor_id:'', appointment_date:'', diagnosis:'', prescription:''})
    setErrors({})
    fetchAppointments()
  }
  const del = async id => { await api.delete(`/appointments/${id}`); fetchAppointments() }

  return (
    <div>
      <PageHeader title="Appointments" subtitle="schedule and review" variant="appointments">
        <div className="page-actions"></div>
      </PageHeader>

      <Card className="mb-3 page-inner">
        <div className="card-title">New appointment</div>
        <form className="row g-2 mb-0" onSubmit={add}>
          <div className="col">
            <input placeholder="Patient ID" value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} className="form-control"/>
            {errors.patient_id && <div className="text-danger small">{errors.patient_id}</div>}
          </div>
          <div className="col">
            <input placeholder="Doctor ID" value={form.doctor_id} onChange={e=>setForm({...form,doctor_id:e.target.value})} className="form-control"/>
            {errors.doctor_id && <div className="text-danger small">{errors.doctor_id}</div>}
          </div>
          <div className="col">
            <input type="datetime-local" value={form.appointment_date} onChange={e=>setForm({...form,appointment_date:e.target.value})} className="form-control"/>
            {errors.appointment_date && <div className="text-danger small">{errors.appointment_date}</div>}
          </div>
          <div className="col-12">
            <input placeholder="Diagnosis" value={form.diagnosis} onChange={e=>setForm({...form,diagnosis:e.target.value})} className="form-control"/>
            {errors.diagnosis && <div className="text-danger small">{errors.diagnosis}</div>}
          </div>
          <div className="col-12">
            <input placeholder="Prescription" value={form.prescription} onChange={e=>setForm({...form,prescription:e.target.value})} className="form-control"/>
            {errors.prescription && <div className="text-danger small">{errors.prescription}</div>}
          </div>
          <div className="col-12"><button className="btn btn-primary mt-2">Create Appointment</button></div>
        </form>
      </Card>

      <div className="mb-3">
        <h5>Filters</h5>
        <div className="row g-2">
          <div className="col"><input placeholder="Doctor ID" value={filters.doctor_id} onChange={e=>setFilters({...filters,doctor_id:e.target.value})} className="form-control"/></div>
          <div className="col"><input type="date" value={filters.date} onChange={e=>setFilters({...filters,date:e.target.value})} className="form-control"/></div>
          <div className="col"><button className="btn btn-secondary" onClick={(e)=>{e.preventDefault();fetchAppointments()}}>Apply</button></div>
        </div>
      </div>

      <table className="table table-hover">
        <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Diagnosis</th><th>Prescription</th><th>Actions</th></tr></thead>
        <tbody>
          {appointments.map(a=> (
            <tr key={a.appointment_id}><td>{a.appointment_id}</td><td>{a.patient_name}</td><td>{a.doctor_name}</td><td>{new Date(a.appointment_date).toLocaleString()}</td><td>{a.diagnosis}</td><td>{a.prescription}</td><td><button className="btn btn-sm btn-danger" onClick={()=>del(a.appointment_id)}>Delete</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
