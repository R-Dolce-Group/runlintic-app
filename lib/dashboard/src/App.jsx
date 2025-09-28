import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import HomePage from './pages/HomePage'
import HealthPage from './pages/HealthPage'
import ProjectPage from './pages/ProjectPage'
import DependenciesPage from './pages/DependenciesPage'
import FrameworkPage from './pages/FrameworkPage'
import './App.css'

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/dependencies" element={<DependenciesPage />} />
        <Route path="/framework" element={<FrameworkPage />} />
      </Routes>
    </DashboardLayout>
  )
}

export default App