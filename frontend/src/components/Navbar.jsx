import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "../services/notificationService";

function Navbar() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  const loadCount = async () => {
    try {
      const data = await getUnreadCount();
      setCount(data.count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  useEffect(() => {
    loadCount();

    // Refresh every 30 seconds
    const interval = setInterval(loadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (

    <div className="navbar">

      <div className="logo">
        Movie<span>Box</span>
      </div>

      <div className="nav-right">
        <button
          className="watched-nav-btn"
          onClick={() => navigate("/watched")}
          style={{
            background: "transparent",
            border: "none",
            color: "#cbd5e1",
            marginRight: "20px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 12px",
            borderRadius: "6px",
            transition: "0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#38bdf8";
            e.currentTarget.style.backgroundColor = "rgba(56, 189, 248, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#cbd5e1";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          👁️ Watched
        </button>

        <button
          className="notification-btn"
          onClick={() => navigate("/notifications")}
        >
          🔔
          {count > 0 && (
            <span className="notification-badge">{count}</span>
          )}
        </button>

        <div className="profile">

          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
          />

          <span>John Doe</span>

        </div>

      </div>

    </div>
    
  );
}

export default Navbar;