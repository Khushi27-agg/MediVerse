import { Outlet, NavLink } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/appointments', label: 'Appointments', icon: '📅' },
  { path: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
  { path: '/records', label: 'Records', icon: '📋' },
  { path: '/pharmacy', label: 'Pharmacy', icon: '💊' },
]

export default function Layout() {
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
            <div className="user-avatar">JD</div>
          </div>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
