import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

export default function StaffPage(){
  const [staff, setStaff] = useState([])
  const [form, setForm] = useState({name:'', role:'', contact:'', salary:''})
  const [errors, setErrors] = useState({})
  useEffect(()=>{fetchStaff()},[])
  const fetchStaff=async()=>{const res=await api.get('/staff');setStaff(res.data)}

  const validateForm = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.role.trim()) newErrors.role = 'Role is required'
    if (!form.contact.trim()) newErrors.contact = 'Contact is required'
    else if (!/^\d{10}$/.test(form.contact)) newErrors.contact = 'Contact must be a 10-digit number'
    else if (staff.some(s => s.contact === form.contact)) newErrors.contact = 'Contact number already exists'
    if (!form.salary.trim()) newErrors.salary = 'Salary is required'
    else if (isNaN(form.salary) || parseFloat(form.salary) <= 0) newErrors.salary = 'Salary must be a positive number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const add=async e=>{
    e.preventDefault()
    if (!validateForm()) return
    await api.post('/staff',form)
    setForm({name:'', role:'', contact:'', salary:''})
    setErrors({})
    fetchStaff()
  }
  const del=async id=>{await api.delete(`/staff/${id}`);fetchStaff()}
  return (
    <div>
  <PageHeader title="Staff" subtitle="manage hospital staff" variant="staff" />

      <Card className="mb-3 page-inner">
        <div className="card-title">Create staff member</div>
        <form onSubmit={add} className="row g-2 mb-0">
          <div className="col">
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="form-control"/>
            {errors.name && <div className="text-danger small">{errors.name}</div>}
          </div>
          <div className="col">
            <input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Role" className="form-control"/>
            {errors.role && <div className="text-danger small">{errors.role}</div>}
          </div>
          <div className="col">
            <input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} placeholder="Contact" className="form-control"/>
            {errors.contact && <div className="text-danger small">{errors.contact}</div>}
          </div>
          <div className="col">
            <input value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} placeholder="Salary" className="form-control"/>
            {errors.salary && <div className="text-danger small">{errors.salary}</div>}
          </div>
          <div className="col-12"><button className="btn btn-primary mt-2">Create Staff</button></div>
        </form>
      </Card>

      <table className="table"><thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Contact</th><th>Salary</th><th>Actions</th></tr></thead><tbody>
        {staff.map(s=>(<tr key={s.staff_id}><td>{s.staff_id}</td><td>{s.name}</td><td>{s.role}</td><td>{s.contact}</td><td>{s.salary}</td><td><button className="btn btn-sm btn-danger" onClick={()=>del(s.staff_id)}>Delete</button></td></tr>))}
      </tbody></table>
    </div>
  )
}
