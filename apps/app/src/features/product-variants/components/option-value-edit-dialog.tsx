"use client";

import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qco/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { toast } from "@qco/ui/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ColorPicker } from "@qco/ui/components/color-picker";

import { useTRPC } from "~/trpc/react";

interface OptionValueEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option: any;
  value: any;
}

export function OptionValueEditDialog({
  open,
  onOpenChange,
  option,
  value,
}: OptionValueEditDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedColor, setSelectedColor] = useState(
    value.metadata?.hex || "#000000",
  );

  const form = useForm({
    defaultValues: {
      value: value.value || value.name,
    },
  });

  useEffect(() => {
    if (value) {
      form.reset({
        value: value.value || value.name,
      });
      setSelectedColor(value.metadata?.hex || "#000000");
    }
  }, [value, form]);

  const isColorOption =
    option.name.toLowerCase().includes("цвет") ||
    option.name.toLowerCase().includes("color");

  const updateValueMutation =
    trpc.productVariants.updateOptionValue.mutationOptions({
      onSuccess: () => {
        onOpenChange(false);
        toast("Значение успешно обновлено");
        queryClient.invalidateQueries();
      },
      onError: (error) => {
        toast(`Ошибка: ${error.message || "Не удалось обновить значение"}`);
      },
    });

  const updateValue = useMutation(updateValueMutation);

  const onSubmit = (data: { value: string }) => {
    updateValue.mutate({
      valueId: value.id,
      value: data.value,
      metadata: isColorOption ? { hex: selectedColor } : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать значение</DialogTitle>
          <DialogDescription>
            Измените название и цвет (если это опция цвета) для значения опции
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название значения</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isColorOption && (
              <FormItem>
                <FormLabel>Цвет</FormLabel>
                <FormControl>
                  <ColorPicker
                    value={selectedColor}
                    onChange={setSelectedColor}
                  />
                </FormControl>
              </FormItem>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={updateValue.isPending}>
                {updateValue.isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
