import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Appointments from './pages/Appointments'
import Doctors from './pages/Doctors'
import MedicalRecords from './pages/MedicalRecords'
import Pharmacy from './pages/Pharmacy'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="records" element={<MedicalRecords />} />
          <Route path="pharmacy" element={<Pharmacy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
