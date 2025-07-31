import { describe, it, expect, beforeEach } from "vitest";
import { createProfileFromOrder } from "../../src/router/profile/create-profile-from-order";
import { db } from "../../src/lib/db";
import { customers, customerAddresses } from "@qco/db/schema";
import { eq } from "@qco/db";

describe("createProfileFromOrder", () => {
    beforeEach(async () => {
        // Очищаем тестовые данные
        await db.delete(customerAddresses);
        await db.delete(customers);
    });

    it("should create a new profile when customer does not exist", async () => {
        const input = {
            email: "test@example.com",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            address: "ул. Пушкина, д. 10",
            apartment: "кв. 5",
            city: "Москва",
            state: "Московская область",
            postalCode: "123456",
            saveAddress: true,
        };

        const result = await createProfileFromOrder.handler({
            input,
            ctx: { db } as any,
            type: "mutation",
        });

        expect(result.success).toBe(true);
        expect(result.message).toBe("Профиль создан");

        // Проверяем, что профиль создан в базе
        const customer = await db.query.customers.findFirst({
            where: eq(customers.email, input.email),
        });

        expect(customer).toBeDefined();
        expect(customer?.firstName).toBe(input.firstName);
        expect(customer?.lastName).toBe(input.lastName);
        expect(customer?.phone).toBe(input.phone);
        expect(customer?.isGuest).toBe(false);

        // Проверяем, что адрес создан
        if (customer) {
            const address = await db.query.customerAddresses.findFirst({
                where: eq(customerAddresses.customerId, customer.id),
            });

            expect(address).toBeDefined();
            expect(address?.addressLine1).toBe(input.address);
            expect(address?.addressLine2).toBe(input.apartment);
            expect(address?.city).toBe(input.city);
            expect(address?.isDefault).toBe(true);
        }
    });

    it("should update existing profile when customer exists", async () => {
        // Создаем существующего клиента
        const existingCustomer = await db.insert(customers).values({
            id: "test-customer-id",
            customerCode: "TEST-001",
            email: "test@example.com",
            firstName: "Старое",
            lastName: "Имя",
            phone: "+7 (999) 000-00-00",
            isGuest: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning();

        const input = {
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

        const result = await createProfileFromOrder.handler({
            input,
            ctx: { db } as any,
            type: "mutation",
        });

        expect(result.success).toBe(true);
        expect(result.message).toBe("Профиль обновлен");

        // Проверяем, что профиль обновлен
        const customer = await db.query.customers.findFirst({
            where: eq(customers.email, input.email),
        });

        expect(customer).toBeDefined();
        expect(customer?.firstName).toBe(input.firstName);
        expect(customer?.lastName).toBe(input.lastName);
        expect(customer?.phone).toBe(input.phone);
        expect(customer?.isGuest).toBe(false); // Превратился в зарегистрированного
    });

    it("should not create address when saveAddress is false", async () => {
        const input = {
            email: "test@example.com",
            firstName: "Иван",
            lastName: "Иванов",
            phone: "+7 (999) 123-45-67",
            address: "ул. Пушкина, д. 10",
            apartment: "кв. 5",
            city: "Москва",
            state: "Московская область",
            postalCode: "123456",
            saveAddress: false,
        };

        const result = await createProfileFromOrder.handler({
            input,
            ctx: { db } as any,
            type: "mutation",
        });

        expect(result.success).toBe(true);

        // Проверяем, что профиль создан, но адрес нет
        const customer = await db.query.customers.findFirst({
            where: eq(customers.email, input.email),
        });

        expect(customer).toBeDefined();

        if (customer) {
            const address = await db.query.customerAddresses.findFirst({
                where: eq(customerAddresses.customerId, customer.id),
            });

            expect(address).toBeUndefined();
        }
    });
}); 