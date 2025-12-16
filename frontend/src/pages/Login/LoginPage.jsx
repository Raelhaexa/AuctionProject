import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(username, password);
      // Redirect to dashboard on successful login
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-hero">
      <div className="login-container">
        <div className="login-brand">
          <div className="logo">PB</div>
          <div>
            <h1>PulseBid</h1>
            <p className="tag">Sign in to start bidding — secure & real-time</p>
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <label className="field">
            <span className="label">Username</span>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="label">Password</span>
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <div className="options">
            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>
            <a className="forgot" href="#">
              Forgot?
            </a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="socials">
            <button type="button" className="social google">Continue with Google</button>
            
          </div>

          <p className="signup">
            Don't have an account?{" "}
            <a href="/register">Create account</a>
            <a href="#">Create account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
