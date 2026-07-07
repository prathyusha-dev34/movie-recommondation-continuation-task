import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

import StatsCards from "../components/StatsCards";
import GenrePreferences from "../components/GenrePreferences";
import ChangePassword from "../components/ChangePassword";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });

  const [stats, setStats] = useState({
    watched_count: 0,
    favorites_count: 0,
    watchlist_count: 0,
    reviews_count: 0,
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile/");
      setProfile(res.data);
    } catch {
      showToast("Failed to load profile", "error");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/profile/stats");
      setStats(res.data);
    } catch {
      showToast("Failed to load stats", "error");
    }
  };

  const updateProfile = async () => {
    try {
      const res = await API.put("/profile/", profile);

      showToast(
        res.data.message || "Profile updated successfully",
        "success"
      );

      setEditMode(false);
      fetchProfile();

    } catch (err) {
      showToast(
        err.response?.data?.detail || "Profile update failed",
        "error"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    showToast("Logged out successfully", "success");

    setTimeout(() => navigate("/login"), 500);
  };

  return (
    <div className="profile-page">

      <h1 className="profile-title">
        My Profile
      </h1>

      <div className="profile-header">

        <div className="profile-card profile-left">

          <img
            className="profile-avatar"
            src="https://i.pravatar.cc/200"
            alt="avatar"
          />

          <input
            disabled={!editMode}
            value={profile.username}
            onChange={(e) =>
              setProfile({
                ...profile,
                username: e.target.value,
              })
            }
          />

          <input
            disabled={!editMode}
            value={profile.email}
            onChange={(e) =>
              setProfile({
                ...profile,
                email: e.target.value,
              })
            }
          />

          {editMode ? (
            <button onClick={updateProfile}>
              Save Profile
            </button>
          ) : (
            <button onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}

        </div>

        <div className="profile-right">

          <StatsCards stats={stats} />

          <GenrePreferences showToast={showToast} />

          <ChangePassword showToast={showToast} />

          <div className="profile-card">

            <h3>Account</h3>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;