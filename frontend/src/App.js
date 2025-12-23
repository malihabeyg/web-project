import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={user ? <Navigate to="/dashboard" /> : <SignIn />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
