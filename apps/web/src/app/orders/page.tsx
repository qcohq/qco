import { OrdersList } from "@/features/checkout/components/orders-list";

export default function OrdersPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
                    <p className="text-gray-600 mt-2">
                        Просмотр и управление заказами
                    </p>
                </div>

                <OrdersList />
            </div>
        </div>
    );
} 