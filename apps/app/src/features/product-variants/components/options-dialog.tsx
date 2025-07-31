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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { TagInput } from "@qco/ui/components/tag-input";
import { toast } from "@qco/ui/hooks/use-toast";
import {
  type OptionFormInputValues,
  optionFormInputSchema,
} from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useTRPC } from "~/trpc/react";

// Схема для валидации формы импортирована из @qco/validators

interface OptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}

export function OptionsDialog({
  open,
  onOpenChange,
  productId,
}: OptionsDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализируем форму
  const form = useForm<OptionFormInputValues>({
    resolver: zodResolver(optionFormInputSchema),
    defaultValues: {
      name: "",
      values: [],
    },
  });

  // Мутация для создания опции
  const createOptionMutation = useMutation(
    trpc.productVariants.createOption.mutationOptions({
      onSuccess: () => {
        // Инвалидируем запрос на получение опций
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getOptions.queryKey({ productId }),
        });

        // Сбрасываем форму и закрываем диалог
        form.reset();
        onOpenChange(false);
        setIsSubmitting(false);

        toast({
          title: "Успешно",
          description: "Опция успешно создана",
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: `${error.message ?? "Не удалось создать опцию"}`,
          variant: "destructive",
        });
        setIsSubmitting(false);
      },
    }),
  );

  // Обработчик отправки формы
  const onSubmit = (values: OptionFormInputValues) => {
    setIsSubmitting(true);
    // Создаем опцию с правильной структурой данных
    createOptionMutation.mutate({
      name: values.name,
      values: values.values,
      productId,
    });
  };

  // Обработчик для кнопок-заготовок
  const handlePresetClick = (presetName: string, presetValues?: string[]) => {
    form.setValue("name", presetName);
    if (presetValues) {
      form.setValue("values", presetValues);
    }
  };

  // Предустановленные значения для опций
  const optionPresets = {
    Размер: {
      "Размер одежды": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      "Размер обуви (женская)": [
        "35",
        "35.5",
        "36",
        "36.5",
        "37",
        "37.5",
        "38",
        "38.5",
        "39",
        "39.5",
        "40",
        "40.5",
        "41",
        "41.5",
        "42",
        "42.5",
        "43",
      ],
      "Размер обуви (мужская)": [
        "39",
        "39.5",
        "40",
        "40.5",
        "41",
        "41.5",
        "42",
        "42.5",
        "43",
        "43.5",
        "44",
        "44.5",
        "45",
        "45.5",
        "46",
        "46.5",
        "47",
        "47.5",
        "48",
      ],
      "Размер обуви (детская)": [
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
      ],
    },
    Цвет: {
      "Основные цвета": [
        "Черный",
        "Белый",
        "Красный",
        "Синий",
        "Зеленый",
        "Желтый",
        "Розовый",
        "Серый",
        "Коричневый",
        "Оранжевый",
        "Фиолетовый",
      ],
      "Пастельные цвета": [
        "Бежевый",
        "Голубой",
        "Розовый",
        "Мятный",
        "Лавандовый",
        "Персиковый",
        "Кремовый",
      ],
      "Яркие цвета": [
        "Неоновый розовый",
        "Неоновый зеленый",
        "Неоновый желтый",
        "Неоновый оранжевый",
        "Неоновый синий",
      ],
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить новую опцию</DialogTitle>
          <DialogDescription>
            Добавьте новую опцию для вариантов товара, например "Размер" или
            "Цвет"
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
                  <FormDescription>
                    Название опции будет отображаться в каталоге товаров
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Кнопки-заготовки для названий опций */}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick("Размер")}
                className="text-sm"
              >
                Размер
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick("Цвет")}
                className="text-sm"
              >
                Цвет
              </Button>
            </div>

            {/* Кнопки-заготовки для значений опций */}
            {form.watch("name") === "Размер" && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Выберите тип размеров:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handlePresetClick(
                        "Размер",
                        optionPresets.Размер["Размер одежды"],
                      )
                    }
                    className="text-sm"
                  >
                    Размер одежды
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handlePresetClick(
                        "Размер",
                        optionPresets.Размер["Размер обуви (женская)"],
                      )
                    }
                    className="text-sm"
                  >
                    Размер обуви (женская)
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handlePresetClick(
                        "Размер",
                        optionPresets.Размер["Размер обуви (мужская)"],
                      )
                    }
                    className="text-sm"
                  >
                    Размер обуви (мужская)
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handlePresetClick(
                        "Размер",
                        optionPresets.Размер["Размер обуви (детская)"],
                      )
                    }
                    className="text-sm"
                  >
                    Размер обуви (детская)
                  </Button>
                </div>
              </div>
            )}

            {form.watch("name") === "Цвет" && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Выберите палитру цветов:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handlePresetClick(
                        "Цвет",
                        optionPresets.Цвет["Основные цвета"],
                      )
                    }
                    className="text-sm"
                  >
                    Основные цвета
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handlePresetClick(
                        "Цвет",
                        optionPresets.Цвет["Пастельные цвета"],
                      )
                    }
                    className="text-sm"
                  >
                    Пастельные цвета
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handlePresetClick(
                        "Цвет",
                        optionPresets.Цвет["Яркие цвета"],
                      )
                    }
                    className="text-sm"
                  >
                    Яркие цвета
                  </Button>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Значения опции</FormLabel>
                  <FormControl>
                    <TagInput value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormDescription>
                    Введите значения опции по одному, нажимая Enter
                  </FormDescription>
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
