import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { medicalAPI, authAPI } from '../api'
import './MedicalRecords.css'

export default function MedicalRecords() {
  const { user } = useAuth()
  const isDoctor = user?.role === 'doctor'

  const [records, setRecords] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [form, setForm] = useState({ patientId: '', patientName: '', diagnosis: '', notes: '', date: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      const [recRes] = await Promise.all([
        medicalAPI.getAll(),
        isDoctor ? authAPI.getPatients().then(r => setPatients(r.data)) : Promise.resolve(),
      ])
      setRecords(recRes.data)
    } catch {
      setError('Failed to load records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditRecord(null)
    setForm({ patientId: '', patientName: '', diagnosis: '', notes: '', date: new Date().toISOString().split('T')[0] })
    setError('')
    setShowModal(true)
  }

  const openEdit = r => {
    setEditRecord(r)
    setForm({ patientId: r.patientId, patientName: r.patientName, diagnosis: r.diagnosis, notes: r.notes, date: r.date })
    setError('')
    setShowModal(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      if (editRecord) {
        await medicalAPI.update(editRecord._id, { diagnosis: form.diagnosis, notes: form.notes, date: form.date })
      } else {
        const selectedPatient = patients.find(p => p._id === form.patientId)
        await medicalAPI.create({ ...form, patientName: selectedPatient?.name || '' })
      }
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this record?')) return
    try {
      await medicalAPI.delete(id)
      load()
    } catch {
      alert('Failed to delete record.')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Medical Records</h1>
          <p className="page-subtitle">
            {isDoctor ? 'Create and manage patient records' : 'Your medical history'}
          </p>
        </div>
        {isDoctor && (
          <button className="btn btn-primary" onClick={openAdd}>+ Add Record</button>
        )}
      </div>

      {error && !showModal && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading records…</div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>No medical records yet.</p>
        </div>
      ) : (
        <div className="records-list">
          {records.map(r => (
            <div key={r._id} className="card record-item">
              <div className="record-icon">📋</div>
              <div className="record-info">
                <div className="record-type">DIAGNOSIS</div>
                <div className="record-title">{r.diagnosis}</div>
                {r.notes && <div className="record-notes">{r.notes}</div>}
                <div className="record-meta">
                  {isDoctor && <span>🤒 {r.patientName}</span>}
                  {r.doctorName && <span>👨‍⚕️ {r.doctorName}</span>}
                  {r.date && <span>📅 {r.date}</span>}
                </div>
              </div>
              {isDoctor && (
                <div className="record-actions">
                  <button
                    className="btn btn-outline"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                    onClick={() => openEdit(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    style={{ fontSize: 12, padding: '6px 12px', background: '#fee2e2', color: '#991b1b' }}
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editRecord ? 'Edit Record' : 'Add Medical Record'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleSubmit} className="booking-form">
              {!editRecord && (
                <div className="form-group">
                  <label>Patient</label>
                  <select
                    required
                    value={form.patientId}
                    onChange={e => setForm({ ...form, patientId: e.target.value })}
                  >
                    <option value="">Select patient…</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hypertension Stage 1"
                  value={form.diagnosis}
                  onChange={e => setForm({ ...form, diagnosis: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  placeholder="Additional notes, observations…"
                  rows={4}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : editRecord ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
