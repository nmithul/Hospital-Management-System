import React from 'react'

// Simple alert component using Bootstrap classes
export default function Alert({ type = 'info', children, onClose }) {
  if (!children) return null
  return (
    <div className={`alert alert-${type} alert-dismissible`} role="alert">
      {children}
      {onClose ? (
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      ) : null}
    </div>
  )
}
