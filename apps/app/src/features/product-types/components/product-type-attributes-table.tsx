"use client";

import { Button } from "@qco/ui/components/button";
import type {
  ProductTypeAttribute,
  ProductTypeAttributesTableProps,
} from "../types";

export function ProductTypeAttributesTable({
  attributes,
  onAdd,
  onEdit,
  onDelete,
}: ProductTypeAttributesTableProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Product Type Attributes</h3>
        <Button onClick={onAdd}>Add Attribute</Button>
      </div>
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Slug</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Required</th>
            <th className="px-4 py-2 text-left">Options</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-500">
                No attributes found
              </td>
            </tr>
          ) : (
            attributes.map((attr: ProductTypeAttribute) => (
              <tr key={attr.id} className="border-t">
                <td className="px-4 py-2 font-medium">{attr.name}</td>
                <td className="px-4 py-2">{attr.slug}</td>
                <td className="px-4 py-2">{attr.type}</td>
                <td className="px-4 py-2">{attr.required ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  {attr.options
                    ?.map((o: { label: string; value: string }) => o.label)
                    .join(", ")}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(attr.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(attr.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
