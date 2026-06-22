import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://127.0.0.1:8000/profile/",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setEmail(response.data.email);

    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.put(
          "http://127.0.0.1:8000/profile/",
          {
            email
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      alert(response.data.message);

    } catch (error) {

      console.log(error);

      alert("Update Failed");
    }
  };

  const changePassword = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.put(
          "http://127.0.0.1:8000/profile/change-password",
          {
            old_password: oldPassword,
            new_password: newPassword
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      alert(response.data.message);

      setOldPassword("");
      setNewPassword("");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.detail ||
        "Password Change Failed"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {

    localStorage.removeItem("token");

    alert("Logged Out Successfully");

    navigate("/login");
  };

  return (
    <div className="profile-page">

      <h1>My Profile</h1>

      <div className="profile-card">

        <h3>Email</h3>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button
          onClick={updateProfile}
        >
          Update Profile
        </button>

      </div>

      <div className="profile-card">

        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) =>
            setOldPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <button
          onClick={changePassword}
        >
          Change Password
        </button>

      </div>

      <div className="profile-card">

        <h3>Account</h3>

        <button
          onClick={logout}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;