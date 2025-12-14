import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import "./Register.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const registerData = {
        firstName: form.firstname,
        lastName: form.lastname,
        username: form.username,
        email: form.email,
        password: form.password,
        role: "USER"
      };

      await register(registerData);
      // Redirect to dashboard on successful registration
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-hero">
      <div className="register-container">

        {/* Brand */}
        <div className="register-brand">
          <div className="logo">PB</div>
          <div>
            <h1>Create Your Account</h1>
            <p className="tag">Join PulseBid — fast, secure, real‑time bidding</p>
          </div>
        </div>

        {/* Form */}
        <form className="register-card" onSubmit={handleSubmit}>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="row">
            <label className="field">
              <span className="label">First Name</span>
              <input
                type="text"
                placeholder="John"
                value={form.firstname}
                onChange={(e) => update("firstname", e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="label">Last Name</span>
              <input
                type="text"
                placeholder="Doe"
                value={form.lastname}
                onChange={(e) => update("lastname", e.target.value)}
                required
              />
            </label>
          </div>

          <label className="field">
            <span className="label">Username</span>
            <input
              type="text"
              placeholder="john_doe"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              required
              minLength="4"
            />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="label">Password</span>
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength="6"
              />
              <button
                type="button"
                className="toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Sign in</a>
          </p>

        </form>

      </div>
    </div>
  );
};

export default RegisterPage;
