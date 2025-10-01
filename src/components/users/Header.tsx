"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notify } from "@/lib/notify";
import { useRouter } from "next/navigation";

export default function Header() {
  const [profile, setProfile] = useState<any>(null);
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
      });
  }, []);

  const showProfile = () => {
    router.push("/");
  };

  return (
    <header className="flex items-center justify-between p-4 border-b pr-36 pl-36">
      <h1 className="text-xl font-bold">Admin</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="font-semibold">
           Dương Minh Trí
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel onClick={showProfile}>Thông tin</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
