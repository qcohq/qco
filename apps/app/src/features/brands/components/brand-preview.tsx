"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Edit, ExternalLink, Globe } from "lucide-react";
import Image from "next/image";

// TODO: Использовать тип из схемы пропсов предпросмотра бренда, если появится в @qco/validators

interface BrandPreviewData {
  name?: string;
  description?: string;
  bannerImage?: string;
  logo?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  foundedYear?: number;
  countryOfOrigin?: string;
  website?: string;
}

export function BrandPreview({ brand, onEdit }: { brand: BrandPreviewData; onEdit: () => void }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="relative p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={
                brand.bannerImage ||
                "/placeholder.svg?height=300&width=1200&query=brand banner"
              }
              alt={`${brand.name} banner`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border-4 border-white bg-white">
                <Image
                  src={brand.logo || "/generic-brand-logo.png"}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {brand.name || "Название бренда"}
                </h1>
                <div className="mt-1 flex gap-2">
                  {brand.isActive && <Badge>Активен</Badge>}
                  {brand.isFeatured && (
                    <Badge variant="outline" className="bg-white/20">
                      Избранный
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white/80 hover:bg-white"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Редактировать</span>
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              <div>
                <h2 className="mb-2 text-xl font-semibold">О бренде</h2>
                <p className="text-muted-foreground">
                  {brand.description || "Описание бренда отсутствует."}
                </p>
              </div>

              <div>
                <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                  Информация
                </h3>
                <div className="flex flex-wrap gap-2">
                  {brand.foundedYear && (
                    <Badge variant="outline">
                      Основан в {brand.foundedYear}
                    </Badge>
                  )}
                  {brand.countryOfOrigin && (
                    <Badge variant="outline">
                      Страна: {brand.countryOfOrigin}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Веб-присутствие</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {brand.website && (
                    <div>
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary flex items-center gap-1.5 text-sm"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        Веб-сайт
                        <ExternalLink className="ml-auto h-3 w-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Предпросмотр</CardTitle>
                  <CardDescription>
                    Так бренд будет выглядеть на сайте
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center rounded-lg border p-4 text-center">
                    <div className="relative mb-2 h-16 w-16">
                      <Image
                        src={brand.logo || "/generic-brand-logo.png"}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-medium">
                      {brand.name || "Название бренда"}
                    </h3>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {brand.shortDescription ||
                        brand.description ||
                        "Описание бренда отсутствует."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Редактировать
        </Button>
      </div>
    </div>
  );
}
