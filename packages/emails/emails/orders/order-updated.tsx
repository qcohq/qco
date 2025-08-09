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
import { env } from "../../env";
import { translateOrderStatus } from "../../src/utils/order-status-translations";

const defaultOrderUrl = `${env.SITE_URL}/orders`;

interface OrderUpdatedEmailProps {
  username: string;
  orderId: string;
  orderNumber: string;
  orderUrl?: string;
  changes: Array<{
    field: string;
    oldValue: string;
    newValue: string;
  }>;
  status?: string;
}

export default function OrderUpdatedEmail({
  username,
  orderId,
  orderNumber,
  orderUrl = defaultOrderUrl,
  changes,
  status,
}: OrderUpdatedEmailProps) {
  const translatedStatus = status ? translateOrderStatus(status) : undefined;

  return (
    <Html>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Preview>Заказ №{orderNumber} обновлён</Preview>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Заказ обновлён
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Здравствуйте, {username}!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              В ваш заказ были внесены изменения:
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Номер заказа:</strong> {orderNumber}
            </Text>
            <Section className="mb-[32px] mt-[32px]">
              {changes?.map((change) => (
                <Text
                  key={change.field}
                  className="text-[14px] leading-[24px] text-black"
                >
                  <strong>{change.field}:</strong> {change.oldValue} →{" "}
                  {change.newValue}
                </Text>
              ))}
              {translatedStatus && (
                <Text className="text-[14px] leading-[24px] text-black">
                  <strong>Новый статус:</strong> {translatedStatus}
                </Text>
              )}
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={orderUrl}
              >
                Посмотреть детали заказа
              </Button>
            </Section>
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
