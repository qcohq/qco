import { Button } from "@qco/ui/components/button";
import { Filter, Search } from "lucide-react";

export function CatalogHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-4">Каталог товаров</h1>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск товаров..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
      </div>
    </div>
  );
}
