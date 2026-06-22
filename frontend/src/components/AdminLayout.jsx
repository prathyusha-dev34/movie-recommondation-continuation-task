import AdminSidebar from "./AdminSidebar";
import "../styles/admin.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;