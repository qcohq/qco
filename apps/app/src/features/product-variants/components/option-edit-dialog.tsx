"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useTRPC } from "~/trpc/react";
import { optionEditSchema, type OptionEditData } from "../types";

interface OptionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option: any;
  productId: string;
}

export function OptionEditDialog({
  open,
  onOpenChange,
  option,
  productId,
}: OptionEditDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализируем форму
  const form = useForm<OptionEditData>({
    resolver: zodResolver(optionEditSchema),
    defaultValues: {
      name: option?.name || "",
    },
  });

  // Мутация для обновления опции
  const updateOptionMutation = useMutation(
    trpc.productVariants.updateOption.mutationOptions({
      onSuccess: () => {
        // Инвалидируем запрос на получение опций
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getOptions.queryKey({ productId }),
        });

        // Закрываем диалог
        onOpenChange(false);
        setIsSubmitting(false);

        toast({
          title: "Успешно",
          description: "Опция успешно обновлена",
          variant: "default",
        });
        setIsSubmitting(false);
      },
    }),
  );

  // Обработчик отправки формы
  const onSubmit = (values: OptionEditData) => {
    setIsSubmitting(true);

    // Обновляем опцию
    updateOptionMutation.mutate({
      attributeId: option.id,
      data: {
        name: values.name,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактировать опцию</DialogTitle>
          <DialogDescription>
            Измените название опции вариантов товара
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название опции</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Например: Размер, Цвет, Материал"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
