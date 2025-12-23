import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send signup request to backend
      await axios.post(
        "http://127.0.0.1:8000/api/auth/signup",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Account created successfully!");
      navigate("/signin"); // Redirect to sign in
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
};

export default SignUp;
