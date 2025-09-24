import { NavLink } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ isOpen }) {
  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: '📊',
      description: 'Overview & metrics'
    },
    {
      path: '/health',
      label: 'Health Check',
      icon: '🏥',
      description: 'System health & diagnostics'
    },
    {
      path: '/project',
      label: 'Project Context',
      icon: '📁',
      description: 'Project information'
    },
    {
      path: '/dependencies',
      label: 'Dependencies',
      icon: '📦',
      description: 'Package analysis'
    },
    {
      path: '/framework',
      label: 'Framework Decision',
      icon: '⚡',
      description: 'Express.js vs Fastify'
    }
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-section-title">Main</h3>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  end={item.path === '/'}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="version-info">
            <span className="version-label">Version</span>
            <span className="version-number">v8.0.0</span>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar