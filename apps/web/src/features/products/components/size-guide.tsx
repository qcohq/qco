"use client";

import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qco/ui/components/dialog";

export default function SizeGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto text-xs sm:text-sm underline"
        >
          Таблица размеров
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Таблица размеров
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
              Женская одежда
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 sm:py-2">Размер</th>
                    <th className="text-left py-1 sm:py-2">
                      Обхват груди (см)
                    </th>
                    <th className="text-left py-1 sm:py-2">
                      Обхват талии (см)
                    </th>
                    <th className="text-left py-1 sm:py-2">
                      Обхват бедер (см)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-1 sm:py-2">XS</td>
                    <td className="py-1 sm:py-2">80-84</td>
                    <td className="py-1 sm:py-2">60-64</td>
                    <td className="py-1 sm:py-2">86-90</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1 sm:py-2">S</td>
                    <td className="py-1 sm:py-2">84-88</td>
                    <td className="py-1 sm:py-2">64-68</td>
                    <td className="py-1 sm:py-2">90-94</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1 sm:py-2">M</td>
                    <td className="py-1 sm:py-2">88-92</td>
                    <td className="py-1 sm:py-2">68-72</td>
                    <td className="py-1 sm:py-2">94-98</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-1 sm:py-2">L</td>
                    <td className="py-1 sm:py-2">92-96</td>
                    <td className="py-1 sm:py-2">72-76</td>
                    <td className="py-1 sm:py-2">98-102</td>
                  </tr>
                  <tr>
                    <td className="py-1 sm:py-2">XL</td>
                    <td className="py-1 sm:py-2">96-100</td>
                    <td className="py-1 sm:py-2">76-80</td>
                    <td className="py-1 sm:py-2">102-106</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-2">
            <p>
              <strong>Как правильно измерить:</strong>
            </p>
            <ul className="list-disc list-inside space-y-0.5 sm:space-y-1">
              <li>Обхват груди: измеряйте по самой выступающей части груди</li>
              <li>Обхват талии: измеряйте по самой узкой части талии</li>
              <li>Обхват бедер: измеряйте по самой широкой части бедер</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
