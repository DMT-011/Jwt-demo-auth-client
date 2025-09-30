"use client";
import "@/app/styles/welcome.css";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    router.push("/auth/login");
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
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Lỗi xác thực hoặc không lấy được dữ liệu user");
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        return null;
      })
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error(err);
        router.push("/auth/login");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (!profile || !profile.firstName)
    return <p>Đang chuyển về trang đăng nhập...</p>;

  return (
    <div className="card" role="main">
      <div className="greeting" id="greeting">
        Chào buổi sáng!
      </div>
      <div className="avatar" aria-hidden="true" id="avatar"></div>
      <div className="user-name" id="userName">
        {profile.firstName + " " + profile.lastName}
      </div>
      <div className="user-email" id="userEmail">
        {profile.email}
      </div>
      <div className="welcome-message">
        Chào mừng bạn đã quay trở lại! Chúng tôi rất vui được gặp lại bạn.
      </div>
      <div className="btn-group">
        <button
          className="btn btn-outline"
          type="button"
          aria-label="Xem hồ sơ"
        >
          Hồ sơ
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>

      <Script src="/js/welcome.js"></Script>
    </div>
  );
}
