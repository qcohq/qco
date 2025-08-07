import { Card, CardContent } from "@qco/ui/components/card";
import { Award, Globe, Heart, Users } from "lucide-react";
import Image from "next/image";

const stats = [
  { label: "Лет на рынке", value: "167", icon: Award },
  { label: "Довольных клиентов", value: "1M+", icon: Users },
  { label: "Стран доставки", value: "50+", icon: Globe },
  { label: "Брендов-партнеров", value: "700+", icon: Heart },
];

const timeline = [
  {
    year: "1857",
    title: "Основание компании",
    description: "Открытие первого магазина в центре Москвы",
  },
  {
    year: "1900",
    title: "Расширение ассортимента",
    description: "Добавление коллекций европейских брендов",
  },
  {
    year: "1990",
    title: "Международное признание",
    description: "Партнерство с ведущими мировыми брендами",
  },
  {
    year: "2010",
    title: "Цифровая трансформация",
    description: "Запуск интернет-магазина и мобильного приложения",
  },
  {
    year: "2024",
    title: "Инновации и устойчивость",
    description: "Внедрение экологичных практик и новых технологий",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="font-playfair text-4xl md:text-6xl font-bold">
          О компании Eleganter
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Более 160 лет мы создаем мир роскоши и изысканности, предлагая нашим
          клиентам лучшие коллекции от ведущих мировых брендов
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="text-center">
              <CardContent className="p-6">
                <Icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Story Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold">
            Наша история
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Eleganter был основан в 1857 году как небольшой магазин изысканных
              товаров в самом сердце Москвы. С тех пор мы прошли долгий путь,
              превратившись в один из ведущих универмагов класса люкс в России.
            </p>
            <p>
              Наша миссия остается неизменной: предоставлять нашим клиентам
              доступ к самым эксклюзивным и качественным товарам от лучших
              мировых брендов, сочетая традиции с инновациями.
            </p>
            <p>
              Сегодня Eleganter — это не просто магазин, это место, где
              встречаются искусство, мода и роскошь, создавая уникальный опыт
              для каждого посетителя.
            </p>
          </div>
        </div>
        <div className="relative">
          <Image
            src="/placeholder.svg?height=600&width=500"
            alt="История LUXE"
            width={500}
            height={600}
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Ключевые вехи
          </h2>
          <p className="text-muted-foreground">
            Важные моменты в истории нашей компании
          </p>
        </div>

        <div className="space-y-8">
          {timeline.map((item, _index) => (
            <div key={item.year} className="flex gap-8 items-start">
              <div className="flex-shrink-0 w-20 text-right">
                <div className="font-bold text-2xl text-primary">
                  {item.year}
                </div>
              </div>
              <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mt-2" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 rounded-lg p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Наши ценности
          </h2>
          <p className="text-muted-foreground">
            Принципы, которыми мы руководствуемся в работе
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-xl">Качество</h3>
            <p className="text-muted-foreground">
              Мы работаем только с проверенными брендами и гарантируем
              подлинность каждого товара
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-xl">Сервис</h3>
            <p className="text-muted-foreground">
              Индивидуальный подход к каждому клиенту и высочайший уровень
              обслуживания
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-xl">Страсть</h3>
            <p className="text-muted-foreground">
              Любовь к прекрасному и стремление делиться этой красотой с нашими
              клиентами
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
