import CategoriesSection from "@/components/categories-section";

export default function TestCategoriesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Тест компонента CategoriesSection
                </h1>

                <div className="space-y-12">
                    {/* Пример без categorySlug - корневые категории */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Корневые категории (без categorySlug)</h2>
                        <CategoriesSection />
                    </div>

                    {/* Пример с categorySlug - подкатегории */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Подкатегории (с categorySlug="women")</h2>
                        <CategoriesSection categorySlug="women" />
                    </div>

                    {/* Пример с другим categorySlug */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Подкатегории (с categorySlug="men")</h2>
                        <CategoriesSection categorySlug="men" />
                    </div>
                </div>
            </div>
        </div>
    );
} 