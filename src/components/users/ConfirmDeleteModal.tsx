"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
    } else {
      alert("Xoá thất bại!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận xoá user</DialogTitle>
        </DialogHeader>

        <p>Bạn có chắc muốn xoá user này không?</p>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
