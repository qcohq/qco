"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@qco/ui/components/drawer";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@qco/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Separator } from "@qco/ui/components/separator";
import { Slider } from "@qco/ui/components/slider";
import { Switch } from "@qco/ui/components/switch";
import { Filter, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// TODO: Использовать тип из схемы пропсов мобильной панели фильтров, если появится в @qco/validators
interface MobileFilterPanelProps {
  onApplyFilters?: (filters: Record<string, unknown>) => void;
}

export function MobileFilterPanel({ onApplyFilters }: MobileFilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Filter state
  const [statusFilters, setStatusFilters] = useState({
    pending: false,
    processing: false,
    shipped: false,
    delivered: false,
    cancelled: false,
  });

  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [dateSort, setDateSort] = useState("newest");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleApplyFilters = () => {
    // Count active filters
    let count = 0;
    if (Object.values(statusFilters).some((v) => v)) count++;
    if (priceRange[0] > 0 || priceRange[1] < 20000) count++;
    if (paymentMethod) count++;

    setActiveFilters(count);

    // Close the drawer
    setOpen(false);

    // Call the callback with filter data
    if (onApplyFilters) {
      onApplyFilters({
        statusFilters,
        priceRange,
        dateSort,
        paymentMethod,
      });
    }
  };

  const handleResetFilters = () => {
    setStatusFilters({
      pending: false,
      processing: false,
      shipped: false,
      delivered: false,
      cancelled: false,
    });
    setPriceRange([0, 20000]);
    setDateSort("newest");
    setPaymentMethod("");
    setActiveFilters(0);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="relative flex gap-2">
          <Filter className="h-4 w-4" />
          <span>Фильтры</span>
          {activeFilters > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {activeFilters}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent
        ref={ref}
        className={cn(
          "bg-background fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[85vh] max-w-full flex-col overflow-hidden rounded-t-[10px] border",
        )}
      >
        <DrawerHeader className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
          <DrawerTitle>Фильтры заказов</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Закрыть</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="space-y-5 overflow-y-auto px-4 py-3">
          {/* Статус заказа */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Статус заказа</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-pending"
                  checked={statusFilters.pending}
                  onCheckedChange={(checked) =>
                    setStatusFilters((prev) => ({
                      ...prev,
                      pending: checked === true,
                    }))
                  }
                />
                <Label htmlFor="status-pending" className="text-sm">
                  Ожидает оплаты
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-processing"
                  checked={statusFilters.processing}
                  onCheckedChange={(checked) =>
                    setStatusFilters((prev) => ({
                      ...prev,
                      processing: checked === true,
                    }))
                  }
                />
                <Label htmlFor="status-processing" className="text-sm">
                  Обработка
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-shipped"
                  checked={statusFilters.shipped}
                  onCheckedChange={(checked) =>
                    setStatusFilters((prev) => ({
                      ...prev,
                      shipped: checked === true,
                    }))
                  }
                />
                <Label htmlFor="status-shipped" className="text-sm">
                  Отправлен
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-delivered"
                  checked={statusFilters.delivered}
                  onCheckedChange={(checked) =>
                    setStatusFilters((prev) => ({
                      ...prev,
                      delivered: checked === true,
                    }))
                  }
                />
                <Label htmlFor="status-delivered" className="text-sm">
                  Доставлен
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status-cancelled"
                  checked={statusFilters.cancelled}
                  onCheckedChange={(checked) =>
                    setStatusFilters((prev) => ({
                      ...prev,
                      cancelled: checked === true,
                    }))
                  }
                />
                <Label htmlFor="status-cancelled" className="text-sm">
                  Отменен
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Диапазон цен */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Сумма заказа</h3>
              <span className="text-muted-foreground text-sm">
                {priceRange[0].toLocaleString("ru-RU")} ₽ -{" "}
                {priceRange[1].toLocaleString("ru-RU")} ₽
              </span>
            </div>
            <Slider
              defaultValue={[0, 20000]}
              max={20000}
              step={500}
              value={priceRange}
              onValueChange={setPriceRange}
              className="py-4"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="От"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([
                    Number.parseInt(e.target.value) || 0,
                    priceRange[1],
                  ])
                }
                className="h-10 w-full min-w-0 text-base"
                inputMode="numeric"
              />
              <span className="shrink-0">-</span>
              <Input
                type="number"
                placeholder="До"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([
                    priceRange[0],
                    Number.parseInt(e.target.value) || 20000,
                  ])
                }
                className="h-10 w-full min-w-0 text-base"
                inputMode="numeric"
              />
            </div>
          </div>

          <Separator />

          {/* Сортировка по дате */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Сортировка по дате</h3>
            <RadioGroup
              defaultValue="newest"
              value={dateSort}
              onValueChange={setDateSort}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest" className="text-sm">
                  Сначала новые
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="oldest" id="oldest" />
                <Label htmlFor="oldest" className="text-sm">
                  Сначала старые
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Способ оплаты */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Способ оплаты</h3>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Выберите способ оплаты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Кредитная карта</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank">Банковский перевод</SelectItem>
                <SelectItem value="cash">Наличные</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Дополнительные опции */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Дополнительные опции</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="only-with-comments" className="text-sm">
                  Только с комментариями
                </Label>
                <Switch id="only-with-comments" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="has-issues" className="text-sm">
                  С проблемами доставки
                </Label>
                <Switch id="has-issues" />
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="bg-background sticky bottom-0 z-10 border-t px-4 py-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-10 flex-1"
              onClick={handleResetFilters}
            >
              Сбросить
            </Button>
            <Button className="h-10 flex-1" onClick={handleApplyFilters}>
              Применить
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
