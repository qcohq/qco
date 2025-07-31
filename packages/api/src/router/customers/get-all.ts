import { TRPCError } from "@trpc/server";
import { eq, ilike, or, and, desc, asc, sql, inArray } from "@qco/db";
import { customers, orders } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { filterCustomersSchema } from "@qco/validators";
import { z } from "zod";

// Схема для ответа с пагинацией
const customersListSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    customerCode: z.string(),
    name: z.string().nullable(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string(),
    emailVerified: z.boolean(),
    phone: z.string().nullable(),
    dateOfBirth: z.date().nullable(),
    gender: z.string().nullable(),
    image: z.string().nullable(),
    isGuest: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    totalOrders: z.number().default(0),
    totalSpent: z.number().default(0),
  })),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

export const getAllCustomers = protectedProcedure
  .input(filterCustomersSchema)
  .output(customersListSchema)
  .query(async ({ ctx, input }) => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        registrationDate,
        orderCountMin,
        orderCountMax,
        spentAmountMin,
        spentAmountMax,
        showActive,
        showInactive,
        isVip,
      } = input;

      const offset = (page - 1) * limit;

      // Строим условия фильтрации
      const whereConditions: any[] = [];

      // Поиск по имени, email или телефону
      if (search) {
        whereConditions.push(
          or(
            ilike(customers.name, `%${search}%`),
            ilike(customers.email, `%${search}%`),
            ilike(customers.phone, `%${search}%`),
            ilike(customers.firstName, `%${search}%`),
            ilike(customers.lastName, `%${search}%`)
          )
        );
      }

      // Фильтр по дате регистрации
      if (registrationDate) {
        whereConditions.push(eq(customers.createdAt, registrationDate));
      }

      // Фильтр по статусу активности (пока что используем isGuest как индикатор активности)
      if (showActive !== undefined && showInactive !== undefined) {
        if (showActive && !showInactive) {
          whereConditions.push(eq(customers.isGuest, false));
        } else if (!showActive && showInactive) {
          whereConditions.push(eq(customers.isGuest, true));
        }
        // Если оба true или оба false, не добавляем фильтр
      }

      // Получаем клиентов с пагинацией
      const customersData = await ctx.db.query.customers.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
        orderBy: [desc(customers.createdAt)],
        limit,
        offset,
      });

      // Получаем общее количество клиентов для пагинации
      const totalCount = await ctx.db.query.customers.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      });

      // Получаем статистику заказов для всех клиентов
      const customerIds = customersData.map(c => c.id);

      // Если нет клиентов, возвращаем пустой результат
      if (customerIds.length === 0) {
        return {
          items: [],
          meta: {
            total: totalCount.length,
            page,
            limit,
            totalPages: Math.ceil(totalCount.length / limit),
          },
        };
      }

      // Получаем количество заказов и сумму потраченных денег для каждого клиента
      let orderStats: Array<{ customerId: string; totalOrders: number; totalSpent: number }> = [];

      if (customerIds.length > 0) {
        orderStats = await ctx.db
          .select({
            customerId: orders.customerId,
            totalOrders: sql<number>`count(*)::int`,
            totalSpent: sql<number>`COALESCE(SUM(${orders.totalAmount})::numeric, 0)::float`,
          })
          .from(orders)
          .where(inArray(orders.customerId, customerIds))
          .groupBy(orders.customerId);
      }

      // Создаем Map для быстрого поиска статистики по customerId
      const statsMap = new Map(
        orderStats.map(stat => [stat.customerId, {
          totalOrders: stat.totalOrders,
          totalSpent: Number(stat.totalSpent)
        }])
      );

      // Объединяем данные клиентов со статистикой заказов
      const customersWithStats = customersData.map(customer => {
        const stats = statsMap.get(customer.id) || { totalOrders: 0, totalSpent: 0 };
        return {
          ...customer,
          totalOrders: stats.totalOrders,
          totalSpent: stats.totalSpent,
        };
      });

      // Применяем фильтры по количеству заказов и потраченной сумме (если есть)
      let filteredCustomers = customersWithStats;

      if (orderCountMin !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.totalOrders >= orderCountMin);
      }

      if (orderCountMax !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.totalOrders <= orderCountMax);
      }

      if (spentAmountMin !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.totalSpent >= spentAmountMin);
      }

      if (spentAmountMax !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.totalSpent <= spentAmountMax);
      }

      return {
        items: filteredCustomers,
        meta: {
          total: totalCount.length,
          page,
          limit,
          totalPages: Math.ceil(totalCount.length / limit),
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch customers",
      });
    }
  });
