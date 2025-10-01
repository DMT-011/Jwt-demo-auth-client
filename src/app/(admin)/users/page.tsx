"use client";

import { useEffect, useState } from "react";
import UserTable from "@/components/users/UserTable";
import { Button } from "@/components/ui/button";
import { Divide, Plus } from "lucide-react";
import CreateUserModal from "@/components/users/CreateUserModal";
import UpdateUserModal from "@/components/users/UpdateUserModal";
import ConfirmDeleteModal from "@/components/users/ConfirmDeleteModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  roles: string[];
};

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [currentModal, setCurrentModal] = useState<"create" | "update" | null>(
    null
  );
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch("http://localhost:5254/api/User/get-all", {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  function handleEdit(user: User) {
    setSelectedUser(user);
    setCurrentModal("update");
  }

  const handleCreate = (newUser: any) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleUpdate = (updatedUser: any) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
          Admin Dashboard
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/users"
                className="block px-3 py-2 rounded hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className="block px-3 py-2 rounded bg-gray-200 font-semibold"
              >
                Users
              </Link>
            </li>
            {/* Thêm các mục khác nếu cần */}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-8 justify-between">
          <div className="font-semibold text-lg">User Management</div>
          <div>
            {/* Có thể thêm avatar, thông tin admin ở đây */}
            <span className="text-gray-600">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">List User</h1>
            <Button onClick={() => setCurrentModal("create")}>
              <Plus className="w-4 h-4" />
             <span className="pr-2">Add</span>
            </Button>
          </div>

          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={(id: number) => {
              setSelectedUserId(id);
              setIsDeleteOpen(true);
            }}
          />

          {/* Modal create user*/}
          <CreateUserModal
            isOpen={currentModal === "create"}
            onClose={() => setCurrentModal(null)}
            onCreate={handleCreate}
          />

          {/* Modal update user */}
          <UpdateUserModal
            isOpen={currentModal === "update"}
            onClose={() => setCurrentModal(null)}
            user={selectedUser}
            onUpdate={handleUpdate}
          />

          <ConfirmDeleteModal
            isOpen={isDeleteOpen}
            onClose={() => setIsDeleteOpen(false)}
            userId={selectedUserId}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}
