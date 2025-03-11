import React, { useEffect, useState } from "react";

const DoctorAppointments = ({ token, loggedInUser }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("ASC"); // "ASC" sau "DESC"

  // Funcție pentru a extrage username-ul din email
  const getUsernameFromEmail = (email) => email.split("@")[0];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/appointments/doctor/${loggedInUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
          setFilteredAppointments(data); // inițial, toate programările
        } else {
          console.error("Failed to fetch doctor appointments");
        }
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      }
    };

    fetchAppointments();
  }, [loggedInUser.id, token]);

  // Funcție pentru ștergerea unei programări
  const deleteAppointment = async (appointmentId) => {
    const url = `http://localhost:8080/api/doctor/${loggedInUser.id}/appointments/${appointmentId}`;
    console.log("Authorization Header: Bearer", token);
  
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log("Appointment deleted successfully");
  
        // Actualizează lista de programări eliminând programarea ștearsă
        setAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== appointmentId)
        );
        setFilteredAppointments((prev) =>
          prev.filter((appointment) => appointment.id !== appointmentId)
        );
      } else {
        console.error("Failed to delete appointment:", response.status);
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };
  
  

  // Când userul scrie în căsuța de search, filtrăm local după numele pacientului
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = appointments.filter((apt) =>
      apt.patientName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAppointments(filtered);
  };

  // Când userul apasă pe butonul de sortare, inversăm ordinea (ASC/DESC)
  const handleSortByDate = () => {
    const sorted = [...filteredAppointments].sort((a, b) => {
      // Comparăm dateTime sub formă de Date
      const dateA = new Date(a.dateTime);
      const dateB = new Date(b.dateTime);
      if (sortOrder === "ASC") {
        return dateA - dateB; // ordonare crescătoare
      } else {
        return dateB - dateA; // ordonare descrescătoare
      }
    });

    // Toggling sort order
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    setFilteredAppointments(sorted);
  };

  return (
    <div className="container mt-4">
      {/* Afișăm doar username-ul doctorului */}
      <h1 className="text-center">
        Programări pentru Dr. {getUsernameFromEmail(loggedInUser.username)}
      </h1>

      {/* Căsuță de căutare și buton de sortare */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <input
          type="text"
          placeholder="Caută după pacient..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-control w-25"
        />
        <button className="btn btn-secondary" onClick={handleSortByDate}>
          Sortează după dată ({sortOrder})
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="text-muted text-center mt-4">
          Nu există programări care să corespundă criteriilor.
        </p>
      ) : (
        <table className="table table-striped table-hover mt-3">
          <thead className="thead-dark">
            <tr>
              <th>Pacient</th>
              <th>Descriere</th>
              <th>Data și Ora</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.description}</td>
                <td>
                  {new Date(appointment.dateTime).toLocaleString("ro-RO", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteAppointment(appointment.id)}
                  >
                    Șterge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorAppointments;
