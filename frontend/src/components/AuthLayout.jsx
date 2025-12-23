import "./AuthLayout.css";
import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => (
  <div className="auth-page">
    <div className="auth-left">
      <h1>Smart Stock</h1>
      <p>Manage inventory. Track sales. Grow smarter.</p>

      <div className="auth-links">
        <p>Don’t have an account?</p>
        <Link to="/signup">Create an account</Link>
      </div>
    </div>

    <div className="auth-right">
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;
