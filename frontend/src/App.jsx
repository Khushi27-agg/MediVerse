import VideoCall from "./pages/VideoCall";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";
import Pharmacy from "./pages/Pharmacy";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="records" element={<MedicalRecords />} />
            <Route path="video-call" element={<VideoCall />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="pharmacy" element={<Pharmacy />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
