import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      // Create FormData
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      // Login API
      const response = await axios.post(
        "https://collect-dd4h.onrender.com/auth/login",
        formData
      );

      console.log("LOGIN RESPONSE:", response.data);

      // Save JWT Token
     localStorage.setItem(
  "token",
  response.data.access_token
);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

      // Save User
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful");

      // Redirect
      window.location.href = "/";

    } catch (error) {

      console.log(error);

      alert("Invalid credentials");

    }

  };

  return (

    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleLogin}
      >

        <h1>Login</h1>

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

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  );
}

export default Login;