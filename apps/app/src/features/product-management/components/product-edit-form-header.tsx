"use client";

import { Button } from "@qco/ui/components/button";
import type { ProductUpdateInput } from "@qco/validators";
import { ChevronRight, Save } from "lucide-react";
import Link from "next/link";

interface ProductEditFormHeaderProps {
  isNewProduct: boolean;
  formData: ProductUpdateInput;
  pageTitle: string;
  isSaving: boolean;
  isDirty: boolean;
  handleSave: () => void;
}

export function ProductEditFormHeader({
  isNewProduct,
  formData,
  pageTitle,
  isSaving,
  isDirty,
  handleSave,
}: ProductEditFormHeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Link
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Товары
          </Link>
          <ChevronRight className="h-4 w-4" />
          {!isNewProduct && (
            <>
              <span className="max-w-[200px] truncate">{formData.name}</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground font-medium">{pageTitle}</span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="gap-1"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Сохранение..." : "Сохранить"}</span>
        </Button>
      </div>
    </header>
  );
}
