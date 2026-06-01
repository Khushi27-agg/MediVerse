import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { prescriptionsAPI, authAPI } from '../api'
import './Prescriptions.css'

const EMPTY_MED = { name: '', dosage: '', duration: '' }

export default function Prescriptions() {
  const { user } = useAuth()
  const isDoctor = user?.role === 'doctor'

  const [prescriptions, setPrescriptions] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [printTarget, setPrintTarget] = useState(null)
  const [form, setForm] = useState({
    patientId: '', medicines: [{ ...EMPTY_MED }], instructions: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const printRef = useRef()

  const load = async () => {
    try {
      setLoading(true)
      const [prescRes] = await Promise.all([
        prescriptionsAPI.getAll(),
        isDoctor ? authAPI.getPatients().then(r => setPatients(r.data)) : Promise.resolve(),
      ])
      setPrescriptions(prescRes.data)
    } catch {
      setError('Failed to load prescriptions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const updateMed = (i, field, value) => {
    const meds = [...form.medicines]
    meds[i] = { ...meds[i], [field]: value }
    setForm({ ...form, medicines: meds })
  }

  const addMed = () => setForm({ ...form, medicines: [...form.medicines, { ...EMPTY_MED }] })
  const removeMed = i => setForm({ ...form, medicines: form.medicines.filter((_, idx) => idx !== i) })

  const handleSubmit = async e => {
    e.preventDefault()
    const validMeds = form.medicines.filter(m => m.name.trim())
    if (!validMeds.length) { setError('Add at least one medicine.'); return }
    setSubmitting(true)
    setError('')
    try {
      const selectedPatient = patients.find(p => p._id === form.patientId)
      await prescriptionsAPI.create({
        ...form,
        patientName: selectedPatient?.name || '',
        medicines: validMeds,
      })
      setShowModal(false)
      setForm({ patientId: '', medicines: [{ ...EMPTY_MED }], instructions: '', date: new Date().toISOString().split('T')[0] })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Delete this prescription?')) return
    try {
      await prescriptionsAPI.delete(id)
      load()
    } catch {
      alert('Failed to delete.')
    }
  }

  const handlePrint = p => {
    setPrintTarget(p)
    setTimeout(() => window.print(), 200)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Prescriptions</h1>
          <p className="page-subtitle">
            {isDoctor ? 'Issue and manage prescriptions' : 'Your prescriptions'}
          </p>
        </div>
        {isDoctor && (
          <button className="btn btn-primary" onClick={() => { setError(''); setShowModal(true) }}>
            + New Prescription
          </button>
        )}
      </div>

      {error && !showModal && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading prescriptions…</div>
      ) : prescriptions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🩺</div>
          <p>No prescriptions yet.</p>
        </div>
      ) : (
        <div className="prescriptions-grid">
          {prescriptions.map(p => (
            <div key={p._id} className="card presc-card">
              <div className="presc-header">
                <div className="presc-header-left">
                  <div className="presc-title">
                    {isDoctor ? `For: ${p.patientName}` : `By: ${p.doctorName}`}
                  </div>
                  <div className="presc-date">📅 {p.date || new Date(p.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="badge badge-blue">{p.medicines.length} medicine{p.medicines.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="medicines-list">
                {p.medicines.map((m, i) => (
                  <div key={i} className="medicine-row">
                    <span className="med-num">{i + 1}</span>
                    <div className="med-detail">
                      <span className="med-name-text">{m.name}</span>
                      <span className="med-meta">
                        {m.dosage && `${m.dosage}`}
                        {m.dosage && m.duration && ' · '}
                        {m.duration && `${m.duration}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {p.instructions && (
                <div className="presc-instructions">
                  <span className="instructions-label">📋 Instructions:</span> {p.instructions}
                </div>
              )}

              <div className="presc-actions">
                <button
                  className="btn btn-outline"
                  style={{ fontSize: 13, flex: 1 }}
                  onClick={() => handlePrint(p)}
                >
                  🖨 Print / Download
                </button>
                {isDoctor && (
                  <button
                    className="btn"
                    style={{ fontSize: 13, padding: '7px 14px', background: '#fee2e2', color: '#991b1b' }}
                    onClick={() => handleDelete(p._id)}
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Prescription</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Patient *</label>
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
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Medicines *</label>
                <div className="medicines-editor">
                  {form.medicines.map((m, i) => (
                    <div key={i} className="med-editor-row">
                      <span className="med-editor-num">{i + 1}</span>
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={m.name}
                        onChange={e => updateMed(i, 'name', e.target.value)}
                        className="med-input med-name"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 500mg)"
                        value={m.dosage}
                        onChange={e => updateMed(i, 'dosage', e.target.value)}
                        className="med-input"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 7 days)"
                        value={m.duration}
                        onChange={e => updateMed(i, 'duration', e.target.value)}
                        className="med-input"
                      />
                      {form.medicines.length > 1 && (
                        <button type="button" className="med-remove" onClick={() => removeMed(i)}>✕</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline" style={{ fontSize: 13, marginTop: 8, alignSelf: 'flex-start' }} onClick={addMed}>
                    + Add Medicine
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Special Instructions</label>
                <textarea
                  placeholder="Take after meals, avoid alcohol, etc."
                  rows={3}
                  value={form.instructions}
                  onChange={e => setForm({ ...form, instructions: e.target.value })}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving…' : 'Issue Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {printTarget && (
        <div className="print-area" ref={printRef}>
          <div className="print-header">
            <div className="print-brand">🏥 MediVerse</div>
            <div className="print-title">Medical Prescription</div>
          </div>
          <div className="print-meta">
            <div><strong>Patient:</strong> {printTarget.patientName}</div>
            <div><strong>Doctor:</strong> {printTarget.doctorName}</div>
            <div><strong>Date:</strong> {printTarget.date || new Date(printTarget.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="print-section-title">Medicines</div>
          <table className="print-table">
            <thead>
              <tr><th>#</th><th>Medicine</th><th>Dosage</th><th>Duration</th></tr>
            </thead>
            <tbody>
              {printTarget.medicines.map((m, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.dosage}</td>
                  <td>{m.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {printTarget.instructions && (
            <>
              <div className="print-section-title">Instructions</div>
              <div className="print-instructions">{printTarget.instructions}</div>
            </>
          )}
          <div className="print-signature">
            <div className="sig-line"></div>
            <div>{printTarget.doctorName}</div>
            <div>Doctor's Signature</div>
          </div>
        </div>
      )}
    </div>
  )
}
