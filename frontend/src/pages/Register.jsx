import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();
      formData.append("username", name);
      formData.append("email", email);
      formData.append("password", password);

      await axios.post(
        "https://collect-dd4h.onrender.com/auth/register",
        formData
      );

      alert("Registration Successful");

      window.location.href = "/login";

    } catch (error) {

      alert("Registration Failed");

    }

  };

  return (
    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleRegister}
      >

        <h1>Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Register
        </button>

      </form>

    </div>
  );
}

export default Register;