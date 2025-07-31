import { describe, it, expect, beforeEach } from "vitest";
import { createOrder } from "../../src/lib/orders/order-helpers";
import { db } from "../../src/lib/db";
import { customers, customerAddresses, orders, orderItems } from "@qco/db/schema";
import { eq } from "@qco/db";

describe("createOrder with contact information", () => {
    beforeEach(async () => {
        // Очищаем тестовые данные
        await db.delete(orderItems);
        await db.delete(orders);
        await db.delete(customerAddresses);
        await db.delete(customers);
    });

    it("should save company information when provided", async () => {
        // Создаем тестовую корзину
        const mockCart = {
            id: "test-cart-id",
            items: [
                {
                    id: "item-1",
                    productId: "product-1",
                    variantId: null,
                    quantity: 2,
                    price: 1000,
                    totalPrice: 2000,
                    productName: "Тестовый товар",
                    productSku: "TEST-001",
                    variantName: null,
                    attributes: {},
                },
            ],
            total: 2000,
            itemCount: 1,
        };

        // Данные клиента с компанией
        const customerInfo = {
            email: "test@company.com",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            company: "ООО Тестовая Компания",
            address: "ул. Пушкина, д. 10",
            apartment: "кв. 5",
            city: "Москва",
            state: "Московская область",
            postalCode: "123456",
            saveAddress: true,
        };

        const shippingMethod = {
            id: "standard",
            name: "Стандартная доставка",
            description: "Доставка 1-3 дня",
            price: 300,
            estimatedDelivery: "1-3 дня",
        };

        const paymentMethod = {
            id: "cash",
            type: "cash_on_delivery" as const,
            name: "Наличные курьеру",
            description: "Оплата при получении",
        };

        // Создаем заказ
        const result = await createOrder({
            customerInfo,
            shippingMethod,
            paymentMethod,
            cart: mockCart,
            subtotal: 2000,
            shippingCost: 300,
            total: 2300,
            createProfile: true,
        });

        expect(result.success).toBe(true);
        expect(result.orderId).toBeDefined();

        // Проверяем, что данные клиента сохранились с компанией
        const savedCustomer = await db.query.customers.findFirst({
            where: eq(customers.email, "test@company.com"),
        });

        expect(savedCustomer).toBeDefined();
        expect(savedCustomer?.firstName).toBe("Иван");
        expect(savedCustomer?.lastName).toBe("Иванов");
        expect(savedCustomer?.phone).toBe("+7 (999) 123-45-67");
        expect(savedCustomer?.name).toBe("ООО Тестовая Компания"); // Компания сохраняется в поле name
        expect(savedCustomer?.isGuest).toBe(false); // Профиль создан
    });

    it("should update existing customer with new company information", async () => {
        // Создаем существующего клиента без компании
        const existingCustomer = await db.insert(customers).values({
            id: "test-customer-id",
            customerCode: "TEST-001",
            email: "test@company.com",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            name: null, // Без компании
            isGuest: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        // Создаем тестовую корзину
        const mockCart = {
            id: "test-cart-id",
            items: [
                {
                    id: "item-1",
                    productId: "product-1",
                    variantId: null,
                    quantity: 1,
                    price: 1000,
                    totalPrice: 1000,
                    productName: "Тестовый товар",
                    productSku: "TEST-001",
                    variantName: null,
                    attributes: {},
                },
            ],
            total: 1000,
            itemCount: 1,
        };

        // Данные клиента с новой компанией
        const customerInfo = {
            email: "test@company.com", // Тот же email
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            company: "ООО Новая Компания", // Новая компания
            address: "ул. Ленина, д. 20",
            apartment: "кв. 10",
            city: "Санкт-Петербург",
            state: "Ленинградская область",
            postalCode: "654321",
            saveAddress: true,
        };

        const shippingMethod = {
            id: "standard",
            name: "Стандартная доставка",
            description: "Доставка 1-3 дня",
            price: 300,
            estimatedDelivery: "1-3 дня",
        };

        const paymentMethod = {
            id: "cash",
            type: "cash_on_delivery" as const,
            name: "Наличные курьеру",
            description: "Оплата при получении",
        };

        // Создаем заказ
        const result = await createOrder({
            customerInfo,
            shippingMethod,
            paymentMethod,
            cart: mockCart,
            subtotal: 1000,
            shippingCost: 300,
            total: 1300,
            createProfile: true,
        });

        expect(result.success).toBe(true);

        // Проверяем, что данные клиента обновились
        const updatedCustomer = await db.query.customers.findFirst({
            where: eq(customers.email, "test@company.com"),
        });

        expect(updatedCustomer).toBeDefined();
        expect(updatedCustomer?.name).toBe("ООО Новая Компания"); // Компания обновилась
        expect(updatedCustomer?.id).toBe(existingCustomer[0].id); // Тот же клиент
    });

    it("should not update company if it's the same", async () => {
        // Создаем существующего клиента с компанией
        const existingCustomer = await db.insert(customers).values({
            id: "test-customer-id",
            customerCode: "TEST-001",
            email: "test@company.com",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            name: "ООО Тестовая Компания",
            isGuest: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        const originalUpdatedAt = existingCustomer[0].updatedAt;

        // Создаем тестовую корзину
        const mockCart = {
            id: "test-cart-id",
            items: [
                {
                    id: "item-1",
                    productId: "product-1",
                    variantId: null,
                    quantity: 1,
                    price: 1000,
                    totalPrice: 1000,
                    productName: "Тестовый товар",
                    productSku: "TEST-001",
                    variantName: null,
                    attributes: {},
                },
            ],
            total: 1000,
            itemCount: 1,
        };

        // Данные клиента с той же компанией
        const customerInfo = {
            email: "test@company.com",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            company: "ООО Тестовая Компания", // Та же компания
            address: "ул. Пушкина, д. 10",
            apartment: "кв. 5",
            city: "Москва",
            state: "Московская область",
            postalCode: "123456",
            saveAddress: true,
        };

        const shippingMethod = {
            id: "standard",
            name: "Стандартная доставка",
            description: "Доставка 1-3 дня",
            price: 300,
            estimatedDelivery: "1-3 дня",
        };

        const paymentMethod = {
            id: "cash",
            type: "cash_on_delivery" as const,
            name: "Наличные курьеру",
            description: "Оплата при получении",
        };

        // Создаем заказ
        const result = await createOrder({
            customerInfo,
            shippingMethod,
            paymentMethod,
            cart: mockCart,
            subtotal: 1000,
            shippingCost: 300,
            total: 1300,
            createProfile: true,
        });

        expect(result.success).toBe(true);

        // Проверяем, что данные клиента не изменились
        const customer = await db.query.customers.findFirst({
            where: eq(customers.email, "test@company.com"),
        });

        expect(customer).toBeDefined();
        expect(customer?.name).toBe("ООО Тестовая Компания"); // Компания осталась та же
        expect(customer?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime()); // updatedAt обновился
    });
}); 