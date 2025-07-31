import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  BarChart3,
  FileText,
  Package,
  Plus,
  Settings,
  Users,
} from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  variant?: "default" | "outline";
}

const quickActions: QuickAction[] = [
  {
    title: "Добавить продукт",
    description: "Создать новый товар в каталоге",
    icon: Plus,
    href: "/products/new",
  },
  {
    title: "Управление заказами",
    description: "Просмотр и обработка заказов",
    icon: Package,
    href: "/orders",
  },
  {
    title: "Клиенты",
    description: "Управление базой клиентов",
    icon: Users,
    href: "/customers",
  },
  {
    title: "Блог",
    description: "Создание и редактирование статей",
    icon: FileText,
    href: "/blog",
  },
  {
    title: "Аналитика",
    description: "Просмотр статистики продаж",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    title: "Настройки",
    description: "Конфигурация магазина",
    icon: Settings,
    href: "/settings/general",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Быстрые действия</CardTitle>
        <CardDescription>
          Часто используемые функции управления магазином
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant={action.variant || "outline"}
                className="h-auto p-4 justify-start"
                asChild
              >
                <a href={action.href}>
                  <Icon className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
