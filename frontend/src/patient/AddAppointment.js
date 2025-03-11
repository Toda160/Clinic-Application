import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { format } from "date-fns";
import "./AddAppointment.css";

const AddAppointment = ({ token, patient }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  // const [availableTimes, setAvailableTimes] = useState([]);
  const [busySlots, setBusySlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    time: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const generateTimes = () => {
    const times = [];
    let startTime = new Date();
    startTime.setHours(8, 0, 0, 0);
    while (startTime.getHours() < 14) {
      times.push(new Date(startTime));
      startTime.setMinutes(startTime.getMinutes() + 40);
    }
    return times;
  };

  const fetchBusySlots = useCallback(async (doctorId, date) => {
    try {
      const url = `http://localhost:8080/api/appointments/doctor/${doctorId}/busy-slots?date=${date}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBusySlots(data.map((slot) => new Date(slot)));
      } else {
        console.error("Failed to fetch busy slots with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching busy slots:", error);
    }
  }, [token]);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/appointments/patient/${patient}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Failed to fetch patient appointments with status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching patient appointments:", error);
    }
  }, [patient, token]);

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token, fetchAppointments]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/appointments/doctors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          console.error("Failed to fetch doctors with status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    if (token) {
      fetchDoctors();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !formData.time || !selectedDoctorId) {
      alert("Please select a doctor, date, and time.");
      return;
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const appointmentRequest = {
      doctorId: selectedDoctorId,
      description: formData.description,
      dateTime: `${dateStr}T${formData.time}:00.000Z`,
      patientUsername: patient,
    };

    try {
      const response = await fetch("http://localhost:8080/api/appointments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentRequest),
      });

      if (response.ok) {
        alert("Appointment added successfully!");
        setFormData({ description: "", time: "" });
        fetchAppointments();
        fetchBusySlots(selectedDoctorId, dateStr);
      } else if (response.status === 409) {
        alert("This time slot is already booked. Please choose another time.");
      } else {
        const errorText = await response.text();
        alert("Failed to add appointment: " + errorText);
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="add-appointment-page">
      <div className="add-appointment-container">
        <div className="add-appointment-form">
          <h2>Add Appointment</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="doctorSelect">
              <Form.Label>Select Doctor</Form.Label>
              <Form.Control
                as="select"
                value={selectedDoctorId || ""}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                required
              >
                <option value="">-- Choose a doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.firstname} {doc.lastname}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="formDate" className="mt-3">
              <Form.Label>Select Date</Form.Label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select a date"
                className="form-control"
                required
              />
            </Form.Group>

            <Form.Group controlId="formTime" className="mt-3">
              <Form.Label>Select Time</Form.Label>
              <Form.Control
                as="select"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              >
                <option value="">-- Choose a time --</option>
                {generateTimes().map((time) => {
                  const timeStr = format(time, "HH:mm");
                  const isBusy = busySlots.some((busy) => format(busy, "HH:mm") === timeStr);
                  return (
                    <option key={time.getTime()} value={timeStr} disabled={isBusy}>
                      {timeStr} {isBusy ? "(Unavailable)" : ""}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Add Appointment
            </Button>
          </Form>
        </div>

        <div className="appointments-list">
  <h2>My Active Appointments</h2>
  {appointments.length === 0 ? (
    <p>No active appointments</p>
  ) : (
    <ul>
      {appointments.map((appointment) => (
        <li key={appointment.id}>
          <p>
            <strong>Doctor:</strong> {appointment.doctorName}
          </p>
          <p>
            <strong>Date:</strong> {format(new Date(appointment.dateTime), "yyyy-MM-dd")}
          </p>
          <p>
            <strong>Time:</strong> {format(new Date(appointment.dateTime), "HH:mm")}
          </p>
          <p>
            <strong>Description:</strong> {appointment.description}
          </p>
        </li>
      ))}
    </ul>
  )}
</div>

      </div>
    </div>
  );
};

export default AddAppointment;
