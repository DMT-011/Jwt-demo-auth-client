"use client";
import { notify } from "@/lib/notify";
import Link from "next/link";
import { use, useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5254/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          userName: username,
          email: email,
          password: password,
        }),
      });

      if (!res.ok) {
        notify.error("Registration failed!");
      }

      const data = await res.json();

      // Show notice register success and reset form
      notify.success("Registration successfully");
      setfirstName("");
      setlastName("");
      setEmail("");
      setUsername("");
      setPassword("");

    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="signup-container">
      <div className="logo"></div>
      <h1 className="signup-title">Create account</h1>
      <p className="signup-subtitle">to get started with your account</p>

      <form onSubmit={handleRegister}>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder=""
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
              required
            />
            <label className="form-label">First name</label>
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={lastName}
              onChange={(e) => setlastName(e.target.value)}
              placeholder=" "
              required
            />
            <label className="form-label">Last name</label>
          </div>
        </div>

        <div className="form-group">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            placeholder=" "
            required
          />
          <label className="form-label">Username</label>
        </div>

        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder=" "
            required
          />
          <label className="form-label">Email</label>
        </div>

        <div className="form-group">
          <div className="password-container">
            <input
              type="password"
              className="form-input"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              required
            />
            <label className="form-label">Password</label>
          </div>
        </div>

        <button type="submit" className="signup-btn">
          Sign Up
        </button>
      </form>

      <div className="signin-link">
        Already have an account? <Link href={"/auth/login"}>Sign in</Link>
      </div>
    </div>
  );
}
