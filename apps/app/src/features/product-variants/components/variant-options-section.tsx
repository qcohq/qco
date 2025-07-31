"use client";

import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { OptionsDialog } from "./options-dialog";
import { VariantOptionsTable } from "./variant-options-table";

interface VariantOptionsSectionProps {
  productId: string;
}

export function VariantOptionsSection({
  productId,
}: VariantOptionsSectionProps) {
  const [isAddOptionDialogOpen, setIsAddOptionDialogOpen] = useState(false);

  return (
    <section id="variants">
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Варианты товара</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddOptionDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Добавить опцию
          </Button>
        </div>

        <p className="text-muted-foreground text-sm mt-1 mb-4">
          Добавьте варианты товара, если он доступен в нескольких размерах,
          цветах или других опциях
        </p>

        <Separator className="my-4" />

        <VariantOptionsTable productId={productId} />

        <OptionsDialog
          open={isAddOptionDialogOpen}
          onOpenChange={setIsAddOptionDialogOpen}
          productId={productId}
        />
      </Card>
    </section>
  );
}
