"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Switch } from "@qco/ui/components/switch";
import { Textarea } from "@qco/ui/components/textarea";
import type { bannerFormSchema } from "@qco/validators";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { CategoryHierarchySelect } from "@/components/category-hierarchy-select";
import { useBannerSections } from "../../hooks/use-banner-sections";
import { useCategories } from "../../hooks/use-categories";

// TODO: Использовать тип из схемы пропсов базовой информации баннера, если появится в @qco/validators
type BannerFormData = z.infer<typeof bannerFormSchema>;

interface BannerBasicInfoProps {
  form: UseFormReturn<BannerFormData>;
}

export function BannerBasicInfo({ form }: BannerBasicInfoProps) {
  // Получаем список секций для выпадающего списка
  const sections = useBannerSections();

  // Получаем категории для выпадающего списка
  const { data: categories } = useCategories();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Название баннера</FormLabel>
            <FormControl>
              <Input placeholder="Введите название баннера" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Описание</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Введите описание баннера"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Позиция</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите позицию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Шапка (header)</SelectItem>
                    <SelectItem value="hero">Главный баннер (hero)</SelectItem>
                    <SelectItem value="sidebar">Боковая панель (sidebar)</SelectItem>
                    <SelectItem value="footer">Подвал (footer)</SelectItem>
                    <SelectItem value="content">Контент (content)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="page"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Страница</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите страницу" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Категория</FormLabel>
            <FormControl>
              <CategoryHierarchySelect
                categories={categories || []}
                value={field.value ? [field.value] : []}
                onChange={(values) => field.onChange(values[0] || "")}
                placeholder="Выберите категорию (необязательно)"
                multiple={false}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Порядок сортировки</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-6">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Активен</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Баннер будет отображаться на сайте
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Рекомендуемый</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Баннер будет выделен как рекомендуемый
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
