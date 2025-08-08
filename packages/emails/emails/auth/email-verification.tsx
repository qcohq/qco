import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { emailTailwindConfig } from "../../tailwind";
import { env } from "../../env";

interface EmailVerificationProps {
  otp: string;
  email: string;
  url?: string;
}

export function EmailVerification({ otp, email, url }: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Подтвердите ваш email адрес - {env.SITE_NAME}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Подтверждение email адреса
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Здравствуйте!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Спасибо за регистрацию на {env.SITE_NAME}. Для завершения регистрации и
              активации вашей учетной записи, пожалуйста, подтвердите ваш email
              адрес одним из способов ниже:
            </Text>

            {url && (
              <Section className="mb-[32px] mt-[32px] text-center">
                <Button
                  className="rounded bg-[#000000] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
                  href={url}
                >
                  Подтвердить email адрес
                </Button>
              </Section>
            )}

            <Text className="text-[14px] leading-[24px] text-black">
              Или используйте следующий код подтверждения:
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Важная информация:</strong>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              • Код действителен в течение 24 часов
              <br />• Введите код на странице подтверждения
              <br />• Если вы не регистрировались на {env.SITE_NAME}, проигнорируйте это
              письмо
            </Text>

            {url && (
              <Text className="mt-[20px] text-[14px] leading-[24px] text-black">
                Если кнопка выше не работает, скопируйте и вставьте эту ссылку в
                ваш браузер:{" "}
                <Link href={url} className="text-blue-600 no-underline">
                  {url}
                </Link>
              </Text>
            )}

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Это письмо отправлено на адрес {email}. Если у вас возникли
              вопросы или проблемы, пожалуйста, свяжитесь с нашей службой
              поддержки.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
