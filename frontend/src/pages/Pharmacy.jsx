import { useState } from 'react'
import './Pharmacy.css'

const medicines = [
  { id: 1, name: 'Amlodipine 5mg', category: 'Cardiovascular', price: 120, stock: true, desc: 'Calcium channel blocker for blood pressure' },
  { id: 2, name: 'Metformin 500mg', category: 'Diabetes', price: 85, stock: true, desc: 'Oral diabetes medication' },
  { id: 3, name: 'Atorvastatin 10mg', category: 'Cardiovascular', price: 210, stock: true, desc: 'Cholesterol-lowering medication' },
  { id: 4, name: 'Paracetamol 650mg', category: 'Pain Relief', price: 45, stock: true, desc: 'Fever and pain relief' },
  { id: 5, name: 'Omeprazole 20mg', category: 'Gastrointestinal', price: 95, stock: false, desc: 'Acid reflux and ulcer treatment' },
  { id: 6, name: 'Cetirizine 10mg', category: 'Allergy', price: 60, stock: true, desc: 'Antihistamine for allergies' },
  { id: 7, name: 'Vitamin D3 1000IU', category: 'Supplements', price: 180, stock: true, desc: 'Bone health and immunity' },
  { id: 8, name: 'Azithromycin 500mg', category: 'Antibiotics', price: 155, stock: false, desc: 'Antibiotic for bacterial infections' },
]

const activePrescriptions = [
  { name: 'Amlodipine 5mg', dose: '1 tablet daily', refills: 2, expires: 'Aug 2026' },
  { name: 'Vitamin D3 1000IU', dose: '1 capsule daily', refills: 1, expires: 'Jul 2026' },
]

const categories = ['All', 'Cardiovascular', 'Diabetes', 'Pain Relief', 'Gastrointestinal', 'Allergy', 'Supplements', 'Antibiotics']

export default function Pharmacy() {
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [showCart, setShowCart] = useState(false)

  const filtered = medicines.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || m.category === category
    return matchSearch && matchCat
  })

  const addToCart = (med) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === med.id)
      if (exists) return prev.map(i => i.id === med.id ? {...i, qty: i.qty + 1} : i)
      return [...prev, {...med, qty: 1}]
    })
  }

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <div className="page">
      <div className="pharmacy-header">
        <div>
          <h1 className="page-title">Pharmacy</h1>
          <p className="page-subtitle">Order medicines and manage prescriptions</p>
        </div>
        <button className="btn btn-primary cart-btn" onClick={() => setShowCart(true)}>
          🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>

      <div className="card prescriptions-banner">
        <div className="prescriptions-title">📄 Active Prescriptions</div>
        <div className="prescriptions-list">
          {activePrescriptions.map(p => (
            <div key={p.name} className="prescription-item">
              <div>
                <div className="presc-name">{p.name}</div>
                <div className="presc-dose">{p.dose}</div>
              </div>
              <div className="presc-meta">
                <span className="badge badge-blue">{p.refills} refills left</span>
                <span className="presc-exp">Expires {p.expires}</span>
              </div>
              <button className="btn btn-success" style={{ fontSize: 13, padding: '7px 14px' }}>
                Refill
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pharma-filters">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search medicines..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="specialty-chips">
          {categories.map(c => (
            <button
              key={c}
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="medicines-grid">
        {filtered.map(m => (
          <div key={m.id} className="card medicine-card">
            <div className="med-top">
              <div>
                <div className="med-name">{m.name}</div>
                <div className="med-category">{m.category}</div>
                <div className="med-desc">{m.desc}</div>
              </div>
              <span className={`badge ${m.stock ? 'badge-green' : 'badge-red'}`}>
                {m.stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="med-bottom">
              <span className="med-price">₹{m.price}</span>
              <button
                className="btn btn-primary"
                style={{ fontSize: 13, padding: '8px 16px' }}
                disabled={!m.stock}
                onClick={() => addToCart(m)}
              >
                {m.stock ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛒 Your Cart</h2>
              <button className="modal-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">₹{item.price} × {item.qty}</div>
                      </div>
                      <div className="cart-item-total">₹{item.price * item.qty}</div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Total</span>
                  <span className="total-amount">₹{total}</span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}
                  onClick={() => { alert('Order placed successfully!'); setCart([]); setShowCart(false) }}>
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
