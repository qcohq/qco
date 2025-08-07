export interface ProfileStats {
  activeOrders: number;
  favorites: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badgeKey?: keyof ProfileStats;
  badge?: number;
}
