import React, { useState } from "react";
import API from "../services/api";

function ChangePassword({ showToast }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      showToast?.("Password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast?.("Passwords do not match", "error");
      return;
    }

    try {
      const res = await API.put("/profile/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      showToast?.(
        res.data.message || "Password changed successfully",
        "success"
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast?.(
        err.response?.data?.detail || "Password change failed",
        "error"
      );
    }
  };

  return (
    <div className="profile-card">
      <h3>Change Password</h3>

      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button onClick={handleChangePassword}>
        Change Password
      </button>
    </div>
  );
}

export default ChangePassword;