import { Link } from 'react-router-dom'
import './Home.css'

const stats = [
  { label: 'Doctors Available', value: '120+', icon: '👨‍⚕️', color: '#0ea5e9' },
  { label: 'Appointments Today', value: '48', icon: '📅', color: '#10b981' },
  { label: 'Prescriptions', value: '12', icon: '💊', color: '#f59e0b' },
  { label: 'Health Score', value: '92%', icon: '❤️', color: '#ef4444' },
]

const quickActions = [
  { label: 'Book Appointment', path: '/appointments', icon: '📅', desc: 'Schedule with a doctor', color: '#0ea5e9' },
  { label: 'Find Doctors', path: '/doctors', icon: '👨‍⚕️', desc: 'Browse specialists', color: '#10b981' },
  { label: 'Medical Records', path: '/records', icon: '📋', desc: 'View your history', color: '#8b5cf6' },
  { label: 'Pharmacy', path: '/pharmacy', icon: '💊', desc: 'Order medicines', color: '#f59e0b' },
]

const upcomingAppointments = [
  { doctor: 'Dr. Priya Sharma', specialty: 'Cardiologist', date: 'Jun 3, 2026', time: '10:00 AM', avatar: 'PS' },
  { doctor: 'Dr. Arjun Mehta', specialty: 'Dermatologist', date: 'Jun 7, 2026', time: '2:30 PM', avatar: 'AM' },
]

const healthTips = [
  { tip: 'Drink at least 8 glasses of water daily', icon: '💧' },
  { tip: 'Get 7-8 hours of quality sleep each night', icon: '😴' },
  { tip: 'Take a 30-minute walk every day', icon: '🚶' },
  { tip: 'Eat more fruits and vegetables', icon: '🥗' },
]

export default function Home() {
  return (
    <div className="page home">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Welcome back, <span className="name-highlight">Jane Doe</span> 👋</h1>
          <p>Your health, simplified. Here's your health overview for today.</p>
        </div>
        <div className="welcome-illustration">🏥</div>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="card stat-card">
            <div className="stat-icon" style={{ background: s.color + '20', color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="home-grid">
        <div className="home-main">
          <h2 className="section-title">Quick Actions</h2>
          <div className="grid-2" style={{ marginBottom: 32 }}>
            {quickActions.map(a => (
              <Link key={a.label} to={a.path} className="action-card card">
                <div className="action-icon" style={{ background: a.color + '15', color: a.color }}>
                  {a.icon}
                </div>
                <div>
                  <div className="action-label">{a.label}</div>
                  <div className="action-desc">{a.desc}</div>
                </div>
                <span className="action-arrow">→</span>
              </Link>
            ))}
          </div>

          <h2 className="section-title">Upcoming Appointments</h2>
          <div className="appointments-list">
            {upcomingAppointments.map(a => (
              <div key={a.doctor} className="card appt-item">
                <div className="appt-avatar">{a.avatar}</div>
                <div className="appt-info">
                  <div className="appt-doctor">{a.doctor}</div>
                  <div className="appt-specialty">{a.specialty}</div>
                </div>
                <div className="appt-time">
                  <div className="appt-date">{a.date}</div>
                  <div className="appt-hour">{a.time}</div>
                </div>
                <span className="badge badge-blue">Confirmed</span>
              </div>
            ))}
            <Link to="/appointments" className="view-all-link">View all appointments →</Link>
          </div>
        </div>

        <div className="home-side">
          <div className="card health-tips-card">
            <h2 className="section-title" style={{ marginBottom: 16 }}>💡 Daily Health Tips</h2>
            <ul className="tips-list">
              {healthTips.map(t => (
                <li key={t.tip} className="tip-item">
                  <span className="tip-icon">{t.icon}</span>
                  <span>{t.tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card vitals-card">
            <h2 className="section-title" style={{ marginBottom: 16 }}>📊 My Vitals</h2>
            <div className="vitals-list">
              <div className="vital-item">
                <span className="vital-label">Blood Pressure</span>
                <span className="vital-value good">120/80</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Heart Rate</span>
                <span className="vital-value good">72 bpm</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Blood Sugar</span>
                <span className="vital-value warn">108 mg/dL</span>
              </div>
              <div className="vital-item">
                <span className="vital-label">BMI</span>
                <span className="vital-value good">22.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
