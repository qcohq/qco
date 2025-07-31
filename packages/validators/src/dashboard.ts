import { z } from "zod";

// Схема для данных выручки
export const revenueDataSchema = z.object({
    date: z.string(),
    revenue: z.number().min(0),
});

// Схема для массива данных выручки
export const revenueDataArraySchema = z.array(revenueDataSchema);

// Схема для пропсов компонента RevenueChart
export const revenueChartPropsSchema = z.object({
    data: revenueDataArraySchema,
    isLoading: z.boolean().optional().default(false),
});

// Схема для продукта в топе
export const topProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    sales: z.number().min(0),
    revenue: z.number().min(0),
    image: z.string().optional(),
});

// Схема для массива топ продуктов
export const topProductsArraySchema = z.array(topProductSchema);

// Схема для пропсов компонента TopProducts
export const topProductsPropsSchema = z.object({
    products: topProductsArraySchema,
    isLoading: z.boolean().optional().default(false),
});

// Схема для статуса заказа (соответствует enum в БД)
export const orderStatusSchema = z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded"
]);

// Схема для заказа
export const recentOrderSchema = z.object({
    id: z.string(),
    orderNumber: z.string(),
    customerName: z.string(),
    amount: z.number().min(0),
    status: orderStatusSchema,
    date: z.string(),
});

// Схема для массива последних заказов
export const recentOrdersArraySchema = z.array(recentOrderSchema);

// Схема для пропсов компонента RecentOrders
export const recentOrdersPropsSchema = z.object({
    orders: recentOrdersArraySchema,
    isLoading: z.boolean().optional().default(false),
});

// Схема для тренда
export const trendSchema = z.object({
    value: z.number(),
    isPositive: z.boolean(),
});

// Схема для статистики
export const statItemSchema = z.object({
    value: z.number(),
    trend: z.number(),
});

// Схема для всех статистик
export const statsSchema = z.object({
    revenue: statItemSchema,
    orders: statItemSchema,
    products: statItemSchema,
    customers: statItemSchema,
});

// Схема для пропсов компонента StatsCard
export const statsCardPropsSchema = z.object({
    title: z.string(),
    value: z.union([z.string(), z.number()]),
    description: z.string().optional(),
    icon: z.any(), // LucideIcon
    trend: trendSchema.optional(),
    isLoading: z.boolean().optional().default(false),
});

// Типы для TypeScript
export type RevenueData = z.infer<typeof revenueDataSchema>;
export type RevenueChartProps = z.infer<typeof revenueChartPropsSchema>;
export type TopProduct = z.infer<typeof topProductSchema>;
export type TopProductsProps = z.infer<typeof topProductsPropsSchema>;
export type RecentOrder = z.infer<typeof recentOrderSchema>;
export type RecentOrdersProps = z.infer<typeof recentOrdersPropsSchema>;
export type Trend = z.infer<typeof trendSchema>;
export type StatItem = z.infer<typeof statItemSchema>;
export type Stats = z.infer<typeof statsSchema>;
export type StatsCardProps = z.infer<typeof statsCardPropsSchema>; 