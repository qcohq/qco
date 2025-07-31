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
import { emailTailwindConfig } from "../tailwind";
import { env } from "../env";
import { translatePaymentMethod, translateShippingMethod } from "../src/utils/order-status-translations";

const defaultOrderUrl = `${env.SITE_URL}/orders`;

interface OrderCreatedEmailProps {
  username: string;
  orderNumber: string;
  orderUrl?: string;
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
  subtotal?: string;
  shippingCost?: string;
}

export function OrderCreatedEmail({
  username,
  orderNumber,
  orderUrl = defaultOrderUrl,
  totalAmount,
  items,
  shippingAddress,
  paymentMethod,
  shippingMethod,
  subtotal,
  shippingCost,
}: OrderCreatedEmailProps) {
  const translatedPaymentMethod = paymentMethod ? translatePaymentMethod(paymentMethod) : undefined;
  const translatedShippingMethod = shippingMethod ? translateShippingMethod(shippingMethod) : undefined;

  return (
    <Html>
      <Head />
      <Preview>Заказ №{orderNumber} успешно создан - {env.SITE_NAME}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Заказ успешно создан!
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Здравствуйте, {username}!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Спасибо за ваш заказ! Мы получили его и начали обработку. В ближайшее время вы получите уведомление об изменении статуса заказа.
            </Text>

            <Section className="mb-[32px] mt-[32px] rounded-lg bg-gray-50 p-[20px]">
              <Text className="text-[16px] font-semibold text-black mb-[16px]">
                Детали заказа
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>Номер заказа:</strong> #{orderNumber}
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>Дата заказа:</strong> {new Date().toLocaleDateString('ru-RU')}
              </Text>
              <Text className="text-[14px] leading-[24px] text-black">
                <strong>Сумма заказа:</strong> {totalAmount}
              </Text>
              {subtotal && (
                <Text className="text-[14px] leading-[24px] text-black">
                  <strong>Стоимость товаров:</strong> {subtotal}
                </Text>
              )}
              {shippingCost && (
                <Text className="text-[14px] leading-[24px] text-black">
                  <strong>Стоимость доставки:</strong> {shippingCost}
                </Text>
              )}
            </Section>

            <Section className="mb-[32px]">
              <Text className="text-[16px] font-semibold text-black mb-[16px]">
                Состав заказа
              </Text>
              {items.map((item, index) => (
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

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-6 py-3 text-center text-[14px] font-semibold text-white no-underline hover:bg-gray-800"
                href={orderUrl}
              >
                Посмотреть детали заказа
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Что дальше?</strong>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              • Мы обработаем ваш заказ в течение 24 часов
              <br />• Вы получите уведомление о статусе заказа
              <br />• При возникновении вопросов свяжитесь с нашей поддержкой
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Это письмо отправлено автоматически. Если у вас есть вопросы,
              свяжитесь с нашей поддержкой.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
