"use client";

import { Button } from "@qco/ui/components/button";
import { Calendar } from "@qco/ui/components/calendar";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@qco/ui/components/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@qco/ui/components/popover";
import { Separator } from "@qco/ui/components/separator";
import { Slider } from "@qco/ui/components/slider";
import { Switch } from "@qco/ui/components/switch";
import { cn } from "@qco/ui/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";

// TODO: Использовать тип из схемы пропсов фильтров клиентов, если появится в @qco/validators
interface CustomerFiltersProps {
  filters: {
    customerGroup: string;
    registrationDate: Date | null;
    orderCountMin: number | undefined;
    orderCountMax: number | undefined;
    spentAmountMin: number | undefined;
    spentAmountMax: number | undefined;
    showActive: boolean;
    showInactive: boolean;
    isVip: boolean | undefined;
  };
  onFiltersChange: (filters: {
    customerGroup: string;
    registrationDate: Date | null;
    orderCountMin: number | undefined;
    orderCountMax: number | undefined;
    spentAmountMin: number | undefined;
    spentAmountMax: number | undefined;
    showActive: boolean;
    showInactive: boolean;
    isVip: boolean | undefined;
  }) => void;
}

export function CustomerFilters({ filters, onFiltersChange }: CustomerFiltersProps) {
  const [registrationDate, setRegistrationDate] = useState<Date | null>(filters.registrationDate);
  const [orderCount, setOrderCount] = useState([filters.orderCountMin || 0, filters.orderCountMax || 10]);
  const [spentAmount, setSpentAmount] = useState([filters.spentAmountMin || 0, filters.spentAmountMax || 50000]);
  const [showActive, setShowActive] = useState(filters.showActive);
  const [showInactive, setShowInactive] = useState(filters.showInactive);
  const [isVip, setIsVip] = useState(filters.isVip || false);

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setRegistrationDate(filters.registrationDate);
    setOrderCount([filters.orderCountMin || 0, filters.orderCountMax || 10]);
    setSpentAmount([filters.spentAmountMin || 0, filters.spentAmountMax || 50000]);
    setShowActive(filters.showActive);
    setShowInactive(filters.showInactive);
    setIsVip(filters.isVip || false);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange({
      ...filters,
      registrationDate,
      orderCountMin: orderCount[0] === 0 ? undefined : orderCount[0],
      orderCountMax: orderCount[1] === 10 ? undefined : orderCount[1],
      spentAmountMin: spentAmount[0] === 0 ? undefined : spentAmount[0],
      spentAmountMax: spentAmount[1] === 50000 ? undefined : spentAmount[1],
      showActive,
      showInactive,
      isVip: isVip || undefined,
    });
  };

  const handleResetFilters = () => {
    setRegistrationDate(null);
    setOrderCount([0, 10]);
    setSpentAmount([0, 50000]);
    setShowActive(true);
    setShowInactive(true);
    setIsVip(false);

    onFiltersChange({
      ...filters,
      registrationDate: null,
      orderCountMin: undefined,
      orderCountMax: undefined,
      spentAmountMin: undefined,
      spentAmountMax: undefined,
      showActive: true,
      showInactive: true,
      isVip: undefined,
    });
  };

  return (
    <div className="space-y-3 py-2">
      <DropdownMenuLabel className="text-xs sm:text-sm">
        Фильтры клиентов
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <div className="space-y-1 px-2 py-1 sm:space-y-2">
        <p className="text-xs font-medium">Дата регистрации</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full justify-start text-left text-xs font-normal",
                !registrationDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {registrationDate
                ? format(registrationDate, "PPP", { locale: ru })
                : "Выберите дату"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={registrationDate || undefined}
              onSelect={(date) => setRegistrationDate(date || null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      <div className="space-y-1 px-2 py-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">Количество заказов</p>
          <p className="text-muted-foreground text-xs">
            {orderCount[0]} - {orderCount[1]}
          </p>
        </div>
        <Slider
          defaultValue={[0, 10]}
          max={20}
          step={1}
          value={orderCount}
          onValueChange={setOrderCount}
          className="py-1 sm:py-2"
        />
      </div>

      <Separator />

      <div className="space-y-1 px-2 py-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">Сумма покупок (₽)</p>
          <p className="text-muted-foreground text-xs">
            {spentAmount[0]} - {spentAmount[1]}
          </p>
        </div>
        <Slider
          defaultValue={[0, 50000]}
          max={100000}
          step={1000}
          value={spentAmount}
          onValueChange={setSpentAmount}
          className="py-1 sm:py-2"
        />
      </div>

      <Separator />

      <div className="space-y-1 px-2 py-1 sm:space-y-2">
        <p className="text-xs font-medium">Статус клиента</p>
        <div className="space-y-1 sm:space-y-2">
          <DropdownMenuCheckboxItem
            checked={showActive}
            onCheckedChange={setShowActive}
            className="text-xs capitalize"
          >
            Активные
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showInactive}
            onCheckedChange={setShowInactive}
            className="text-xs capitalize"
          >
            Неактивные
          </DropdownMenuCheckboxItem>
        </div>
      </div>

      <Separator />

      <div className="space-y-1 px-2 py-1 sm:space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="vip-customers"
            checked={isVip}
            onCheckedChange={setIsVip}
          />
          <label
            htmlFor="vip-customers"
            className="cursor-pointer text-xs font-medium"
          >
            Только VIP клиенты
          </label>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col justify-between gap-2 px-2 pt-2 sm:flex-row">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs sm:w-auto"
          onClick={handleResetFilters}
        >
          Сбросить
        </Button>
        <Button
          size="sm"
          className="w-full text-xs sm:w-auto"
          onClick={handleApplyFilters}
        >
          Применить
        </Button>
      </div>
    </div>
  );
}
