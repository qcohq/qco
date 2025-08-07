"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@qco/ui/components/tabs";
import { Footprints, Ruler, Shirt, User } from "lucide-react";
import { useState } from "react";

const womenClothingSizes = [
  {
    size: "XS",
    bust: "80-84",
    waist: "60-64",
    hips: "86-90",
    international: "32-34",
  },
  {
    size: "S",
    bust: "84-88",
    waist: "64-68",
    hips: "90-94",
    international: "34-36",
  },
  {
    size: "M",
    bust: "88-92",
    waist: "68-72",
    hips: "94-98",
    international: "36-38",
  },
  {
    size: "L",
    bust: "92-96",
    waist: "72-76",
    hips: "98-102",
    international: "38-40",
  },
  {
    size: "XL",
    bust: "96-100",
    waist: "76-80",
    hips: "102-106",
    international: "40-42",
  },
  {
    size: "XXL",
    bust: "100-104",
    waist: "80-84",
    hips: "106-110",
    international: "42-44",
  },
];

const menClothingSizes = [
  { size: "XS", chest: "86-90", waist: "76-80", international: "44-46" },
  { size: "S", chest: "90-94", waist: "80-84", international: "46-48" },
  { size: "M", chest: "94-98", waist: "84-88", international: "48-50" },
  { size: "L", chest: "98-102", waist: "88-92", international: "50-52" },
  { size: "XL", chest: "102-106", waist: "92-96", international: "52-54" },
  { size: "XXL", chest: "106-110", waist: "96-100", international: "54-56" },
];

const womenShoesSizes = [
  { eu: "35", us: "5", uk: "2.5", cm: "22.5" },
  { eu: "35.5", us: "5.5", uk: "3", cm: "23" },
  { eu: "36", us: "6", uk: "3.5", cm: "23.5" },
  { eu: "36.5", us: "6.5", uk: "4", cm: "24" },
  { eu: "37", us: "7", uk: "4.5", cm: "24.5" },
  { eu: "37.5", us: "7.5", uk: "5", cm: "25" },
  { eu: "38", us: "8", uk: "5.5", cm: "25.5" },
  { eu: "38.5", us: "8.5", uk: "6", cm: "26" },
  { eu: "39", us: "9", uk: "6.5", cm: "26.5" },
  { eu: "39.5", us: "9.5", uk: "7", cm: "27" },
  { eu: "40", us: "10", uk: "7.5", cm: "27.5" },
  { eu: "40.5", us: "10.5", uk: "8", cm: "28" },
  { eu: "41", us: "11", uk: "8.5", cm: "28.5" },
];

const menShoesSizes = [
  { eu: "39", us: "6.5", uk: "6", cm: "25" },
  { eu: "40", us: "7", uk: "6.5", cm: "25.5" },
  { eu: "40.5", us: "7.5", uk: "7", cm: "26" },
  { eu: "41", us: "8", uk: "7.5", cm: "26.5" },
  { eu: "42", us: "8.5", uk: "8", cm: "27" },
  { eu: "42.5", us: "9", uk: "8.5", cm: "27.5" },
  { eu: "43", us: "9.5", uk: "9", cm: "28" },
  { eu: "44", us: "10", uk: "9.5", cm: "28.5" },
  { eu: "44.5", us: "10.5", uk: "10", cm: "29" },
  { eu: "45", us: "11", uk: "10.5", cm: "29.5" },
  { eu: "46", us: "12", uk: "11.5", cm: "30" },
];

const measurementTips = [
  {
    title: "Обхват груди/грудной клетки",
    description:
      "Измеряйте по самой выступающей части груди, держа сантиметр горизонтально",
    icon: User,
  },
  {
    title: "Обхват талии",
    description: "Измеряйте по самой узкой части талии, обычно на уровне пупка",
    icon: Ruler,
  },
  {
    title: "Обхват бедер",
    description:
      "Измеряйте по самой широкой части бедер, примерно на 20 см ниже талии",
    icon: Shirt,
  },
  {
    title: "Длина стопы",
    description:
      "Измеряйте от пятки до кончика большого пальца, стоя на листе бумаги",
    icon: Footprints,
  },
];

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState("women-clothing");

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold">
          Размерная сетка
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Подробные таблицы размеров для правильного выбора одежды и обуви
        </p>
      </div>

      {/* Measurement Tips */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {measurementTips.map((tip) => {
          const Icon = tip.icon;
          return (
            <Card key={tip.title} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Size Tables */}
      <section className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="women-clothing">Женская одежда</TabsTrigger>
            <TabsTrigger value="men-clothing">Мужская одежда</TabsTrigger>
            <TabsTrigger value="women-shoes">Женская обувь</TabsTrigger>
            <TabsTrigger value="men-shoes">Мужская обувь</TabsTrigger>
          </TabsList>

          <TabsContent value="women-clothing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Размеры женской одежды</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Размер</th>
                        <th className="text-left py-3 px-2">
                          Обхват груди (см)
                        </th>
                        <th className="text-left py-3 px-2">
                          Обхват талии (см)
                        </th>
                        <th className="text-left py-3 px-2">
                          Обхват бедер (см)
                        </th>
                        <th className="text-left py-3 px-2">Международный</th>
                      </tr>
                    </thead>
                    <tbody>
                      {womenClothingSizes.map((size) => (
                        <tr key={size.size} className="border-b">
                          <td className="py-3 px-2 font-medium">{size.size}</td>
                          <td className="py-3 px-2">{size.bust}</td>
                          <td className="py-3 px-2">{size.waist}</td>
                          <td className="py-3 px-2">{size.hips}</td>
                          <td className="py-3 px-2">{size.international}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="men-clothing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Размеры мужской одежды</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Размер</th>
                        <th className="text-left py-3 px-2">
                          Обхват груди (см)
                        </th>
                        <th className="text-left py-3 px-2">
                          Обхват талии (см)
                        </th>
                        <th className="text-left py-3 px-2">Международный</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menClothingSizes.map((size) => (
                        <tr key={size.size} className="border-b">
                          <td className="py-3 px-2 font-medium">{size.size}</td>
                          <td className="py-3 px-2">{size.chest}</td>
                          <td className="py-3 px-2">{size.waist}</td>
                          <td className="py-3 px-2">{size.international}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="women-shoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Размеры женской обуви</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">EU</th>
                        <th className="text-left py-3 px-2">US</th>
                        <th className="text-left py-3 px-2">UK</th>
                        <th className="text-left py-3 px-2">
                          Длина стопы (см)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {womenShoesSizes.map((size) => (
                        <tr key={size.eu} className="border-b">
                          <td className="py-3 px-2 font-medium">{size.eu}</td>
                          <td className="py-3 px-2">{size.us}</td>
                          <td className="py-3 px-2">{size.uk}</td>
                          <td className="py-3 px-2">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="men-shoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Размеры мужской обуви</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">EU</th>
                        <th className="text-left py-3 px-2">US</th>
                        <th className="text-left py-3 px-2">UK</th>
                        <th className="text-left py-3 px-2">
                          Длина стопы (см)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {menShoesSizes.map((size) => (
                        <tr key={size.eu} className="border-b">
                          <td className="py-3 px-2 font-medium">{size.eu}</td>
                          <td className="py-3 px-2">{size.us}</td>
                          <td className="py-3 px-2">{size.uk}</td>
                          <td className="py-3 px-2">{size.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Brand-specific information */}
      <section className="space-y-6">
        <h2 className="font-playfair text-3xl font-bold text-center">
          Особенности размеров брендов
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>CHANEL</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Французская размерная сетка</p>
              <p>• Обычно маломерят на 1 размер</p>
              <p>• Рекомендуем примерку</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HERMÈS</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Соответствует стандартным размерам</p>
              <p>• Кожаные изделия могут растягиваться</p>
              <p>• Консультация при выборе</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GUCCI</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Итальянская размерная сетка</p>
              <p>• Обувь может маломерить</p>
              <p>• Одежда соответствует размеру</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Help section */}
      <section className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="font-playfair text-2xl font-bold mb-4">
          Нужна помощь с выбором размера?
        </h3>
        <p className="text-muted-foreground mb-6">
          Наши консультанты помогут подобрать идеальный размер для любого товара
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <span className="font-medium">+7 (495) 123-45-67</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Персональный стилист</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Примерка в бутике</span>
        </div>
      </section>
    </div>
  );
}
