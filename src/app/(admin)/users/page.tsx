"use client";

import { useEffect, useState } from "react";
import UserTable from "@/components/users/UserTable";
import { Button } from "@/components/ui/button";
import { Divide, Plus } from "lucide-react";
import CreateUserModal from "@/components/users/CreateUserModal";
import UpdateUserModal from "@/components/users/UpdateUserModal";
import ConfirmDeleteModal from "@/components/users/ConfirmDeleteModal";
import Header from "@/components/users/Header";

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

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    fetch("http://localhost:5254/api/User/get-all", {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Handle set state show modal
  function handleEdit(user: User) {
    console.log("Edit", user);
    setSelectedUser(user);
    setCurrentModal("update");
  }

  // Handle render state UI when user created
  const handleCreate = (newUser: any) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  // Handle render state UI when user updated
  const handleUpdate = (updatedUser: any) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  // Handle render state UI when user deleted
  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div>
      <Header></Header>
      <div className="pr-44 pl-44 mt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">User management</h1>
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
      </div>
    </div>
  );
}
