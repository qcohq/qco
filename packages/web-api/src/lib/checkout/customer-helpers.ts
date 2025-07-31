import { eq, sql } from "@qco/db";
import { customers, customerAddresses } from "@qco/db/schema";
import { db } from "@qco/db/client";

interface CustomerData {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	company?: string;
	dateOfBirth?: Date;
	gender?: string;
}

/**
 * Функция для генерации уникального кода клиента
 */
async function generateCustomerCode(): Promise<string> {
	// Получаем максимальный номер из существующих кодов
	const result = await db
		.select({
			maxNumber: sql<string>`COALESCE(
				MAX(CAST(SUBSTRING(customer_code FROM 6) AS INTEGER)), 
				0
			)`
		})
		.from(customers);

	const maxNumber = Number.parseInt(result[0]?.maxNumber || "0", 10);
	const nextNumber = maxNumber + 1;

	// Форматируем номер с ведущими нулями (5 цифр)
	return `CUST-${nextNumber.toString().padStart(5, '0')}`;
}

/**
 * Получение информации о клиенте по ID пользователя
 */
export async function getCustomerById(userId: string) {
	try {
		return await db.query.customers.findFirst({
			where: eq(customers.id, userId),
		});
	} catch (error) {

		throw new Error(
			`Failed to fetch customer: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Получение сохраненных адресов клиента
 */
export async function getCustomerAddresses(customerId: string) {
	try {
		return await db.query.customerAddresses.findMany({
			where: eq(customerAddresses.customerId, customerId),
		});
	} catch (error) {

		throw new Error(
			`Failed to fetch customer addresses: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Обновление информации о клиенте
 */
export async function updateCustomerInfo(
	userId: string,
	data: CustomerData,
): Promise<any> {
	try {
		return await db
			.update(customers)
			.set(data)
			.where(eq(customers.id, userId))
			.returning();
	} catch (error) {

		throw new Error(
			`Failed to update customer info: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Получение сохраненных способов оплаты клиента
 */
export async function getCustomerPaymentMethods(customerId: string) {
	try {
		// В реальном приложении здесь был бы запрос к таблице с сохраненными способами оплаты
		// Для примера возвращаем заглушку
		return [
			{ id: "pm_1", type: "card", last4: "4242", brand: "visa" },
			{ id: "pm_2", type: "card", last4: "1234", brand: "mastercard" },
		];
	} catch (error) {

		throw new Error(
			`Failed to fetch payment methods: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Поиск или создание клиента по email (для гостя или зарегистрированного)
 */
export async function findOrCreateCustomerByEmail(data: CustomerData & { isGuest?: boolean }) {
	if (!data.email) {
		throw new Error("Email is required to create or find a customer");
	}
	// Пробуем найти существующего клиента
	const customer = await db.query.customers.findFirst({
		where: eq(customers.email, data.email),
	});

	if (customer) {
		// Если пользователь найден, обновляем его данные
		const updateData: any = {
			updatedAt: new Date(),
		};

		// Обновляем только те поля, которые переданы и отличаются от текущих
		if (data.firstName && data.firstName !== customer.firstName) {
			updateData.firstName = data.firstName;
		}
		if (data.lastName && data.lastName !== customer.lastName) {
			updateData.lastName = data.lastName;
		}
		if (data.phone && data.phone !== customer.phone) {
			updateData.phone = data.phone;
		}
		if (data.company && data.company !== customer.name) {
			updateData.name = data.company;
		}
		if (data.dateOfBirth && data.dateOfBirth !== customer.dateOfBirth) {
			updateData.dateOfBirth = data.dateOfBirth;
		}
		if (data.gender && data.gender !== customer.gender) {
			updateData.gender = data.gender;
		}
		if (data.isGuest !== undefined && data.isGuest !== customer.isGuest) {
			updateData.isGuest = data.isGuest;
		}

		// Если есть изменения, обновляем пользователя
		if (Object.keys(updateData).length > 1) { // больше 1, потому что updatedAt всегда добавляется
			const [updatedCustomer] = await db
				.update(customers)
				.set(updateData)
				.where(eq(customers.id, customer.id))
				.returning();
			return updatedCustomer;
		}

		return customer;
	}

	// Если не найден — создаём нового пользователя
	const now = new Date();
	const customerCode = await generateCustomerCode();
	const [newCustomer] = await db.insert(customers).values({
		customerCode,
		email: data.email,
		firstName: data.firstName,
		lastName: data.lastName,
		phone: data.phone,
		name: data.company, // Сохраняем компанию в поле name
		dateOfBirth: data.dateOfBirth,
		gender: data.gender,
		isGuest: data.isGuest ?? true,
		createdAt: now,
		updatedAt: now,
	}).returning();
	return newCustomer;
}
