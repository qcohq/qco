"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Button } from "@qco/ui/components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Mail, Phone, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface ContactInformationFormProps {
  form: UseFormReturn<any>;
  dataMode?: "profile" | "manual";
  onUseProfileData?: () => void;
  onUseManualInput?: () => void;
  isAuthenticated?: boolean;
  hasProfileData?: boolean;
  mobileFlat?: boolean;
  onBlur?: (fieldName: string) => void;
}

export function ContactInformationForm({
  form,
  dataMode,
  onUseProfileData,
  onUseManualInput,
  isAuthenticated,
  hasProfileData,
  mobileFlat = false,
  onBlur,
}: ContactInformationFormProps) {
  return (
    <Card
      className={mobileFlat ? "border-0 rounded-none shadow-none p-0 sm:rounded-xl sm:border sm:shadow-sm sm:p-0" : undefined}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Контактная информация
            </CardTitle>
            <CardDescription>
              Укажите ваши контактные данные для связи
            </CardDescription>
          </div>
          {isAuthenticated && hasProfileData && (
            <div className="flex gap-2">
              {dataMode === "profile" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onUseManualInput}
                  className="text-xs"
                >
                  Ввести вручную
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onUseProfileData}
                  className="text-xs"
                >
                  Использовать профиль
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className={mobileFlat ? "px-0" : "px-6 py-6"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя *</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван" {...field} className="w-full" onBlur={() => onBlur?.("firstName")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия *</FormLabel>
                  <FormControl>
                    <Input placeholder="Иванов" {...field} className="w-full" onBlur={() => onBlur?.("lastName")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+7 (999) 123-45-67"
                      type="tel"
                      {...field}
                      className="w-full"
                      onBlur={() => onBlur?.("phone")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ivan@example.com"
                      type="email"
                      {...field}
                      className="w-full"
                      onBlur={() => onBlur?.("email")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
