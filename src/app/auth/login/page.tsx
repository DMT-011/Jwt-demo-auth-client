"use client";
import Link from "next/link";
import { use, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { notify } from "@/lib/notify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5254/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          password: password,
        }),
      });

      if (!res.ok) {
        notify.error("Login failed!");
        return;
      }

      const data = await res.json();
      const userRole = data.roles[0];

      // Save token in localStorage
      localStorage.setItem("access_token", data.jwtToken);
      localStorage.setItem("refresh_token", data.refreshToken);

      // Redirect home welcome page if use login success
      if (isAdminChecked && userRole === "Admin") {
        router.push("/users");
      } else {
        router.push("/");
      }

      // Show notice when user login successfully
      notify.success("Login successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="material-logo">
            <div className="logo-layers">
              <div className="layer layer-1"></div>
              <div className="layer layer-2"></div>
              <div className="layer layer-3"></div>
            </div>
          </div>
          <h2>Sign in</h2>
          <p>to continue to your account</p>
        </div>

        <form
          className="login-form"
          id="loginForm"
          onSubmit={handleLogin}
          noValidate
        >
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="username">User name</label>
              <div className="input-line"></div>
              <div className="ripple-container"></div>
            </div>
            <span className="error-message" id="emailError"></span>
          </div>

          <div className="form-group">
            <div className="input-wrapper password-wrapper">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
              <div className="input-line"></div>
              <button
                type="button"
                className="password-toggle"
                id="passwordToggle"
                aria-label="Toggle password visibility"
              >
                <div className="toggle-ripple"></div>
                <span className="toggle-icon"></span>
              </button>
              <div className="ripple-container"></div>
            </div>
            <span className="error-message" id="passwordError"></span>
          </div>

          <div className="form-options">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdminChecked}
                onChange={(e) => setIsAdminChecked(e.target.checked)}
              />
              <label htmlFor="isAdmin" className="checkbox-label">
                <div className="checkbox-material">
                  <div className="checkbox-ripple"></div>
                  <svg className="checkbox-icon" viewBox="0 0 24 24">
                    <path
                      className="checkbox-path"
                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                    />
                  </svg>
                </div>
                Login as an administrator
              </label>
            </div>
          </div>

          <button type="submit" className="login-btn material-btn">
            <div className="btn-ripple"></div>
            <span className="btn-text">SIGN IN</span>
            <div className="btn-loader">
              <svg className="loader-circle" viewBox="0 0 50 50">
                <circle
                  className="loader-path"
                  cx="25"
                  cy="25"
                  r="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn google-material">
            <div className="social-ripple"></div>
            <div className="social-icon google-icon">
              <svg viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="signup-link">
          <p>
            Don't have an account?
            <Link href={"/auth/register"} className="create-account">
              Sign up
            </Link>
          </p>
        </div>

        <div className="success-message" id="successMessage">
          <div className="success-elevation">
            <div className="success-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <h3>Welcome back!</h3>
            <p>Signing you in...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
