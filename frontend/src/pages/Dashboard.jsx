import React from "react";

export default function Dashboard() {
  return (
    <div className="page-inner">
      
      {/* Header */}
      <div className="header-hero">
        <h2>Dashboard</h2>
        <span className="small-muted">Hospital Management System</span>
      </div>

      {/* Welcome Text */}
      <div className="card-like" style={{ marginTop: "12px" }}>
        <h4 className="card-title">Welcome</h4>
        <p className="card-sub">
          This is the main dashboard of the Hospital Management System.  
          Use the navigation on the left or top to manage:
        </p>

        <ul style={styles.list}>
          <li>Patients</li>
          <li>Doctors</li>
          <li>Appointments</li>
          <li>Rooms & Wards</li>
          <li>Billing</li>
          <li>Staff & Administration</li>
        </ul>

        <p className="small-muted" style={{ marginTop: "10px" }}>
          Select any section to begin managing hospital operations.
        </p>
      </div>

    </div>
  );
}

const styles = {
  list: {
    marginTop: "8px",
    marginBottom: "0",
    paddingLeft: "18px",
    lineHeight: "1.7",
    color: "var(--text)",
    fontSize: "0.95rem"
  }
};
