import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send data as application/x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append("username", name);
      formData.append("email", email);
      formData.append("password", password);

      await API.post("/auth/register", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      alert("Registration Successful! Please log in.");
      window.location.href = "/login";
    } catch (err) {
      let message = "Registration failed. Please try again.";

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;

        if (typeof detail === "string") {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail.map((item) => item.msg).join(", ");
        } else {
          message = JSON.stringify(detail);
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h1>Register</h1>

        {error && (
          <p
            style={{
              color: "#e03333",
              fontSize: "14px",
              margin: "10px 0",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;