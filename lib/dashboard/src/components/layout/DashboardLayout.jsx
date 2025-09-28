import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import './DashboardLayout.css'

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="dashboard-layout">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="dashboard-main">
        <Sidebar isOpen={sidebarOpen} />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout