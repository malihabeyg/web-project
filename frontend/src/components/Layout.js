// Layout.js
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Sidebar"; // if you have separate Navbar, import it here

const Layout = () => {
  return (
    <div className="main-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar if separate */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
