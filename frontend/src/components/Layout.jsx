import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/appointments', label: 'Appointments', icon: '📅' },
    { path: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { path: '/records', label: 'Records', icon: '📋' },
    { path: '/prescriptions', label: 'Prescriptions', icon: '🩺' },
    { path: '/pharmacy', label: 'Pharmacy', icon: '💊' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">🏥</span>
            <span className="brand-name">MediVerse</span>
          </div>
          <nav className="nav">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <div className="user-avatar">{initials}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              ↪ Logout
            </button>
          </div>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
