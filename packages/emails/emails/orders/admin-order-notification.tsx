import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import { emailTailwindConfig } from "../../tailwind";
import { translatePaymentMethod, translateShippingMethod } from "../../src/utils/order-status-translations";

interface AdminOrderNotificationProps {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    totalAmount: string;
    items: Array<{
        name: string;
        quantity: number;
        price: string;
    }>;
    shippingAddress?: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        postalCode: string;
    };
    paymentMethod?: string;
    shippingMethod?: string;
    adminOrderUrl?: string;
}

export default function AdminOrderNotification({
    orderNumber,
    customerName,
    customerEmail,
    totalAmount,
    items,
    shippingAddress,
    paymentMethod,
    shippingMethod,
    adminOrderUrl,
}: AdminOrderNotificationProps) {
    const translatedPaymentMethod = paymentMethod ? translatePaymentMethod(paymentMethod) : undefined;
    const translatedShippingMethod = shippingMethod ? translateShippingMethod(shippingMethod) : undefined;

    return (
        <Html>
            <Head />
            <Preview>Новый заказ №{orderNumber} от {customerName}</Preview>
            <Tailwind config={emailTailwindConfig}>
                <Body className="mx-auto my-auto bg-white font-sans">
                    <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
                        <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
                            Новый заказ получен!
                        </Heading>

                        <Section className="mb-[32px] mt-[32px] rounded-lg bg-blue-50 p-[20px]">
                            <Text className="text-[16px] font-semibold text-black mb-[16px]">
                                Основная информация
                            </Text>
                            <Text className="text-[14px] leading-[24px] text-black">
                                <strong>Номер заказа:</strong> #{orderNumber}
                            </Text>
                            <Text className="text-[14px] leading-[24px] text-black">
                                <strong>Клиент:</strong> {customerName}
                            </Text>
                            <Text className="text-[14px] leading-[24px] text-black">
                                <strong>Email:</strong> {customerEmail}
                            </Text>
                            <Text className="text-[14px] leading-[24px] text-black">
                                <strong>Сумма заказа:</strong> {totalAmount}
                            </Text>
                            <Text className="text-[14px] leading-[24px] text-black">
                                <strong>Дата заказа:</strong> {new Date().toLocaleDateString('ru-RU')}
                            </Text>
                        </Section>

                        <Section className="mb-[32px]">
                            <Text className="text-[16px] font-semibold text-black mb-[16px]">
                                Состав заказа
                            </Text>
                            {items?.map((item, index) => (
                                <div key={index} className="mb-[12px] pb-[12px] border-b border-gray-200 last:border-b-0">
                                    <Text className="text-[14px] leading-[20px] text-black font-medium">
                                        {item.name}
                                    </Text>
                                    <Text className="text-[12px] leading-[16px] text-gray-600">
                                        Количество: {item.quantity} шт. × {item.price}
                                    </Text>
                                </div>
                            ))}
                        </Section>

                        {shippingAddress && (
                            <Section className="mb-[32px] rounded-lg bg-gray-50 p-[20px]">
                                <Text className="text-[16px] font-semibold text-black mb-[16px]">
                                    Адрес доставки
                                </Text>
                                <Text className="text-[14px] leading-[20px] text-black">
                                    {shippingAddress.firstName} {shippingAddress.lastName}
                                </Text>
                                <Text className="text-[14px] leading-[20px] text-black">
                                    {shippingAddress.address}
                                </Text>
                                <Text className="text-[14px] leading-[20px] text-black">
                                    {shippingAddress.city}, {shippingAddress.postalCode}
                                </Text>
                            </Section>
                        )}

                        {(paymentMethod || shippingMethod) && (
                            <Section className="mb-[32px] rounded-lg bg-gray-50 p-[20px]">
                                <Text className="text-[16px] font-semibold text-black mb-[16px]">
                                    Способ оплаты и доставки
                                </Text>
                                {translatedPaymentMethod && (
                                    <Text className="text-[14px] leading-[20px] text-black">
                                        <strong>Оплата:</strong> {translatedPaymentMethod}
                                    </Text>
                                )}
                                {translatedShippingMethod && (
                                    <Text className="text-[14px] leading-[20px] text-black">
                                        <strong>Доставка:</strong> {translatedShippingMethod}
                                    </Text>
                                )}
                            </Section>
                        )}

                        {adminOrderUrl && (
                            <Section className="mb-[32px] mt-[32px] text-center">
                                <Button
                                    className="rounded bg-[#000000] px-6 py-3 text-center text-[14px] font-semibold text-white no-underline hover:bg-gray-800"
                                    href={adminOrderUrl}
                                >
                                    Обработать заказ
                                </Button>
                            </Section>
                        )}

                        <Text className="text-[14px] leading-[24px] text-black">
                            <strong>Рекомендуемые действия:</strong>
                        </Text>
                        <Text className="text-[14px] leading-[24px] text-black">
                            • Проверьте наличие товаров на складе
                            <br />• Подтвердите способ оплаты
                            <br />• Обновите статус заказа в системе
                            <br />• Свяжитесь с клиентом при необходимости
                        </Text>

                        <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
                        <Text className="text-[12px] leading-[24px] text-[#666666]">
                            Это автоматическое уведомление о новом заказе. Обработайте заказ в панели администратора.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
} 
