import { describe, it, expect, beforeEach } from "vitest";
import { createOrder } from "../../src/lib/orders/order-helpers";
import { db } from "../../src/lib/db";
import { customers, customerAddresses, orders, orderItems } from "@qco/db/schema";
import { eq } from "@qco/db";

describe("createOrder with profile saving", () => {
    beforeEach(async () => {
        // Очищаем тестовые данные
        await db.delete(orderItems);
        await db.delete(orders);
        await db.delete(customerAddresses);
        await db.delete(customers);
    });

    it("should update existing customer data when saveToProfile is true", async () => {
        // Создаем существующего клиента
        const existingCustomer = await db.insert(customers).values({
            id: "test-customer-id",
            customerCode: "TEST-001",
            email: "test@example.com",
            firstName: "Старое",
            lastName: "Имя",
            phone: "+7 (999) 000-00-00",
            isGuest: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        const customerInfo = {
            email: "test@example.com",
            firstName: "Новое",
            lastName: "Имя",
            phone: "+7 (999) 123-45-67",
            address: "ул. Пушкина, д. 10",
            apartment: "кв. 5",
            city: "Москва",
            state: "Московская область",
            postalCode: "123456",
            saveAddress: true,
        };

        const mockCart = {
            id: "test-cart-id",
            sessionId: "test-session-id",
            total: 1000,
            items: [
                {
                    id: "test-item-id",
                    productId: "test-product-id",
                    variantId: null,
                    quantity: 1,
                    price: "1000",
                    attributes: {},
                    product: {
                        id: "test-product-id",
                        name: "Test Product",
                        basePrice: "1000",
                        salePrice: null,
                    },
                    variant: null,
                },
            ],
        };

        const shippingMethod = {
            id: "test-shipping-id",
            name: "Стандартная доставка",
            description: "Доставка 1-3 дня",
            price: 300,
            estimatedDelivery: "1-3 дня",
        };

        const paymentMethod = {
            id: "test-payment-id",
            type: "cash_on_delivery" as const,
            name: "Наличные курьеру",
            description: "Оплата при получении",
        };

        // Создаем заказ
        const order = await createOrder({
            customerInfo,
            shippingMethod,
            paymentMethod,
            cart: mockCart,
            subtotal: 1000,
            shippingCost: 300,
            total: 1300,
        });

        expect(order).toBeDefined();

        // Проверяем, что данные пользователя обновлены
        const updatedCustomer = await db.query.customers.findFirst({
            where: eq(customers.email, customerInfo.email),
        });

        expect(updatedCustomer).toBeDefined();
        expect(updatedCustomer?.firstName).toBe(customerInfo.firstName);
        expect(updatedCustomer?.lastName).toBe(customerInfo.lastName);
        expect(updatedCustomer?.phone).toBe(customerInfo.phone);

        // Проверяем, что адрес создан
        if (updatedCustomer) {
            const address = await db.query.customerAddresses.findFirst({
                where: eq(customerAddresses.customerId, updatedCustomer.id),
            });

            expect(address).toBeDefined();
            expect(address?.addressLine1).toBe(customerInfo.address);
            expect(address?.addressLine2).toBe(customerInfo.apartment);
            expect(address?.city).toBe(customerInfo.city);
            expect(address?.isDefault).toBe(true);
        }
    });

    it("should not update customer data when saveToProfile is false", async () => {
        // Создаем существующего клиента
        const existingCustomer = await db.insert(customers).values({
            id: "test-customer-id",
            customerCode: "TEST-001",
            email: "test@example.com",
            firstName: "Старое",
            lastName: "Имя",
            phone: "+7 (999) 000-00-00",
            isGuest: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        const customerInfo = {
            email: "test@example.com",
            firstName: "Новое",
            lastName: "Имя",
            phone: "+7 (999) 123-45-67",
            address: "ул. Пушкина, д. 10",
            apartment: "кв. 5",
            city: "Москва",
            state: "Московская область",
            postalCode: "123456",
            saveAddress: false, // Не сохраняем адрес
        };

        const mockCart = {
            id: "test-cart-id",
            sessionId: "test-session-id",
            total: 1000,
            items: [
                {
                    id: "test-item-id",
                    productId: "test-product-id",
                    variantId: null,
                    quantity: 1,
                    price: "1000",
                    attributes: {},
                    product: {
                        id: "test-product-id",
                        name: "Test Product",
                        basePrice: "1000",
                        salePrice: null,
                    },
                    variant: null,
                },
            ],
        };

        const shippingMethod = {
            id: "test-shipping-id",
            name: "Стандартная доставка",
            description: "Доставка 1-3 дня",
            price: 300,
            estimatedDelivery: "1-3 дня",
        };

        const paymentMethod = {
            id: "test-payment-id",
            type: "cash_on_delivery" as const,
            name: "Наличные курьеру",
            description: "Оплата при получении",
        };

        // Создаем заказ
        const order = await createOrder({
            customerInfo,
            shippingMethod,
            paymentMethod,
            cart: mockCart,
            subtotal: 1000,
            shippingCost: 300,
            total: 1300,
        });

        expect(order).toBeDefined();

        // Проверяем, что данные пользователя НЕ обновлены
        const customer = await db.query.customers.findFirst({
            where: eq(customers.email, customerInfo.email),
        });

        expect(customer).toBeDefined();
        expect(customer?.firstName).toBe("Старое"); // Осталось старое значение
        expect(customer?.lastName).toBe("Имя"); // Осталось старое значение
        expect(customer?.phone).toBe("+7 (999) 000-00-00"); // Осталось старое значение

        // Проверяем, что адрес НЕ создан
        if (customer) {
            const address = await db.query.customerAddresses.findFirst({
                where: eq(customerAddresses.customerId, customer.id),
            });

            expect(address).toBeUndefined();
        }
    });
}); 