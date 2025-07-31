"use client";

import { Button } from "@qco/ui/components/button";
import { Calendar } from "@qco/ui/components/calendar";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@qco/ui/components/popover";
import { Separator } from "@qco/ui/components/separator";
import { cn } from "@qco/ui/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface OrderFiltersProps {
  className?: string;
}

export function OrderFilters({ className }: OrderFiltersProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="mb-2 text-sm font-medium">Статус заказа</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="status-all" />
            <label
              htmlFor="status-all"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Все статусы
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-pending" />
            <label
              htmlFor="status-pending"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Ожидает оплаты
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-processing" />
            <label
              htmlFor="status-processing"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Обработка
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-shipped" />
            <label
              htmlFor="status-shipped"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Отправлен
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-delivered" />
            <label
              htmlFor="status-delivered"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Доставлен
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="status-cancelled" />
            <label
              htmlFor="status-cancelled"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Отменен
            </label>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2 text-sm font-medium">Дата заказа</h3>
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-from"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? (
                    format(dateFrom, "PPP", { locale: ru })
                  ) : (
                    <span>От</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-to"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? (
                    format(dateTo, "PPP", { locale: ru })
                  ) : (
                    <span>До</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="w-full">
              Применить
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
            >
              Сбросить
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
          Способ оплаты
          <span className="text-muted-foreground text-xs">Показать</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="payment-all" />
            <label
              htmlFor="payment-all"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Все способы
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="payment-card" />
            <label
              htmlFor="payment-card"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Кредитная карта
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="payment-paypal" />
            <label
              htmlFor="payment-paypal"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              PayPal
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="payment-bank" />
            <label
              htmlFor="payment-bank"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Банковский перевод
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
          Сумма заказа
          <span className="text-muted-foreground text-xs">Показать</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="От"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="До"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="w-full">
              Применить
            </Button>
            <Button variant="ghost" size="sm" className="w-full">
              Сбросить
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <div className="flex flex-col gap-2">
        <Button className="w-full">Применить фильтры</Button>
        <Button variant="outline" className="w-full">
          Сбросить все
        </Button>
      </div>
    </div>
  );
}
