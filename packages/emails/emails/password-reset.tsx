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

import { emailTailwindConfig } from "../tailwind";
import { env } from "../env";

export function PasswordResetEmail({
  username = "username",
  resetLink,
}: {
  username: string;
  resetLink: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Сброс пароля - {env.SITE_NAME}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Сброс пароля
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Здравствуйте, {username}!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Мы получили запрос на сброс пароля для вашей учетной записи на{" "}
              <strong>{env.SITE_NAME}</strong>. Нажмите на кнопку ниже, чтобы сбросить
              пароль:
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={resetLink}
              >
                Сбросить пароль
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              Если кнопка выше не работает, скопируйте и вставьте эту ссылку в
              ваш браузер:{" "}
              <Link href={resetLink} className="text-blue-600 no-underline">
                {resetLink}
              </Link>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Ссылка для сброса пароля действительна в течение 1 часа. Если вы
              не запрашивали сброс пароля, проигнорируйте это письмо или
              свяжитесь с нашей службой поддержки, если у вас есть вопросы.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              Это письмо отправлено на адрес{" "}
              <span className="text-black">{username}</span>. Если вы не
              запрашивали сброс пароля, проигнорируйте это письмо или свяжитесь
              с нашей службой поддержки, если у вас есть вопросы.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
