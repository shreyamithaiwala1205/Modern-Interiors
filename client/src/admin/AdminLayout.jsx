import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import "./css/Admin.css";

const AdminLayout = ({ children }) => {

  return (

    <div className="admin-container">

      <Sidebar />

      <div className="admin-main">

        <Navbar />

        <div className="admin-content">

          {children}

        </div>

      </div>

    </div>

  );

};

export default AdminLayout;