"use client";

import { TableCell, TableRow } from "@qco/ui/components/table";

import { AdminActions } from "./admin-actions";
import { AdminRoleBadge } from "./admin-role-badge";
import { AdminStatusBadge } from "./admin-status-badge";

interface AdminTableRowProps {
  admin: Admin;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function AdminTableRow({
  admin,
  onEdit,
  onDelete,
  isDeleting = false,
}: AdminTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{admin.name}</TableCell>
      <TableCell>{admin.email}</TableCell>
      <TableCell>
        <AdminRoleBadge role={admin.role} />
      </TableCell>
      <TableCell>
        <AdminStatusBadge isActive={admin.isActive} />
      </TableCell>
      <TableCell>
        {new Date(admin.createdAt).toLocaleDateString("ru-RU")}
      </TableCell>
      <TableCell className="text-right">
        <AdminActions
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      </TableCell>
    </TableRow>
  );
}
