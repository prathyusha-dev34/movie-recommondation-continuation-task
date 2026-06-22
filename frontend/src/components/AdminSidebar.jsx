import { Link, useLocation, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const activeStyle = {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#ffffff",
    boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
  };

  const menuStyle = {
    padding: "14px 18px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#cbd5e1",
    transition: "all 0.3s ease",
    fontSize: "15px",
    fontWeight: "500",
  };

  return (
    <div
      style={{
        width: "270px",
        minHeight: "100vh",
        background: "#0b1220",
        color: "white",
        padding: "24px",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🎬 MovieHub
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "8px",
            fontSize: "13px",
          }}
        >
          Admin Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Link
          to="/admin"
          style={{
            ...menuStyle,
            ...(location.pathname === "/admin"
              ? activeStyle
              : {}),
          }}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/admin/users"
          style={{
            ...menuStyle,
            ...(location.pathname === "/admin/users"
              ? activeStyle
              : {}),
          }}
        >
          👥 Users
        </Link>

        <Link
          to="/admin/reviews"
          style={{
            ...menuStyle,
            ...(location.pathname === "/admin/reviews"
              ? activeStyle
              : {}),
          }}
        >
          ⭐ Reviews
        </Link>
      </nav>

      {/* Bottom Section */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          width: "220px",
        }}
      >
        <button
          onClick={logout}
          style={{
            width: "100%",
            background:
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "14px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;