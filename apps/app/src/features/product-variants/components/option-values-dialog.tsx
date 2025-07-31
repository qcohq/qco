"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
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
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ColorPicker } from "@qco/ui/components/color-picker";

import { useTRPC } from "~/trpc/react";
import { optionValueSchema, type OptionValueData } from "../types";

interface OptionValuesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  option: any;
  productId: string;
}

export function OptionValuesDialog({
  open,
  onOpenChange,
  option,
  productId,
}: OptionValuesDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [isDeletingValue, setIsDeletingValue] = useState(false);

  // Проверяем, является ли опция цветовой
  const isColorOption =
    option?.name?.toLowerCase().includes("цвет") ||
    option?.name?.toLowerCase().includes("color") ||
    option?.type === "color";

  // Инициализируем форму
  const form = useForm<OptionValueData>({
    resolver: zodResolver(optionValueSchema),
    defaultValues: {
      value: "",
      hex: "#000000",
    },
  });

  // Мутация для добавления значения
  const addOptionValueOptions =
    trpc.productVariants.addOptionValue.mutationOptions({
      onSuccess: () => {
        // Инвалидируем запрос на получение опций
        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getOptions.queryKey({ productId }),
        });

        // Сбрасываем форму
        form.reset({ value: "", hex: "#000000" });
        setIsAddingValue(false);

        toast({
          title: "Успех",
          description: "Значение успешно добавлено",
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: `${error.message || "Не удалось добавить значение"}`,
          variant: "destructive",
        });
        setIsAddingValue(false);
      },
    });

  const addValueMutation = useMutation(addOptionValueOptions);

  // Мутация для удаления значения
  const deleteOptionValueOptions =
    trpc.productVariants.deleteOptionValue.mutationOptions({
      onSuccess: () => {
        // Инвалидируем запрос на получение опций
        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getOptions.queryKey({ productId }),
        });

        setIsDeletingValue(false);

        toast({
          title: "Успех",
          description: "Значение успешно удалено",
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: `${error.message || "Не удалось удалить значение"}`,
          variant: "destructive",
        });
        setIsDeletingValue(false);
      },
    });

  const deleteValueMutation = useMutation(deleteOptionValueOptions);

  // Обработчик отправки формы
  const onSubmit = (values: OptionValueData) => {
    setIsAddingValue(true);

    addValueMutation.mutate({
      attributeId: option.id,
      value: values.value,
      productId, // Добавляем обязательное поле productId
    });
  };

  // Обработчик удаления значения
  const handleDeleteValue = (valueId: string) => {
    setIsDeletingValue(true);

    deleteValueMutation.mutate({
      valueId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Значения опции "{option?.name}"</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium">Текущие значения</h3>
          {option?.values && option.values.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {option.values.map((value: any) => (
                <Badge
                  key={value.id}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-2"
                >
                  {isColorOption && value.metadata?.hex && (
                    <div
                      className="h-3 w-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: value.metadata.hex }}
                    />
                  )}
                  <span className="font-medium">{value.value}</span>
                  {value.name && (
                    <span className="text-xs text-muted-foreground">
                      {value.name}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4 rounded-full p-0 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteValue(value.id)}
                    disabled={isDeletingValue}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Нет значений</p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название значения</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        isColorOption
                          ? "Например: Красный, Синий"
                          : "Введите название значения"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isColorOption && (
              <FormField
                control={form.control}
                name="hex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цвет</FormLabel>
                    <FormControl>
                      <ColorPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={isAddingValue}>
                <Plus className="mr-1 h-4 w-4" />
                {isAddingValue ? "Добавление..." : "Добавить"}
              </Button>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Готово</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
