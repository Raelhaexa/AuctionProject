import React, { useState } from "react";
import "./Register.css";

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
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
        <form className="register-card">

          <div className="row">
            <label className="field">
              <span className="label">First Name</span>
              <input
                type="text"
                placeholder="John"
                value={form.firstname}
                onChange={(e) => update("firstname", e.target.value)}
              />
            </label>

            <label className="field">
              <span className="label">Last Name</span>
              <input
                type="text"
                placeholder="Doe"
                value={form.lastname}
                onChange={(e) => update("lastname", e.target.value)}
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
            />
          </label>

          <label className="field">
            <span className="label">Email</span>
            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
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

          <button type="submit" className="register-button">Create Account</button>

          <p className="login-link">
            Already have an account? <a href="/">Sign in</a>
          </p>

        </form>

      </div>
    </div>
  );
};

export default RegisterPage;
