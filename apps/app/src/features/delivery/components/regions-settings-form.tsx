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
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface RegionsSettingsFormProps {
  selectedRegions: string[];
  onRegionsChange: (regions: string[]) => void;
}

const russianRegions = [
  "Москва",
  "Санкт-Петербург",
  "Московская область",
  "Ленинградская область",
  "Краснодарский край",
  "Ростовская область",
  "Свердловская область",
  "Республика Татарстан",
  "Челябинская область",
  "Нижегородская область",
  "Самарская область",
  "Республика Башкортостан",
  "Красноярский край",
  "Пермский край",
  "Воронежская область",
  "Волгоградская область",
  "Саратовская область",
  "Тюменская область",
  "Оренбургская область",
  "Иркутская область",
];

export function RegionsSettingsForm({
  selectedRegions,
  onRegionsChange,
}: RegionsSettingsFormProps) {
  const [newRegion, setNewRegion] = useState("");

  const addRegion = () => {
    if (newRegion && !selectedRegions.includes(newRegion)) {
      onRegionsChange([...selectedRegions, newRegion]);
      setNewRegion("");
    }
  };

  const removeRegion = (region: string) => {
    onRegionsChange(selectedRegions.filter((r) => r !== region));
  };

  const addPresetRegion = (region: string) => {
    if (!selectedRegions.includes(region)) {
      onRegionsChange([...selectedRegions, region]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Регионы доставки</CardTitle>
        <CardDescription>
          Выберите регионы, в которых доступна данная доставка
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newRegion}
            onChange={(e) => setNewRegion(e.target.value)}
            placeholder="Введите название региона"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addRegion();
              }
            }}
          />
          <Button type="button" onClick={addRegion} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {selectedRegions.length > 0 && (
          <div className="space-y-2">
            <Label>Выбранные регионы:</Label>
            <div className="flex flex-wrap gap-2">
              {selectedRegions.map((region) => (
                <Badge
                  key={region}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {region}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeRegion(region)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Популярные регионы:</Label>
          <div className="flex flex-wrap gap-2">
            {russianRegions.slice(0, 10).map((region) => (
              <Button
                key={region}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addPresetRegion(region)}
                disabled={selectedRegions.includes(region)}
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
