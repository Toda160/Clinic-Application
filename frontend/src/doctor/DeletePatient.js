import React, { useState } from "react";
import "./DeletePatient.css"; // Importă fișierul CSS

const DeletePatient = ({ token }) => {
  const [username, setUsername] = useState("");

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/doctor/delete-patient/${username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Patient deleted successfully!");
        setUsername(""); // Resetează câmpul de input
      } else {
        const errorMessage = await response.text();
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="delete-patient-container">
      <h1 className="delete-patient-title">Delete Patient</h1>
      <form onSubmit={handleDelete} className="delete-patient-form">
        <div>
          <input
            type="text"
            name="username"
            placeholder="Enter patient's username"
            value={username}
            onChange={handleInputChange}
            required
            className="delete-patient-input"
          />
        </div>
        <button type="submit" className="delete-patient-button">
          Delete Patient
        </button>
      </form>
    </div>
  );
};

export default DeletePatient;
