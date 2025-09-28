import './Header.css'

function Header({ onToggleSidebar, sidebarOpen }) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <div className="header-brand">
          <span className="brand-icon">🚀</span>
          <h1 className="brand-title">Runlintic Dashboard</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="status-indicator">
          <span className="status-dot success"></span>
          <span className="status-text">Server Running</span>
        </div>
      </div>
    </header>
  )
}

export default Header