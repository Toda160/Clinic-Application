import React, { useState } from "react";
import "./ReviewDoctor.css";

const ReviewDoctor = ({ token, loggedInUser }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verifică dacă loggedInUser și token sunt disponibile
    if (!loggedInUser || !token) {
      setErrorMessage("Utilizatorul nu este autentificat.");
      return;
    }

    const patientId = loggedInUser.id;

    fetch(`http://localhost:8080/api/patient/${patientId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Token-ul JWT pentru autentificare
      },
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        rating: parseInt(rating, 10), // Asigură-te că rating-ul este număr
        comment: comment,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage("Recenzia a fost adăugată cu succes!");
          setFirstname("");
          setLastname("");
          setRating(0);
          setComment("");
          setErrorMessage("");
        } else {
          response.text().then((text) => {
            setErrorMessage(`Eroare: ${text}`);
          });
        }
      })
      .catch((error) => {
        console.error("Eroare la adăugarea recenziei:", error);
        setErrorMessage("A apărut o eroare. Te rugăm să încerci mai târziu.");
      });
  };

  return (
    <div className="review-doctor-container">
      <h2>Evaluează un Doctor</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nume Doctor:
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Prenume Doctor:
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Rating (1-5):
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Comentariu:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </label>
        <br />
        <button type="submit">Trimite Recenzia</button>
      </form>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default ReviewDoctor;
