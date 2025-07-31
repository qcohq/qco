"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { Calendar, Edit, Mail, Trash2, User } from "lucide-react";
import {
  formatDate,
  getRoleBadgeVariant,
  getRoleLabel,
  getStatusBadgeVariant,
  getStatusLabel,
} from "../utils/admin-utils";
import type { Admin } from "@qco/validators";

interface AdminTableProps {
  admins: Admin[];
  onEdit: (admin: Admin) => void;
  onDelete: (adminId: string) => void;
  isDeleting?: boolean;
}

export function AdminTable({
  admins,
  onEdit,
  onDelete,
  isDeleting = false,
}: AdminTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Роль</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата создания</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-8 text-center"
                >
                  Администраторы не найдены
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {admin.name || "Не указано"}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(admin.role)}>
                      {getRoleLabel(admin.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(admin.isActive)}>
                      {getStatusLabel(admin.isActive)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(admin.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(admin)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(admin.id)}
                        disabled={isDeleting}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4 p-4">
        {admins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Администраторы не найдены
          </div>
        ) : (
          admins.map((admin) => (
            <div
              key={admin.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {admin.name || "Не указано"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(admin)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(admin.id)}
                    disabled={isDeleting}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{admin.email}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={getRoleBadgeVariant(admin.role)}>
                  {getRoleLabel(admin.role)}
                </Badge>
                <Badge variant={getStatusBadgeVariant(admin.isActive)}>
                  {getStatusLabel(admin.isActive)}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatDate(admin.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
