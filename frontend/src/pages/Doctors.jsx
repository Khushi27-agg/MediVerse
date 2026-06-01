import { useState } from 'react'
import './Doctors.css'

const doctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialty: 'Cardiologist', experience: '12 years', rating: 4.9, reviews: 234, available: true, avatar: 'PS', location: 'Mumbai', fee: 800 },
  { id: 2, name: 'Dr. Arjun Mehta', specialty: 'Dermatologist', experience: '8 years', rating: 4.7, reviews: 189, available: true, avatar: 'AM', location: 'Delhi', fee: 600 },
  { id: 3, name: 'Dr. Sneha Patel', specialty: 'Neurologist', experience: '15 years', rating: 4.8, reviews: 312, available: false, avatar: 'SP', location: 'Bangalore', fee: 1000 },
  { id: 4, name: 'Dr. Rahul Gupta', specialty: 'Orthopedist', experience: '10 years', rating: 4.6, reviews: 156, available: true, avatar: 'RG', location: 'Chennai', fee: 700 },
  { id: 5, name: 'Dr. Anita Rao', specialty: 'Gynecologist', experience: '18 years', rating: 4.9, reviews: 428, available: true, avatar: 'AR', location: 'Hyderabad', fee: 900 },
  { id: 6, name: 'Dr. Vikram Nair', specialty: 'Gastroenterologist', experience: '11 years', rating: 4.7, reviews: 198, available: false, avatar: 'VN', location: 'Pune', fee: 750 },
  { id: 7, name: 'Dr. Kavya Singh', specialty: 'Pediatrician', experience: '9 years', rating: 4.8, reviews: 267, available: true, avatar: 'KS', location: 'Mumbai', fee: 650 },
  { id: 8, name: 'Dr. Rohan Joshi', specialty: 'Psychiatrist', experience: '14 years', rating: 4.5, reviews: 143, available: true, avatar: 'RJ', location: 'Delhi', fee: 850 },
]

const specialties = ['All', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedist', 'Gynecologist', 'Gastroenterologist', 'Pediatrician', 'Psychiatrist']

function StarRating({ rating }) {
  return (
    <span className="star-rating">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span className="rating-val">{rating}</span>
    </span>
  )
}

export default function Doctors() {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [availableOnly, setAvailableOnly] = useState(false)

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
    const matchSpec = specialty === 'All' || d.specialty === specialty
    const matchAvail = !availableOnly || d.available
    return matchSearch && matchSpec && matchAvail
  })

  return (
    <div className="page">
      <h1 className="page-title">Find Doctors</h1>
      <p className="page-subtitle">Search and connect with top specialists</p>

      <div className="doctor-filters card">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search doctors by name or specialty..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-row">
          <div className="specialty-chips">
            {specialties.map(s => (
              <button
                key={s}
                className={`chip ${specialty === s ? 'active' : ''}`}
                onClick={() => setSpecialty(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <label className="avail-toggle">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={e => setAvailableOnly(e.target.checked)}
            />
            Available only
          </label>
        </div>
      </div>

      <div className="results-count">{filtered.length} doctors found</div>

      <div className="doctors-grid">
        {filtered.map(d => (
          <div key={d.id} className="card doctor-card">
            <div className="doctor-header">
              <div className="doctor-avatar">{d.avatar}</div>
              <div className="doctor-info">
                <div className="doctor-name">{d.name}</div>
                <div className="doctor-spec">{d.specialty}</div>
                <StarRating rating={d.rating} />
              </div>
              <span className={`avail-badge ${d.available ? 'avail' : 'unavail'}`}>
                {d.available ? '● Available' : '○ Busy'}
              </span>
            </div>
            <div className="doctor-meta">
              <span className="meta-item">🎓 {d.experience}</span>
              <span className="meta-item">📍 {d.location}</span>
              <span className="meta-item">💬 {d.reviews} reviews</span>
              <span className="meta-item">💵 ₹{d.fee}/visit</span>
            </div>
            <div className="doctor-actions">
              <button className="btn btn-outline" style={{ flex: 1, fontSize: 13 }}>View Profile</button>
              <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} disabled={!d.available}>
                {d.available ? 'Book Now' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
