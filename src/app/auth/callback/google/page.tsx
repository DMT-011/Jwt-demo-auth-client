"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (!code) {
      router.push("/auth/login");
      return;
    }

    // Gửi code về backend để lấy JWT
    fetch("http://localhost:5254/api/Auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Google login failed");
        const data = await res.json();
        // Lưu JWT vào localStorage
        localStorage.setItem("access_token", data.jwt);
        // Có thể lưu thêm refresh_token nếu backend trả về
        router.push("/");
      })
      .catch(() => {
        router.push("/auth/login");
      });
  }, [router]);

  return <div>Đang đăng nhập bằng Google...</div>;
}
