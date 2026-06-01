import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { appointmentsAPI } from '../api'
import './Home.css'

const quickActions = [
  { label: 'Book Appointment', path: '/appointments', icon: '📅', desc: 'Schedule with a doctor', color: '#0ea5e9' },
  { label: 'Find Doctors', path: '/doctors', icon: '👨‍⚕️', desc: 'Browse specialists', color: '#10b981' },
  { label: 'Medical Records', path: '/records', icon: '📋', desc: 'View your history', color: '#8b5cf6' },
  { label: 'Prescriptions', path: '/prescriptions', icon: '🩺', desc: 'View prescriptions', color: '#f59e0b' },
]

const healthTips = [
  { tip: 'Drink at least 8 glasses of water daily', icon: '💧' },
  { tip: 'Get 7–8 hours of quality sleep each night', icon: '😴' },
  { tip: 'Take a 30-minute walk every day', icon: '🚶' },
  { tip: 'Eat more fruits and vegetables', icon: '🥗' },
]

const STATUS_COLORS = {
  Pending: 'badge-yellow',
  Approved: 'badge-green',
  Cancelled: 'badge-red',
  Completed: 'badge-blue',
}

export default function Home() {
  const { user } = useAuth()
  const isDoctor = user?.role === 'doctor'
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    appointmentsAPI.getAll()
      .then(r => setAppointments(r.data.slice(0, 3)))
      .catch(() => {})
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="page home">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Welcome back 👋</h1>
          <p>{isDoctor ? 'Manage your patients and appointments.' : 'Your health, simplified. Here\'s your overview.'}</p>
          <span className="role-pill">{isDoctor ? '👨‍⚕️ Doctor' : '🤒 Patient'}</span>
        </div>
        <div className="welcome-avatar">{initials}</div>
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

          <h2 className="section-title">Recent Appointments</h2>
          {appointments.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
              <p>No appointments yet.</p>
              {!isDoctor && (
                <Link to="/appointments" className="btn btn-primary" style={{ marginTop: 12, display: 'inline-flex' }}>
                  Book your first appointment
                </Link>
              )}
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map(a => (
                <div key={a._id} className="card appt-item">
                  <div className="appt-avatar">
                    {(isDoctor ? a.patientName : a.doctorName || 'Dr')
                      .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="appt-info">
                    <div className="appt-doctor">
                      {isDoctor ? a.patientName : (a.doctorName || 'Doctor TBD')}
                    </div>
                    <div className="appt-specialty">{a.reason || (isDoctor ? 'Patient' : 'Appointment')}</div>
                  </div>
                  <div className="appt-time">
                    <div className="appt-date">{a.date}</div>
                    {a.time && <div className="appt-hour">{a.time}</div>}
                  </div>
                  <span className={`badge ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                </div>
              ))}
              <Link to="/appointments" className="view-all-link">View all appointments →</Link>
            </div>
          )}
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
              {[
                { label: 'Blood Pressure', val: '120/80', cls: 'good' },
                { label: 'Heart Rate', val: '72 bpm', cls: 'good' },
                { label: 'Blood Sugar', val: '108 mg/dL', cls: 'warn' },
                { label: 'BMI', val: '22.5', cls: 'good' },
              ].map(v => (
                <div key={v.label} className="vital-item">
                  <span className="vital-label">{v.label}</span>
                  <span className={`vital-value ${v.cls}`}>{v.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
