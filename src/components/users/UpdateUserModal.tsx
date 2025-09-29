"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  } | null;
  onUpdate: (updatedUser: any) => void;
}

export default function UpdateUserModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: UpdateUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setRole(user.roles?.[0] || "");
      setPassword("");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const token = localStorage.getItem("access_token");

    const body = {
      firstName,
      lastName,
      email,
      password: password || undefined, // nếu để trống thì bỏ qua
      roles: [role],
    };

    const res = await fetch(`http://localhost:5254/api/User/update/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const updatedUser = { ...user, ...body };
      onUpdate(updatedUser);
      onClose();
    } else {
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nhập first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nhập last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Để trống nếu không đổi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
