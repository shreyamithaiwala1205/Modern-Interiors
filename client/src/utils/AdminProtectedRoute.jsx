import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  return user.role === "admin"
    ? children
    : <Navigate to="/" replace />;

};

export default AdminProtectedRoute;