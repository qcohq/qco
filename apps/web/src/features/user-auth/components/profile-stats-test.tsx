"use client";

import { useProfileStats } from "../hooks/use-profile-stats";

export function ProfileStatsTest() {
  const { data: stats, isLoading, error } = useProfileStats();

  if (isLoading) {
    return <div>Загрузка статистики...</div>;
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div>
      <h3>Статистика профиля:</h3>
      <p>Активные заказы: {stats?.activeOrders || 0}</p>
      <p>Избранное: {stats?.favorites || 0}</p>
    </div>
  );
}
