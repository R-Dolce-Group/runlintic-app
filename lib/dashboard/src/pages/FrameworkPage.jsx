function FrameworkPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Framework Decision</h1>
          <p className="page-description">
            Express.js vs Fastify performance comparison and decision matrix
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Framework Evaluation</h3>
        <p>This page will display the comprehensive Express.js vs Fastify evaluation results and decision matrix.</p>

        <div style={{ marginTop: '1rem' }}>
          <div className="status-badge status-info">
            Evaluation in progress
          </div>
        </div>
      </div>
    </div>
  )
}

export default FrameworkPage