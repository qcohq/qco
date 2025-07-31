import {
  Body,
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

export function EmailChangeVerification({ otp }: { otp: string }) {
  return (
    <Html>
      <Head />
      <Preview>Подтверждение нового email адреса - {env.SITE_NAME}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Подтверждение нового email адреса
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Здравствуйте!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Мы получили запрос на изменение email адреса вашей учетной записи
              на {env.SITE_NAME}. Для завершения этого процесса, пожалуйста, используйте
              следующий код подтверждения:
            </Text>
            <Section className="my-[32px] text-center">
              <Text className="text-[32px] font-bold tracking-[0.5em] text-black">
                {otp}
              </Text>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Важно:</strong>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              • Код действителен в течение 10 минут
              <br />• Введите код на странице подтверждения
              <br />• Если вы не запрашивали изменение email, проигнорируйте это
              письмо
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Это автоматическое сообщение. Если у вас возникли вопросы или
              проблемы, пожалуйста, свяжитесь с нашей службой поддержки.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
