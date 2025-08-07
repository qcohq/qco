import { Badge } from "@qco/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import { Clock, CreditCard, MapPin, Phone, Shield, Truck } from "lucide-react";

const deliveryOptions = [
  {
    title: "Курьерская доставка по Москве",
    price: "Бесплатно от 10 000 ₽",
    time: "В день заказа или на следующий день",
    description:
      "Доставка в пределах МКАД с 10:00 до 22:00. Возможность выбора удобного времени.",
    icon: Truck,
  },
  {
    title: "Курьерская доставка по России",
    price: "От 1 500 ₽",
    time: "2-5 рабочих дней",
    description:
      "Доставка в крупные города России. Стоимость рассчитывается индивидуально.",
    icon: MapPin,
  },
  {
    title: "Экспресс-доставка",
    price: "2 500 ₽",
    time: "В течение 3 часов",
    description:
      "Срочная доставка по Москве в пределах МКАД. Доступна с 10:00 до 20:00.",
    icon: Clock,
  },
  {
    title: "Самовывоз из бутика",
    price: "Бесплатно",
    time: "Через 2 часа после заказа",
    description: "Забрать заказ можно в любом из наших бутиков в Москве.",
    icon: Phone,
  },
];

const paymentMethods = [
  {
    title: "Банковские карты",
    description: "Visa, MasterCard, МИР, American Express",
    secure: true,
  },
  {
    title: "Наличными при получении",
    description: "Оплата курьеру или в бутике при получении заказа",
    secure: false,
  },
  {
    title: "Банковский перевод",
    description: "Для юридических лиц и крупных покупок",
    secure: true,
  },
  {
    title: "Рассрочка 0%",
    description: "Беспроцентная рассрочка до 12 месяцев от банков-партнеров",
    secure: true,
  },
];

const deliveryZones = [
  {
    zone: "Москва (в пределах МКАД)",
    price: "Бесплатно от 10 000 ₽",
    time: "В день заказа",
  },
  { zone: "Московская область", price: "От 800 ₽", time: "1-2 дня" },
  { zone: "Санкт-Петербург", price: "От 1 200 ₽", time: "2-3 дня" },
  { zone: "Крупные города России", price: "От 1 500 ₽", time: "3-5 дней" },
  { zone: "Регионы России", price: "От 2 000 ₽", time: "5-10 дней" },
  { zone: "Международная доставка", price: "По запросу", time: "7-14 дней" },
];

export default function DeliveryPage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold">
          Доставка и оплата
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Мы предлагаем удобные способы доставки и оплаты для вашего комфорта
        </p>
      </div>

      {/* Delivery Options */}
      <section className="space-y-6">
        <h2 className="font-playfair text-3xl font-bold text-center">
          Способы доставки
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {deliveryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.title} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    {option.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">
                      {option.price}
                    </span>
                    <Badge variant="outline">{option.time}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {option.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="space-y-6">
        <h2 className="font-playfair text-3xl font-bold text-center">
          Зоны доставки
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">
                      Зона доставки
                    </th>
                    <th className="text-left p-4 font-semibold">Стоимость</th>
                    <th className="text-left p-4 font-semibold">
                      Срок доставки
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryZones.map((zone, index) => (
                    <tr
                      key={zone.zone}
                      className={
                        index !== deliveryZones.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-4">{zone.zone}</td>
                      <td className="p-4 font-medium">{zone.price}</td>
                      <td className="p-4 text-muted-foreground">{zone.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Payment Methods */}
      <section className="space-y-6">
        <h2 className="font-playfair text-3xl font-bold text-center">
          Способы оплаты
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <Card key={method.title} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {method.title}
                  </span>
                  {method.secure && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      Безопасно
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {method.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Important Information */}
      <section className="space-y-6">
        <h2 className="font-playfair text-3xl font-bold text-center">
          Важная информация
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Условия доставки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Бесплатная доставка по Москве при заказе от 10 000 ₽</p>
              <p>• Доставка осуществляется в рабочие дни с 10:00 до 22:00</p>
              <p>• Возможность выбора удобного времени доставки</p>
              <p>• SMS-уведомления о статусе заказа</p>
              <p>• Примерка товаров при получении</p>
              <p>• Возможность частичного возврата заказа</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Безопасность платежей</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• SSL-шифрование всех платежных данных</p>
              <p>• Соответствие стандарту PCI DSS</p>
              <p>• 3D Secure аутентификация</p>
              <p>• Возврат средств в течение 14 дней</p>
              <p>• Защита от мошеннических операций</p>
              <p>• Конфиденциальность личных данных</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-gray-50 rounded-lg p-8">
        <div className="text-center space-y-4">
          <h3 className="font-playfair text-2xl font-bold">
            Остались вопросы?
          </h3>
          <p className="text-muted-foreground">
            Наши консультанты готовы помочь вам с выбором способа доставки и
            оплаты
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span className="font-medium">+7 (495) 123-45-67</span>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-6" />
            <span className="text-muted-foreground">support@eleganter.ru</span>
          </div>
        </div>
      </section>
    </div>
  );
}
