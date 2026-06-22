
import React from "react";

function Navbar() {

  return (

    <div className="navbar">

      <div className="logo">
        Movie<span>Box</span>
      </div>

      <div className="nav-right">

        <button className="notification-btn">
          🔔
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