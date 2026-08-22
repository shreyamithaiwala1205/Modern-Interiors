import { LogOut, Bell, Search, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="admin-navbar">

      <div className="navbar-left">

        <h2>Dashboard</h2>

        <p>{today}</p>

      </div>

      <div className="navbar-right">

        <div className="navbar-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

        <button className="navbar-icon">

          <Bell size={19} />

        </button>

        <div className="admin-profile">

          <UserCircle size={36} />

          <div>

            <h4>{user?.name || "Admin"}</h4>

            <span>Administrator</span>

          </div>

        </div>

        <button
          className="admin-logout"
          onClick={logoutHandler}
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </header>
  );

};

export default Navbar;