"use client";

import { useAccountStats } from "../hooks/use-account-stats";
import { useProfileStats } from "../hooks/use-profile-stats";
import { useProfile } from "../hooks/use-profile";
import { useAddresses } from "../hooks/use-addresses";
import { useFavorites } from "../hooks/use-favorites";
import { useSession } from "../hooks/use-session";
import { useFavoritesCount } from "@/features/favorites/hooks/use-favorites-count";

export function AuthHooksTest() {
    const { session, isAuthenticated } = useSession();

    // Тестируем все хуки
    const { stats: accountStats, statsLoading: accountLoading, isAuthenticated: accountAuth } = useAccountStats();
    const { data: profileStats, isLoading: profileLoading } = useProfileStats();
    const { profile, profileLoading } = useProfile();
    const { addresses, addressesLoading } = useAddresses();
    const { favorites, favoritesLoading } = useFavorites();
    const { favoritesCount, isLoading: favoritesCountLoading } = useFavoritesCount();

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <div className="border rounded-lg p-4 bg-blue-50">
                <h2 className="text-xl font-bold mb-4">Тест хуков с проверкой сессии</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Все хуки теперь используют параметр <code>enabled</code> для условного выполнения запросов только при наличии активной сессии.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Статус сессии */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Статус сессии:</h3>
                    <p>Авторизован: {isAuthenticated ? "✅ Да" : "❌ Нет"}</p>
                    <p>Email: {session?.user?.email || "Не авторизован"}</p>
                </div>

                {/* Статистика аккаунта */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Статистика аккаунта:</h3>
                    {accountLoading ? (
                        <p className="text-blue-600">🔄 Загрузка...</p>
                    ) : accountAuth ? (
                        <div>
                            <p>Заказы: {accountStats?.orders?.total || 0}</p>
                            <p>Избранное: {accountStats?.favorites || 0}</p>
                            <p>Бонусные баллы: {accountStats?.bonusPoints || 0}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">⏸️ Запрос не выполнен - не авторизован</p>
                    )}
                </div>

                {/* Статистика профиля */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Статистика профиля:</h3>
                    {profileLoading ? (
                        <p className="text-blue-600">🔄 Загрузка...</p>
                    ) : isAuthenticated ? (
                        <div>
                            <p>Активные заказы: {profileStats?.activeOrders || 0}</p>
                            <p>Избранное: {profileStats?.favorites || 0}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">⏸️ Запрос не выполнен - не авторизован</p>
                    )}
                </div>

                {/* Профиль пользователя */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Профиль пользователя:</h3>
                    {profileLoading ? (
                        <p className="text-blue-600">🔄 Загрузка...</p>
                    ) : isAuthenticated ? (
                        <div>
                            <p>Имя: {profile?.name || "Не указано"}</p>
                            <p>Email: {profile?.email || "Не указан"}</p>
                            <p>Телефон: {profile?.phone || "Не указан"}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">⏸️ Запрос не выполнен - не авторизован</p>
                    )}
                </div>

                {/* Адреса */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Адреса:</h3>
                    {addressesLoading ? (
                        <p className="text-blue-600">🔄 Загрузка...</p>
                    ) : isAuthenticated ? (
                        <div>
                            <p>Количество адресов: {addresses?.length || 0}</p>
                            {addresses && addresses.length > 0 && (
                                <p className="text-sm text-gray-600">
                                    Первый адрес: {addresses[0]?.address || "Нет данных"}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">⏸️ Запрос не выполнен - не авторизован</p>
                    )}
                </div>

                {/* Избранное */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Избранное:</h3>
                    {favoritesLoading ? (
                        <p className="text-blue-600">🔄 Загрузка...</p>
                    ) : isAuthenticated ? (
                        <div>
                            <p>Количество товаров: {favorites?.length || 0}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">⏸️ Запрос не выполнен - не авторизован</p>
                    )}
                </div>

                {/* Количество избранного */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Количество избранного:</h3>
                    {favoritesCountLoading ? (
                        <p className="text-blue-600">🔄 Загрузка...</p>
                    ) : (
                        <div>
                            <p>Количество: {favoritesCount || 0}</p>
                            <p className="text-sm text-gray-600">
                                {isAuthenticated ? "Данные из API" : "Данные из локального хранилища"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="border rounded-lg p-4 bg-green-50">
                <h3 className="font-semibold mb-2">Преимущества обновления:</h3>
                <ul className="text-sm space-y-1">
                    <li>✅ Запросы выполняются только при наличии активной сессии</li>
                    <li>✅ Экономия ресурсов - нет лишних API вызовов</li>
                    <li>✅ Лучшая производительность приложения</li>
                    <li>✅ Более предсказуемое поведение компонентов</li>
                    <li>✅ Graceful fallback для неавторизованных пользователей</li>
                </ul>
            </div>
        </div>
    );
} 