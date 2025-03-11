import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const AddPatient = ({ token }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  // Dacă componenta primește token ca props, îl folosește;
  // altfel încearcă să citească din localStorage
  const jwtToken = token || localStorage.getItem("token");

  console.log("Token received in AddPatient:", jwtToken);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/doctor/add-patient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Patient added successfully!");
        setFormData({
          username: "",
          password: "",
          firstname: "",
          lastname: "",
          phone: "",
        });
      } else {
        const errorMessage = await response.text();
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="center-form">
      <h1>Add Patient</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicFirstname">
          <Form.Control
            type="text"
            name="firstname"
            placeholder="Enter first name"
            value={formData.firstname}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicLastname">
          <Form.Control
            type="text"
            name="lastname"
            placeholder="Enter last name"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPhone">
          <Form.Control
            type="text"
            name="phone"
            placeholder="Enter phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Add Patient
        </Button>
      </Form>
    </div>
  );
};

export default AddPatient;
