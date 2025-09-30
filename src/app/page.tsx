"use client";

import "@/app/styles/welcome.css";
import { notify } from "@/lib/notify";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    // Remote token jwt in localstorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Redirect to login page and show notice
    router.push("/auth/login");
    notify.info("Logged out");
  };

  // Handle get data profile user
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // User not login
    if (!token) {
      router.push("/auth/login");
    }

    fetch("http://localhost:5254/api/Auth/me", {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => {
        // Show notice if user not login
        notify.info("Login required!");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!profile || !profile.firstName)
    return <p>Redirecting to the login page...</p>;

  return (
    <div className="card" role="main">
      <div className="greeting" id="greeting">
        
      </div>
      <div className="avatar" aria-hidden="true" id="avatar"></div>
      <div className="user-name" id="userName">
        {profile.firstName + " " + profile.lastName}
      </div>
      <div className="user-email" id="userEmail">
        {profile.email}
      </div>
      <div className="welcome-message">
        Welcome back! We are very happy to see you again.
      </div>
      <div className="btn-group">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>

      <Script src="/js/welcome.js"></Script>
    </div>
  );
}
