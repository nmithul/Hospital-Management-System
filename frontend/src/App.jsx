import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PatientsPage from './pages/PatientsPage'
import DoctorsPage from './pages/DoctorsPage'
import AppointmentsPage from './pages/AppointmentsPage'
import RoomsPage from './pages/RoomsPage'
import BillsPage from './pages/BillsPage'
import StaffPage from './pages/StaffPage'
import './App.css'

// Simple navbar + routes
export default function App() {
  const location = useLocation()
  const section = location.pathname.split('/')[1]
  const variantClass = section ? `variant-${section}` : ''

  return (
    <div className="container mt-4">
      <nav className={`navbar navbar-expand mb-4 ${variantClass}`}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/"> <span className="brand-accent">Hospital</span>MS</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/patients">Patients</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/doctors">Doctors</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/appointments">Appointments</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/rooms">Rooms</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/bills">Bills</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/staff">Staff</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="card-like mb-4 header-hero">
        <div>
          <h2>Hospital Management <span className="small-muted">System</span></h2>
          <div className="small-muted">Manage patients, doctors, appointments and more.</div>
        </div>
        <div>
          <button className="btn btn-sm btn-outline-light me-2">Reports</button>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/bills" element={<BillsPage />} />
        <Route path="/staff" element={<StaffPage />} />
      </Routes>
    </div>
  )
}
