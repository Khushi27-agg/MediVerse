import { useState } from 'react'
import './MedicalRecords.css'

const records = [
  { id: 1, type: 'Lab Report', title: 'Complete Blood Count (CBC)', date: 'May 15, 2026', doctor: 'Dr. Priya Sharma', status: 'Normal', category: 'lab' },
  { id: 2, type: 'Prescription', title: 'Hypertension Medication', date: 'May 10, 2026', doctor: 'Dr. Arjun Mehta', status: 'Active', category: 'prescription' },
  { id: 3, type: 'Radiology', title: 'Chest X-Ray', date: 'Apr 28, 2026', doctor: 'Dr. Sneha Patel', status: 'Clear', category: 'imaging' },
  { id: 4, type: 'Lab Report', title: 'Lipid Panel', date: 'Apr 20, 2026', doctor: 'Dr. Priya Sharma', status: 'Borderline', category: 'lab' },
  { id: 5, type: 'Prescription', title: 'Vitamin D3 Supplement', date: 'Apr 5, 2026', doctor: 'Dr. Rahul Gupta', status: 'Completed', category: 'prescription' },
  { id: 6, type: 'Vaccination', title: 'COVID-19 Booster', date: 'Mar 12, 2026', doctor: 'General Clinic', status: 'Done', category: 'vaccine' },
  { id: 7, type: 'Radiology', title: 'MRI Brain Scan', date: 'Feb 20, 2026', doctor: 'Dr. Sneha Patel', status: 'Normal', category: 'imaging' },
  { id: 8, type: 'Lab Report', title: 'Thyroid Function Test', date: 'Jan 15, 2026', doctor: 'Dr. Anita Rao', status: 'Abnormal', category: 'lab' },
]

const allergies = ['Penicillin', 'Sulfa drugs', 'Pollen (seasonal)']
const conditions = ['Hypertension (managed)', 'Mild Vitamin D deficiency']
const bloodInfo = { group: 'B+', pressure: '120/80', sugar: '108 mg/dL', weight: '65 kg', height: '165 cm' }

const catIcons = { lab: '🧪', prescription: '📄', imaging: '🔬', vaccine: '💉' }
const statusColors = {
  Normal: 'badge-green', Active: 'badge-blue', Clear: 'badge-green',
  Borderline: 'badge-yellow', Completed: 'badge-green', Done: 'badge-green', Abnormal: 'badge-red'
}

export default function MedicalRecords() {
  const [category, setCategory] = useState('all')

  const filtered = category === 'all' ? records : records.filter(r => r.category === category)

  return (
    <div className="page">
      <h1 className="page-title">Medical Records</h1>
      <p className="page-subtitle">Your complete health history in one place</p>

      <div className="records-layout">
        <div className="records-main">
          <div className="cat-filters">
            {[['all','All Records','📋'], ['lab','Lab Reports','🧪'], ['prescription','Prescriptions','📄'], ['imaging','Imaging','🔬'], ['vaccine','Vaccines','💉']].map(([val, label, icon]) => (
              <button
                key={val}
                className={`cat-btn ${category === val ? 'active' : ''}`}
                onClick={() => setCategory(val)}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <div className="records-list">
            {filtered.map(r => (
              <div key={r.id} className="card record-item">
                <div className="record-icon">{catIcons[r.category]}</div>
                <div className="record-info">
                  <div className="record-type">{r.type}</div>
                  <div className="record-title">{r.title}</div>
                  <div className="record-meta">
                    <span>📅 {r.date}</span>
                    <span>👨‍⚕️ {r.doctor}</span>
                  </div>
                </div>
                <div className="record-right">
                  <span className={`badge ${statusColors[r.status]}`}>{r.status}</span>
                  <button className="btn btn-outline" style={{ fontSize: 12, padding: '6px 12px', marginTop: 8 }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="records-side">
          <div className="card health-profile">
            <h3 className="side-title">🩸 Health Profile</h3>
            <div className="health-profile-grid">
              {Object.entries(bloodInfo).map(([key, val]) => (
                <div key={key} className="hp-item">
                  <div className="hp-label">{key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</div>
                  <div className="hp-value">{val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card allergies-card">
            <h3 className="side-title">⚠️ Allergies</h3>
            <div className="tag-list">
              {allergies.map(a => (
                <span key={a} className="badge badge-red">{a}</span>
              ))}
            </div>
          </div>

          <div className="card conditions-card">
            <h3 className="side-title">🏥 Existing Conditions</h3>
            <div className="tag-list">
              {conditions.map(c => (
                <span key={c} className="badge badge-yellow">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
