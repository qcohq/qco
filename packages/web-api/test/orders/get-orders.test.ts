import { describe, it, expect, beforeEach } from "vitest";
import { getOrdersProcedure } from "../../src/router/orders/get-orders";
import { db } from "../../src/lib/db";
import { customers, orders, orderItems } from "@qco/db/schema";
import { eq } from "@qco/db";

describe("getOrdersProcedure", () => {
    beforeEach(async () => {
        // Очищаем тестовые данные
        await db.delete(orderItems);
        await db.delete(orders);
        await db.delete(customers);
    });

    it("should return empty list when no orders exist", async () => {
        const input = {
            limit: 10,
            offset: 0,
        };

        const result = await getOrdersProcedure.handler({
            input,
            ctx: { db } as any,
            type: "query",
        });

        expect(result.orders).toEqual([]);
        expect(result.pagination.total).toBe(0);
        expect(result.pagination.hasMore).toBe(false);
    });

    it("should return orders with pagination", async () => {
        // Создаем тестового клиента
        const customer = await db.insert(customers).values({
            id: "test-customer-id",
            customerCode: "TEST-001",
            email: "test@example.com",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            isGuest: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        // Создаем тестовые заказы
        const testOrders = await Promise.all([
            db.insert(orders).values({
                id: "order-1",
                orderNumber: "ORD-001",
                customerId: customer[0].id,
                status: "pending",
                totalAmount: "1000",
                subtotalAmount: "900",
                shippingAmount: "100",
                discountAmount: "0",
                taxAmount: "0",
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning(),
            db.insert(orders).values({
                id: "order-2",
                orderNumber: "ORD-002",
                customerId: customer[0].id,
                status: "processing",
                totalAmount: "2000",
                subtotalAmount: "1800",
                shippingAmount: "200",
                discountAmount: "0",
                taxAmount: "0",
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning(),
        ]);

        const input = {
            limit: 1,
            offset: 0,
        };

        const result = await getOrdersProcedure.handler({
            input,
            ctx: { db } as any,
            type: "query",
        });

        expect(result.orders).toHaveLength(1);
        expect(result.pagination.total).toBe(2);
        expect(result.pagination.hasMore).toBe(true);
        expect(result.pagination.currentPage).toBe(1);
    });

    it("should filter orders by status", async () => {
        // Создаем тестового клиента
        const customer = await db.insert(customers).values({
            id: "test-customer-id",
            customerCode: "TEST-001",
            email: "test@example.com",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            isGuest: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        // Создаем тестовые заказы с разными статусами
        await Promise.all([
            db.insert(orders).values({
                id: "order-1",
                orderNumber: "ORD-001",
                customerId: customer[0].id,
                status: "pending",
                totalAmount: "1000",
                subtotalAmount: "900",
                shippingAmount: "100",
                discountAmount: "0",
                taxAmount: "0",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
            db.insert(orders).values({
                id: "order-2",
                orderNumber: "ORD-002",
                customerId: customer[0].id,
                status: "processing",
                totalAmount: "2000",
                subtotalAmount: "1800",
                shippingAmount: "200",
                discountAmount: "0",
                taxAmount: "0",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        ]);

        const input = {
            limit: 10,
            offset: 0,
            status: "pending",
        };

        const result = await getOrdersProcedure.handler({
            input,
            ctx: { db } as any,
            type: "query",
        });

        expect(result.orders).toHaveLength(1);
        expect(result.orders[0].status).toBe("pending");
        expect(result.pagination.total).toBe(1);
    });

    it("should filter orders by customer ID", async () => {
        // Создаем тестовых клиентов
        const customers = await Promise.all([
            db.insert(customers).values({
                id: "customer-1",
                customerCode: "TEST-001",
                email: "customer1@example.com",
                firstName: "Иван",
                lastName: "Иванов",
                phone: "+7 (999) 123-45-67",
                isGuest: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning(),
            db.insert(customers).values({
                id: "customer-2",
                customerCode: "TEST-002",
                email: "customer2@example.com",
                firstName: "Петр",
                lastName: "Петров",
                phone: "+7 (999) 987-65-43",
                isGuest: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning(),
        ]);

        // Создаем заказы для разных клиентов
        await Promise.all([
            db.insert(orders).values({
                id: "order-1",
                orderNumber: "ORD-001",
                customerId: customers[0][0].id,
                status: "pending",
                totalAmount: "1000",
                subtotalAmount: "900",
                shippingAmount: "100",
                discountAmount: "0",
                taxAmount: "0",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
            db.insert(orders).values({
                id: "order-2",
                orderNumber: "ORD-002",
                customerId: customers[1][0].id,
                status: "processing",
                totalAmount: "2000",
                subtotalAmount: "1800",
                shippingAmount: "200",
                discountAmount: "0",
                taxAmount: "0",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        ]);

        const input = {
            limit: 10,
            offset: 0,
            customerId: customers[0][0].id,
        };

        const result = await getOrdersProcedure.handler({
            input,
            ctx: { db } as any,
            type: "query",
        });

        expect(result.orders).toHaveLength(1);
        expect(result.orders[0].customerId).toBe(customers[0][0].id);
        expect(result.pagination.total).toBe(1);
    });
}); 