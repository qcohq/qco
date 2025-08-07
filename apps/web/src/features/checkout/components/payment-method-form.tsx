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
  FormMessage,
} from "@qco/ui/components/form";
import { Label } from "@qco/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@qco/ui/components/radio-group";
import { CreditCard, DollarSign } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface PaymentMethodFormProps {
  form: UseFormReturn<any>;
  mobileFlat?: boolean;
  onBlur?: (fieldName: string) => void;
}

const paymentMethods = [
  {
    id: "cash-on-delivery",
    name: "Наличные курьеру",
    description: "Оплата наличными при получении заказа",
    icon: DollarSign,
  },
  {
    id: "card-on-delivery",
    name: "Банковской картой курьеру",
    description: "Оплата картой при получении заказа",
    icon: CreditCard,
  },
];

export function PaymentMethodForm({ form, mobileFlat = false, onBlur }: PaymentMethodFormProps) {
  return (
    <Card className={mobileFlat ? "border-0 rounded-none shadow-none p-0 sm:rounded-xl sm:border sm:shadow-sm sm:p-0" : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Способ оплаты
        </CardTitle>
        <CardDescription>Выберите удобный способ оплаты</CardDescription>
      </CardHeader>
      <CardContent className={mobileFlat ? "px-0" : "px-6 py-6"}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    onBlur={field.onBlur}
                    className="grid gap-3"
                  >
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <Label
                          className={
                            "has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary/5 flex items-start gap-3 rounded-lg border p-3 w-full" +
                            (mobileFlat ? " border-0 bg-transparent p-2" : "")
                          }
                          key={method.id}
                        >
                          <RadioGroupItem
                            value={method.id}
                            id={method.id}
                            className="data-[state=checked]:border-primary"
                          />
                          <div className="grid gap-1 font-normal">
                            <div className="flex items-center gap-2 font-medium">
                              <IconComponent className="h-5 w-5" />
                              {method.name}
                            </div>
                            <div className="text-muted-foreground pr-2 text-xs leading-snug text-balance">
                              {method.description}
                            </div>
                          </div>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
