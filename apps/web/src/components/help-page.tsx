"use client";

import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { Input } from "@qco/ui/components/input";
import {
  ChevronDown,
  ChevronRight,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { useState } from "react";

const faqCategories = [
  {
    title: "Заказы и доставка",
    questions: [
      {
        question: "Как отследить мой заказ?",
        answer:
          "После оформления заказа вы получите номер для отслеживания на email. Также вы можете отследить заказ в личном кабинете в разделе 'Мои заказы'. SMS-уведомления будут приходить на каждом этапе доставки.",
      },
      {
        question: "Сколько стоит доставка?",
        answer:
          "Доставка по Москве бесплатна при заказе от 10 000 ₽. Стандартная доставка по Москве стоит 800 ₽, экспресс-доставка — 2 500 ₽. Доставка в регионы от 1 500 ₽, стоимость рассчитывается индивидуально.",
      },
      {
        question: "Можно ли изменить адрес доставки?",
        answer:
          "Да, вы можете изменить адрес доставки до момента передачи заказа в службу дост��вки. Обратитесь к нашим консультантам по телефону +7 (495) 123-45-67 или через чат на сайте.",
      },
      {
        question: "Что делать, если товар не подошел?",
        answer:
          "Вы можете вернуть товар в течение 14 дней с момента получения. Товар должен быть в оригинальной упаковке с бирками. Возврат возможен в любом из наших бутиков или через курьера.",
      },
    ],
  },
  {
    title: "Оплата и возврат",
    questions: [
      {
        question: "Какие способы оплаты доступны?",
        answer:
          "Мы принимаем банковские карты (Visa, MasterCard, МИР), наличные при получении, банковские переводы для юридических лиц, а также предлагаем рассрочку 0% до 12 месяцев.",
      },
      {
        question: "Безопасно ли платить картой на сайте?",
        answer:
          "Да, все платежи защищены SSL-шифрованием и соответствуют стандарту PCI DSS. Мы используем 3D Secure аутентификацию для дополнительной безопасности.",
      },
      {
        question: "Как получить возврат денег?",
        answer:
          "Возврат средств осуществляется на карту, с которой была произведена оплата, в течение 5-10 рабочих дней. При оплате наличными возврат производится в кассе бутика.",
      },
      {
        question: "Можно ли обменять товар?",
        answer:
          "Да, обмен возможен в течение 14 дней при наличии чека и сохранении товарного вида. Обмен производится в бутиках или через службу доставки.",
      },
    ],
  },
  {
    title: "Размеры и примерка",
    questions: [
      {
        question: "Как выбрать правильный размер?",
        answer:
          "На странице каждого товара есть подробная таблица размеров. Также вы можете воспользоваться услугой персонального стилиста или примерить товар в наших бутиках.",
      },
      {
        question: "Можно ли примерить товар при доставке?",
        answer:
          "Да, при курьерской доставке вы можете примерить товар и отказаться от покупки, если он не подошел. Курьер дождется вашего решения.",
      },
      {
        question: "Что делать, если размер не подошел?",
        answer:
          "Вы можете обменять товар на другой размер бесплатно в течение 14 дней. Обмен возможен в бутике или через курьерскую службу.",
      },
    ],
  },
  {
    title: "Аккаунт и программа лояльности",
    questions: [
      {
        question: "Как создать аккаунт?",
        answer:
          "Нажмите 'Войти' в правом верхнем углу сайта, затем 'Регистрация'. Заполните форму с вашими данными. После регистрации вы получите доступ к персональным предложениям и истории заказов.",
      },
      {
        question: "Как работает программа лояльности?",
        answer:
          "За каждую покупку вы получаете бонусные баллы (1% от суммы покупки). Баллы можно тратить на следующие покупки. Также доступны эксклюзивные предложения для участников программы.",
      },
      {
        question: "Как восстановить пароль?",
        answer:
          "На странице входа нажмите 'Забыли пароль?', введите ваш email. Мы отправим инструкции по восстановлению пароля на указанную почту.",
      },
    ],
  },
];

const contactOptions = [
  {
    title: "Телефон",
    description: "+7 (495) 123-45-67",
    subtitle: "Ежедневно с 10:00 до 22:00",
    icon: Phone,
  },
  {
    title: "Онлайн-чат",
    description: "Быстрые ответы на вопросы",
    subtitle: "Доступен на сайте",
    icon: MessageCircle,
  },
  {
    title: "Email",
    description: "support@eleganter.ru",
    subtitle: "Ответим в течение 24 часов",
    icon: Mail,
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold">
          Центр поддержки
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Найдите ответы на часто задаваемые вопросы или свяжитесь с нашей
          службой поддержки
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Поиск по вопросам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base"
          />
        </div>
      </div>

      {/* Contact Options */}
      <section className="grid md:grid-cols-3 gap-6">
        {contactOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.title}
              className="text-center hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-1">{option.description}</p>
                <p className="text-sm text-muted-foreground">
                  {option.subtitle}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* FAQ */}
      <section className="space-y-8">
        <h2 className="font-playfair text-3xl font-bold text-center">
          Часто задаваемые вопросы
        </h2>

        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                По вашему запросу ничего не найдено
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Показать все вопросы
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChevronRight className="h-5 w-5" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.questions.map((faq, index) => {
                    const itemId = `${category.title}-${index}`;
                    const isOpen = openItems.includes(itemId);

                    return (
                      <Collapsible key={`faq-${category.title}-${index}`}>
                        <CollapsibleTrigger
                          className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => toggleItem(itemId)}
                        >
                          <span className="font-medium">{faq.question}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Still Need Help */}
      <section className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="font-playfair text-2xl font-bold mb-4">
          Не нашли ответ на свой вопрос?
        </h3>
        <p className="text-muted-foreground mb-6">
          Наши консультанты готовы помочь вам в любое время
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <Phone className="h-4 w-4 mr-2" />
            Позвонить
          </Button>
          <Button variant="outline" size="lg">
            <MessageCircle className="h-4 w-4 mr-2" />
            Написать в чат
          </Button>
        </div>
      </section>
    </div>
  );
}
