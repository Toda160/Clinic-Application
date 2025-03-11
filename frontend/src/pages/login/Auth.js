import React, { useState } from "react";
import Login from "./Login";
import PostUser from "./PostUser";

const Auth = () => {
  const [showRegister, setShowRegister] = useState(false); // False = Login

  return (
    <div>
      {showRegister ? (
        <PostUser /> // Formularul de înregistrare
      ) : (
        <Login /> // Formularul de autentificare
      )}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {showRegister ? (
          <button onClick={() => setShowRegister(false)}>Go to Login</button>
        ) : (
          <button onClick={() => setShowRegister(true)}>Go to Register</button>
        )}
      </div>
    </div>
  );
};

export default Auth;
