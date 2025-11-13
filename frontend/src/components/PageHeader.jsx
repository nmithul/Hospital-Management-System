import React from 'react'

export default function PageHeader({ title, subtitle, children, variant }){
  const cls = `header-hero card-like ${variant ? 'variant-'+variant : ''}`
  return (
    <div className={cls} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div>
        <h2 style={{margin:0}}>{title} <span className="small-muted">{subtitle}</span></h2>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}
