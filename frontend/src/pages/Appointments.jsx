import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { appointmentsAPI } from '../api'
import './Appointments.css'

const STATUS_COLORS = {
  Pending: 'badge-yellow',
  Approved: 'badge-green',
  Cancelled: 'badge-red',
  Completed: 'badge-blue',
}

const DOCTORS = [
  'Dr. Priya Sharma - Cardiologist',
  'Dr. Arjun Mehta - Dermatologist',
  'Dr. Sneha Patel - Neurologist',
  'Dr. Rahul Gupta - Orthopedist',
  'Dr. Anita Rao - Gynecologist',
  'Dr. Vikram Nair - Gastroenterologist',
]

const STATUS_OPTIONS = ['Pending', 'Approved', 'Cancelled', 'Completed']

export default function Appointments() {
  const { user } = useAuth()
  const isDoctor = user?.role === 'doctor'

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ doctorName: '', date: '', time: '', reason: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      const res = await appointmentsAPI.getAll()
      setAppointments(res.data)
    } catch {
      setError('Failed to load appointments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter(a => a.status === filter)

  const handleBook = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await appointmentsAPI.create(form)
      setShowModal(false)
      setForm({ doctorName: '', date: '', time: '', reason: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await appointmentsAPI.updateStatus(id, status)
      load()
    } catch {
      alert('Failed to update status.')
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this appointment?')) return
    try {
      await appointmentsAPI.delete(id)
      load()
    } catch {
      alert('Failed to delete appointment.')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">
            {isDoctor ? 'Manage all patient appointments' : 'Your scheduled appointments'}
          </p>
        </div>
        {!isDoctor && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Book Appointment
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="filter-tabs">
        {['all', 'Pending', 'Approved', 'Completed', 'Cancelled'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">Loading appointments…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <p>No appointments found.</p>
          {!isDoctor && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: 12 }}>
              Book your first appointment
            </button>
          )}
        </div>
      ) : (
        <div className="appts-grid">
          {filtered.map(a => (
            <div key={a._id} className="card appt-card">
              <div className="appt-card-header">
                <div className="appt-avatar-lg">
                  {(isDoctor ? a.patientName : a.doctorName || 'Dr')
                    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="appt-main">
                  <div className="appt-doc-name">
                    {isDoctor ? a.patientName : (a.doctorName || 'Doctor TBD')}
                  </div>
                  <div className="appt-specialty-tag">
                    {isDoctor ? 'Patient' : a.doctorName?.split('-')[1]?.trim() || ''}
                  </div>
                </div>
                <span className={`badge ${STATUS_COLORS[a.status]}`}>{a.status}</span>
              </div>

              <div className="appt-details">
                <div className="detail-row"><span>📅</span><span>{a.date}{a.time ? ` at ${a.time}` : ''}</span></div>
                {a.reason && <div className="detail-row"><span>📝</span><span>{a.reason}</span></div>}
              </div>

              <div className="appt-actions">
                {isDoctor && a.status === 'Pending' && (
                  <>
                    <button
                      className="btn btn-success"
                      style={{ fontSize: 13, padding: '7px 14px', flex: 1 }}
                      onClick={() => handleStatusChange(a._id, 'Approved')}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="btn"
                      style={{ fontSize: 13, padding: '7px 14px', background: '#fee2e2', color: '#991b1b', flex: 1 }}
                      onClick={() => handleStatusChange(a._id, 'Cancelled')}
                    >
                      ✕ Cancel
                    </button>
                  </>
                )}
                {isDoctor && a.status === 'Approved' && (
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: 13, padding: '7px 14px', flex: 1 }}
                    onClick={() => handleStatusChange(a._id, 'Completed')}
                  >
                    Mark Completed
                  </button>
                )}
                {isDoctor && (
                  <button
                    className="btn"
                    style={{ fontSize: 13, padding: '7px 14px', background: '#fee2e2', color: '#991b1b' }}
                    onClick={() => handleDelete(a._id)}
                    title="Delete"
                  >
                    🗑
                  </button>
                )}
                {!isDoctor && a.status === 'Pending' && (
                  <button
                    className="btn"
                    style={{ fontSize: 13, padding: '7px 14px', background: '#fee2e2', color: '#991b1b' }}
                    onClick={() => handleDelete(a._id)}
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book an Appointment</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleBook} className="booking-form">
              <div className="form-group">
                <label>Select Doctor</label>
                <select
                  required
                  value={form.doctorName}
                  onChange={e => setForm({ ...form, doctorName: e.target.value })}
                >
                  <option value="">Choose a doctor…</option>
                  {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason for Visit</label>
                <textarea
                  placeholder="Describe your symptoms or reason…"
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Booking…' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
