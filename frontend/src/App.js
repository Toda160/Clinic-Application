import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./pages/header/Header";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import AddPatient from "./doctor/AddPatient";
import DeletePatient from "./doctor/DeletePatient";
import NoMatch from "./pages/noMatch/noMatch";
import PostUser from "./pages/login/PostUser";
import ShowPrescription from "./patient/ShowPrescription";
import AddAppointment from "./patient/AddAppointment";
import DoctorAppointments from "./doctor/DoctorAppointments"; // Vizualizare programări pentru doctor
import ReviewDoctor from "./patient/ReviewDoctor"; // Import componenta ReviewDoctor
import Home from "./Home"; // Import componenta Home
import "./pages/header/Header.css";
import "./Home.css"; // Import stilurile Home.css
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 800, // Durata animațiilor
  easing: "ease-in-out", // Tipul de animație
  once: true, // Rulează animația o singură dată
});

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null); // Utilizator logat
  const [token, setToken] = useState(null); // Token-ul JWT

  const handleLogin = (userData) => {
    console.log("UserData received:", userData);
    if (userData && userData.token) {
      setLoggedInUser(userData);
      setToken(userData.token);
      localStorage.setItem("token", userData.token); // Salvează token-ul
    } else {
      console.error("Token missing in userData:", userData);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null); // Resetează utilizatorul logat
    setToken(null); // Șterge token-ul
    localStorage.removeItem("token"); // Șterge token-ul din localStorage
    window.location.href = "/login"; // Redirecționează către pagina de login
  };

  const ProtectedRoute = ({ role, children }) => {
    if (!loggedInUser || loggedInUser.role !== role) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <>
      <Header loggedInUser={loggedInUser} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          {/* Ruta pentru pagina principală */}
          <Route path="/" element={<Home />} />

          {/* Rutele generale */}
          <Route
            path="/dashboard"
            element={loggedInUser ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              loggedInUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
            }
          />
          <Route path="/register" element={<PostUser />} />

          {/* Rutele pentru doctor */}
          <Route
            path="/doctor/add-patient"
            element={
              <ProtectedRoute role="DOCTOR">
                <AddPatient token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/delete-patient"
            element={
              <ProtectedRoute role="DOCTOR">
                <DeletePatient token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute role="DOCTOR">
                <DoctorAppointments token={token} loggedInUser={loggedInUser} />
              </ProtectedRoute>
            }
          />

          {/* Rutele pentru pacient */}
          <Route
            path="/patient/show-prescription"
            element={
              <ProtectedRoute role="PATIENT">
                <ShowPrescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/add-appointment"
            element={
              <ProtectedRoute role="PATIENT">
                <AddAppointment token={token} patient={loggedInUser?.username} />
              </ProtectedRoute>
            }
          />
<Route
  path="/patient/review-doctor"
  element={
    <ProtectedRoute role="PATIENT">
      <ReviewDoctor token={token} loggedInUser={loggedInUser} />
    </ProtectedRoute>
  }
/>


          {/* Rutele pentru pagini inexistente */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
