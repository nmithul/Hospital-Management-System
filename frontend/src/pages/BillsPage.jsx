import React, { useEffect, useState } from 'react'
import api from '../api/api'
import Card from '../components/Card'
import PageHeader from '../components/PageHeader'

export default function BillsPage(){
  const [bills, setBills] = useState([])
  const [form, setForm] = useState({patient_id:'', total_amount:'', payment_status:'Pending', payment_date:''})
  const [errors, setErrors] = useState({})
  useEffect(()=>{fetchBills()},[])
  const fetchBills=async()=>{const res=await api.get('/bills');setBills(res.data)}

  const validateForm = () => {
    const newErrors = {}
    if (!form.patient_id.trim()) newErrors.patient_id = 'Patient ID is required'
    if (!form.total_amount.trim()) newErrors.total_amount = 'Total amount is required'
    else if (isNaN(form.total_amount) || parseFloat(form.total_amount) <= 0) newErrors.total_amount = 'Total amount must be a positive number'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const add=async e=>{
    e.preventDefault()
    if (!validateForm()) return
    await api.post('/bills',form)
    setForm({patient_id:'', total_amount:'', payment_status:'Pending', payment_date:''})
    setErrors({})
    fetchBills()
  }
  const del=async id=>{await api.delete(`/bills/${id}`);fetchBills()}
  return (
    <div>
  <PageHeader title="Bills" subtitle="billing and payments" variant="bills" />

      <Card className="mb-3 page-inner">
        <div className="card-title">Create bill</div>
        <form onSubmit={add} className="row g-2 mb-0">
          <div className="col">
            <input value={form.patient_id} onChange={e=>setForm({...form,patient_id:e.target.value})} placeholder="Patient ID" className="form-control"/>
            {errors.patient_id && <div className="text-danger small">{errors.patient_id}</div>}
          </div>
          <div className="col">
            <input value={form.total_amount} onChange={e=>setForm({...form,total_amount:e.target.value})} placeholder="Total Amount" className="form-control"/>
            {errors.total_amount && <div className="text-danger small">{errors.total_amount}</div>}
          </div>
          <div className="col-12"><button className="btn btn-primary mt-2">Create Bill</button></div>
        </form>
      </Card>

      <table className="table"><thead><tr><th>ID</th><th>Patient</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        {bills.map(b=>(<tr key={b.bill_id}><td>{b.bill_id}</td><td>{b.patient_name}</td><td>{b.total_amount}</td><td>{b.payment_status}</td><td><button className="btn btn-sm btn-danger" onClick={()=>del(b.bill_id)}>Delete</button></td></tr>))}
      </tbody></table>
    </div>
  )
}
