"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notify";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  onDelete: (id: number) => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  userId,
  onDelete,
}: ConfirmDeleteModalProps) {
  const handleDelete = async () => {
    if (!userId) return;

    const token = localStorage.getItem("access_token");

    const res = await fetch(`http://localhost:5254/api/User/delete/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (res.ok) {
      onDelete(userId);
      onClose();

      notify.success("Deleted user success");
    } else {
      notify.error("Delete user failed!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm delete user</DialogTitle>
        </DialogHeader>

        <p>Are you sure you want to delete this user?</p>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
