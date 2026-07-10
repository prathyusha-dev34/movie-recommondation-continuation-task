import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">🏠 Home</Link>

      <Link to="/dashboard">📊 Dashboard</Link>

      <Link to="/favorites">❤️ Favorites</Link>

      <Link to="/history">🕒 History</Link>

      <Link to="/watchlist">📺 Watchlist</Link>

      <Link to="/watched">👁️ Watched</Link>

      <Link to="/collections">📁 My Collections</Link>

      <Link to="/collections/public">🌍 Public Collections</Link>

      <Link to="/profile">👤 Profile</Link>
    </div>
  );
}

export default Sidebar;