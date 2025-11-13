import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

export default function RoomsPage(){
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({room_type:'', availability:true, charges:''})
  const [errors, setErrors] = useState({})
  useEffect(()=>{fetchRooms()},[])
  const fetchRooms=async()=>{const res=await api.get('/rooms');setRooms(res.data)}

  const validateForm = () => {
    const newErrors = {}
    if (!form.room_type.trim()) newErrors.room_type = 'Room type is required'
    if (!form.charges.trim()) newErrors.charges = 'Charges are required'
    else if (isNaN(form.charges) || parseFloat(form.charges) < 0) newErrors.charges = 'Charges must be a non-negative number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const add=async e=>{
    e.preventDefault()
    if (!validateForm()) return
    await api.post('/rooms',form)
    setForm({room_type:'', availability:true, charges:''})
    setErrors({})
    fetchRooms()
  }
  const del=async id=>{await api.delete(`/rooms/${id}`);fetchRooms()}
  return (
    <div>
  <PageHeader title="Rooms" subtitle="manage room inventory" variant="rooms" />

      <Card className="mb-3 page-inner">
        <div className="card-title">Create room</div>
        <form onSubmit={add} className="row g-2 mb-0">
          <div className="col">
            <input value={form.room_type} onChange={e=>setForm({...form,room_type:e.target.value})} placeholder="Room Type" className="form-control"/>
            {errors.room_type && <div className="text-danger small">{errors.room_type}</div>}
          </div>
          <div className="col">
            <input value={form.charges} onChange={e=>setForm({...form,charges:e.target.value})} placeholder="Charges" className="form-control"/>
            {errors.charges && <div className="text-danger small">{errors.charges}</div>}
          </div>
          <div className="col-12"><button className="btn btn-primary mt-2">Create Room</button></div>
        </form>
      </Card>

      <table className="table"><thead><tr><th>ID</th><th>Type</th><th>Avail</th><th>Charges</th><th>Actions</th></tr></thead><tbody>
        {rooms.map(r=>(<tr key={r.room_id}><td>{r.room_id}</td><td>{r.room_type}</td><td>{r.availability ? 'Yes':'No'}</td><td>{r.charges}</td><td><button className="btn btn-sm btn-danger" onClick={()=>del(r.room_id)}>Delete</button></td></tr>))}
      </tbody></table>
    </div>
  )
}
