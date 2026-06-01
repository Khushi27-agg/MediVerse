import { useState } from 'react'
import './Appointments.css'

const appointments = [
  { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'Cardiologist', date: 'Jun 3, 2026', time: '10:00 AM', status: 'confirmed', avatar: 'PS', reason: 'Routine checkup' },
  { id: 2, doctor: 'Dr. Arjun Mehta', specialty: 'Dermatologist', date: 'Jun 7, 2026', time: '2:30 PM', status: 'confirmed', avatar: 'AM', reason: 'Skin consultation' },
  { id: 3, doctor: 'Dr. Sneha Patel', specialty: 'Neurologist', date: 'May 20, 2026', time: '11:00 AM', status: 'completed', avatar: 'SP', reason: 'Headache evaluation' },
  { id: 4, doctor: 'Dr. Rahul Gupta', specialty: 'Orthopedist', date: 'May 10, 2026', time: '9:00 AM', status: 'completed', avatar: 'RG', reason: 'Knee pain' },
  { id: 5, doctor: 'Dr. Anita Rao', specialty: 'Gynecologist', date: 'Apr 5, 2026', time: '3:00 PM', status: 'cancelled', avatar: 'AR', reason: 'Annual exam' },
]

const doctors = [
  'Dr. Priya Sharma - Cardiologist',
  'Dr. Arjun Mehta - Dermatologist',
  'Dr. Sneha Patel - Neurologist',
  'Dr. Rahul Gupta - Orthopedist',
  'Dr. Anita Rao - Gynecologist',
  'Dr. Vikram Nair - Gastroenterologist',
]

const statusBadge = {
  confirmed: 'badge-blue',
  completed: 'badge-green',
  cancelled: 'badge-red',
}

export default function Appointments() {
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ doctor: '', date: '', time: '', reason: '' })

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  const handleBook = (e) => {
    e.preventDefault()
    setShowModal(false)
    setForm({ doctor: '', date: '', time: '', reason: '' })
    alert('Appointment booked successfully!')
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Manage your medical appointments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Book Appointment
        </button>
      </div>

      <div className="filter-tabs">
        {['all', 'confirmed', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="appts-grid">
        {filtered.map(a => (
          <div key={a.id} className="card appt-card">
            <div className="appt-card-header">
              <div className="appt-avatar-lg">{a.avatar}</div>
              <div className="appt-main">
                <div className="appt-doc-name">{a.doctor}</div>
                <div className="appt-specialty-tag">{a.specialty}</div>
              </div>
              <span className={`badge ${statusBadge[a.status]}`}>
                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </span>
            </div>
            <div className="appt-details">
              <div className="detail-row">
                <span>📅</span>
                <span>{a.date} at {a.time}</span>
              </div>
              <div className="detail-row">
                <span>📝</span>
                <span>{a.reason}</span>
              </div>
            </div>
            {a.status === 'confirmed' && (
              <div className="appt-actions">
                <button className="btn btn-outline" style={{ fontSize: 13, padding: '7px 14px' }}>Reschedule</button>
                <button className="btn" style={{ fontSize: 13, padding: '7px 14px', background: '#fee2e2', color: '#991b1b' }}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book an Appointment</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleBook} className="booking-form">
              <div className="form-group">
                <label>Select Doctor</label>
                <select required value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})}>
                  <option value="">Choose a doctor...</option>
                  {doctors.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" required value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Reason for Visit</label>
                <textarea
                  placeholder="Describe your symptoms or reason..."
                  value={form.reason}
                  onChange={e => setForm({...form, reason: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
