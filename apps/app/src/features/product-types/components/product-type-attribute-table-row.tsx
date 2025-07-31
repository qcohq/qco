"use client";

import type { ProductTypeAttribute } from "@/features/product-attributes/types/attribute";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@qco/ui/components/alert-dialog";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { useDeleteProductTypeAttribute } from "../hooks/use-product-type-attributes";

interface ProductTypeAttributeTableRowProps {
  attribute: ProductTypeAttribute;
  productTypeId: string;
}

export function ProductTypeAttributeTableRow({
  attribute,
  productTypeId,
}: ProductTypeAttributeTableRowProps) {
  const deleteMutation = useDeleteProductTypeAttribute();

  const handleDelete = () => {
    deleteMutation.mutate({ id: attribute.id });
  };

  return (
    <div className="grid grid-cols-6 gap-4 p-4 items-center">
      <div>
        <div className="font-medium">{attribute.name}</div>
        {"description" in attribute && attribute.description && (
          <div className="text-sm text-muted-foreground">
            {attribute.description}
          </div>
        )}
      </div>
      <div>
        <Badge variant="secondary">{attribute.type}</Badge>
      </div>
      <div>
        <Badge variant={attribute.isRequired ? "default" : "secondary"}>
          {attribute.isRequired ? "Yes" : "No"}
        </Badge>
      </div>
      <div>
        <Badge variant={attribute.isSearchable ? "default" : "secondary"}>
          {attribute.isSearchable ? "Yes" : "No"}
        </Badge>
      </div>
      <div>
        <Badge variant={attribute.isFilterable ? "default" : "secondary"}>
          {attribute.isFilterable ? "Yes" : "No"}
        </Badge>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={`/product-types/${productTypeId}/attributes/${attribute.id}/edit`}
          >
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={deleteMutation.isPending}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Attribute</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the attribute "{attribute.name}"
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
