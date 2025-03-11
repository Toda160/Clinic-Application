import "./PostUser.css";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const PostUser = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    role: "",
    phone: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form data being sent to backend:", formData); // Adaugă acest log
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("User registered successfully!");
        setFormData({
          firstname: "",
          lastname: "",
          username: "",
          password: "",
          role: "",
          phone: "",
        });
      } else {
        const errorMessage = await response.text();
        alert("Error: " + errorMessage);
      }
    } catch (error) {
      console.error("Error registering user:", error); // Log detaliat al erorii
      alert("An error occurred. Please try again.");
    }
  };
  
  return (
    <>
      <div className="center-form">
        <h1>User form</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicFirstName">
            <Form.Control
              type="text"
              name="firstname" // Actualizat să corespundă cheii din formData
              placeholder="Enter first name"
              value={formData.firstname}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicLastName">
            <Form.Control
              type="text"
              name="lastname" // Actualizat să corespundă cheii din formData
              placeholder="Enter last name"
              value={formData.lastname}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="email"
              name="username" // Actualizat să corespundă cheii din formData
              placeholder="Enter email"
              value={formData.username}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control
              type="password"
              name="password" // Actualizat să corespundă cheii din formData
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicRole">
  <Form.Label>Role</Form.Label>
  <Form.Control
    as="select" // Schimbăm input-ul în select
    name="role"
    value={formData.role}
    onChange={handleInputChange}
    required
  >
    <option value="">Select role</option>
    <option value="DOCTOR">Doctor</option>
    <option value="PATIENT">Patient</option>
    <option value="ASSISTANT">Assistant</option>
  </Form.Control>
</Form.Group>


          <Form.Group controlId="formBasicPhone">
            <Form.Control
              type="text"
              name="phone" // Actualizat să corespundă cheii din formData
              placeholder="Enter phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default PostUser;
