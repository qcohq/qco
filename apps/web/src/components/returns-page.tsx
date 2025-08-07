import { Badge } from "@qco/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  RotateCcw,
} from "lucide-react";

const returnSteps = [
  {
    step: 1,
    title: "Подача заявки",
    description:
      "Оформите возврат в личном кабинете или обратитесь к консультанту",
    icon: Package,
  },
  {
    step: 2,
    title: "Упаковка товара",
    description: "Упакуйте товар в оригинальную упаковку с бирками и чеком",
    icon: Package,
  },
  {
    step: 3,
    title: "Передача курьеру",
    description: "Передайте товар курьеру или принесите в любой наш бутик",
    icon: RotateCcw,
  },
  {
    step: 4,
    title: "Возврат средств",
    description: "Деньги поступят на вашу карту в течение 5-10 рабочих дней",
    icon: CreditCard,
  },
];

const returnConditions = [
  {
    title: "Срок возврата",
    description: "14 дней с момента получения товара",
    icon: Clock,
    color: "text-blue-600",
  },
  {
    title: "Состояние товара",
    description: "Товар должен быть в оригинальной упаковке с бирками",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Документы",
    description: "Необходим чек или документ, подтверждающий покупку",
    icon: AlertCircle,
    color: "text-orange-600",
  },
];

const nonReturnableItems = [
  "Нижнее белье и купальники",
  "Парфюмерия и косметика (вскрытая упаковка)",
  "Украшения по индивидуальному заказу",
  "Товары с персональной гравировкой",
  "Подарочные карты",
];

export default function ReturnsPage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold">
          Возврат и обмен
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Мы гарантируем простой и удобный процесс возврата товаров в течение 14
          дней
        </p>
      </div>

      {/* Return Conditions */}
      <section className="grid md:grid-cols-3 gap-6">
        {returnConditions.map((condition) => {
          const Icon = condition.icon;
          return (
            <Card key={condition.title} className="text-center">
              <CardHeader>
                <div
                  className={
                    "w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
                  }
                >
                  <Icon className={`h-6 w-6 ${condition.color}`} />
                </div>
                <CardTitle className="text-lg">{condition.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{condition.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Return Process */}
      <section className="space-y-8">
        <h2 className="font-playfair text-3xl font-bold text-center">
          Как оформить возврат
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {returnSteps.map((step) => {
            const _Icon = step.icon;
            return (
              <Card key={step.step} className="relative">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    {step.step}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
                {step.step < returnSteps.length && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-300" />
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Detailed Information */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* What can be returned */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Условия возврата
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Товар в идеальном состоянии</p>
                  <p className="text-sm text-muted-foreground">
                    Без следов использования, в оригинальной упаковке
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Все бирки и этикетки</p>
                  <p className="text-sm text-muted-foreground">
                    Фирменные бирки должны быть сохранены
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Документ о покупке</p>
                  <p className="text-sm text-muted-foreground">
                    Чек, счет или подтверждение заказа
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">
                  ✓
                </Badge>
                <div>
                  <p className="font-medium">Срок возврата</p>
                  <p className="text-sm text-muted-foreground">
                    В течение 14 дней с момента получения
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What cannot be returned */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Товары, не подлежащие возврату
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nonReturnableItems.map((item, index) => (
                <div key={`non-returnable-${item}-${index}`} className="flex items-start gap-3">
                  <Badge variant="destructive" className="mt-0.5">
                    ✗
                  </Badge>
                  <p className="text-sm">{item}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground">
              * Согласно Закону РФ "О защите прав потребителей" и
              санитарно-эпидемиологическим требованиям
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Information */}
      <section className="space-y-6">
        <h2 className="font-playfair text-3xl font-bold text-center">
          Обмен товаров
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Обмен на другой размер</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Бесплатный обмен в течение 14 дней</p>
              <p>• Доступен в бутиках и через курьерскую службу</p>
              <p>• При отсутствии нужного размера — полный возврат</p>
              <p>• Уведомление о поступлении товара на email</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Обмен на другой товар</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Возможен при равной или большей стоимости</p>
              <p>• Доплата принимается любым удобным способом</p>
              <p>• При меньшей стоимости — возврат разницы</p>
              <p>• Консультация стилиста при выборе</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="font-playfair text-2xl font-bold mb-4">
          Нужна помощь с возвратом?
        </h3>
        <p className="text-muted-foreground mb-6">
          Наши консультанты помогут оформить возврат и ответят на все вопросы
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">+7 (495) 123-45-67</span>
          </div>
          <Separator orientation="vertical" className="hidden sm:block h-6" />
          <span className="text-muted-foreground">returns@eleganter.ru</span>
          <Separator orientation="vertical" className="hidden sm:block h-6" />
          <span className="text-muted-foreground">
            Ежедневно с 10:00 до 22:00
          </span>
        </div>
      </section>
    </div>
  );
}
