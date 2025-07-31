"use client";

import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qco/ui/components/dialog";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

// TODO: Использовать тип из схемы пропсов генератора описания, если появится в @qco/validators

export function DescriptionGenerator({
  brandName,
  foundedYear,
  countryOfOrigin,
  onSelectDescription,
}: {
  brandName: string;
  foundedYear: string;
  countryOfOrigin: string;
  onSelectDescription: (
    fullDescription: string,
    shortDescription: string,
  ) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescriptions, setGeneratedDescriptions] = useState<
    { full: string; short: string }[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!brandName) return;

    setIsGenerating(true);
    setGeneratedDescriptions([]);
    setSelectedIndex(null);

    try {
      // Симуляция API вызова
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const yearText = foundedYear
        ? `Founded in ${foundedYear}`
        : "With a rich history";
      const countryText = countryOfOrigin
        ? `from ${countryOfOrigin}`
        : "from an unknown country";

      const descriptions = [
        {
          full: `${brandName} is a renowned brand ${yearText} ${countryText}. Known for its quality and innovation.`,
          short: `${brandName} – quality and innovation since ${foundedYear || "unknown year"}`,
        },
      ];

      setGeneratedDescriptions(descriptions);
    } catch (error) {
      console.error("Error generating descriptions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelect = () => {
    if (selectedIndex !== null) {
      onSelectDescription(
        generatedDescriptions[selectedIndex].full,
        generatedDescriptions[selectedIndex].short,
      );
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Сгенерировать</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Генератор описания бренда</DialogTitle>
          <DialogDescription>
            Автоматически создайте описание для бренда на основе предоставленной
            информации.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground mt-4 text-sm">
                Генерация описаний...
              </p>
            </div>
          ) : generatedDescriptions.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm font-medium">
                Выберите подходящее описание:
              </p>
              {generatedDescriptions.map((desc, index) => (
                <button
                  key={`description-${index}-${desc.full.slice(0, 20)}`}
                  type="button"
                  className={`cursor-pointer rounded-md border p-3 transition-colors text-left w-full ${selectedIndex === index
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                    }`}
                  onClick={() => setSelectedIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedIndex(index);
                    }
                  }}
                >
                  <p className="text-sm">{desc.full}</p>
                  <div className="mt-2 border-t pt-2">
                    <p className="text-muted-foreground text-xs">
                      Краткое описание:
                    </p>
                    <p className="text-xs">{desc.short}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">
                Нажмите кнопку "Сгенерировать", чтобы создать описание для
                бренда <strong>{brandName || "..."}</strong>.
              </p>
              <div className="bg-muted rounded-md p-3">
                <p className="text-muted-foreground text-xs">
                  Доступная информация:
                </p>
                <ul className="mt-1 list-inside list-disc text-xs">
                  <li>Название: {brandName || "Не указано"}</li>
                  <li>Год основания: {foundedYear || "Не указан"}</li>
                  <li>Страна: {countryOfOrigin || "Не указана"}</li>
                </ul>
              </div>
              <p className="text-muted-foreground text-xs">
                Для получения лучших результатов рекомендуется заполнить как
                можно больше информации о бренде.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Отмена
          </Button>
          {generatedDescriptions.length > 0 ? (
            <Button onClick={handleSelect} disabled={selectedIndex === null}>
              Использовать выбранное
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !brandName}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Сгенерировать
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
