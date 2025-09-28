function HealthPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Health Check</h1>
          <p className="page-description">
            System diagnostics and health monitoring
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Health Check Dashboard</h3>
        <p>This page will show detailed health metrics and system diagnostics.</p>
        <div className="status-badge status-success">
          All systems operational
        </div>
      </div>
    </div>
  )
}

export default HealthPage