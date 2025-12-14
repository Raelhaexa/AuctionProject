import React, { useState } from "react";
import "./Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

        <form className="login-card">
          <label className="field">
            <span className="label">Email</span>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit" className="login-button">
            Sign in
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="socials">
            <button className="social google">Continue with Google</button>
            
          </div>

          <p className="signup">
            Don’t have an account?{" "}
            <a href="#">Create account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
