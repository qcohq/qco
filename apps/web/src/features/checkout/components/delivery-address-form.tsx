"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Button } from "@qco/ui/components/button";
import { MapPin, ArrowLeft } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface DeliveryAddressFormProps {
  form: UseFormReturn<any>;
  showBackToAddresses?: boolean;
  onBackToAddresses?: () => void;
  mobileFlat?: boolean;
  onBlur?: (fieldName: string) => void;
}

export function DeliveryAddressForm({
  form,
  showBackToAddresses = false,
  onBackToAddresses,
  mobileFlat = false,
  onBlur,
}: DeliveryAddressFormProps) {
  return (
    <Card
      className={mobileFlat ? "border-0 rounded-none shadow-none p-0 sm:rounded-xl sm:border sm:shadow-sm sm:p-0" : undefined}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Адрес доставки
            </CardTitle>
            <CardDescription>Укажите адрес для доставки заказа</CardDescription>
          </div>
          {showBackToAddresses && onBackToAddresses && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBackToAddresses}
              className="h-8"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              К сохранённым адресам
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={mobileFlat ? "px-0" : "px-6 py-6"}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Регион *</FormLabel>
                <FormControl>
                  <Input placeholder="Московская область" {...field} className="w-full" onBlur={() => onBlur?.("state")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Город *</FormLabel>
                  <FormControl>
                    <Input placeholder="Москва" {...field} className="w-full" onBlur={() => onBlur?.("city")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Индекс *</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} className="w-full" onBlur={() => onBlur?.("postalCode")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Улица *</FormLabel>
                <FormControl>
                  <Input placeholder="ул. Тверская" {...field} className="w-full" onBlur={() => onBlur?.("address")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
            <FormField
              control={form.control}
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Квартира</FormLabel>
                  <FormControl>
                    <Input placeholder="45" {...field} className="w-full" onBlur={() => onBlur?.("apartment")} />
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
