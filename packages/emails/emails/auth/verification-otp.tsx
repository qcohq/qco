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

import { emailTailwindConfig } from "../../tailwind";
import { env } from "../../env";

type VerificationType = "sign-in" | "email-verification" | "forget-password";

interface VerificationOTPProps {
  otp: string;
  type: VerificationType;
  email: string;
}

const getVerificationInfo = (type: VerificationType) => {
  switch (type) {
    case "sign-in":
      return {
        title: "Вход в аккаунт",
        preview: `Код подтверждения для входа - ${env.SITE_NAME}`,
        description:
          `Для входа в ваш аккаунт на ${env.SITE_NAME} используйте следующий код подтверждения:`,
        validity: "10 минут",
      };
    case "email-verification":
      return {
        title: "Подтверждение email",
        preview: `Подтверждение нового email адреса - ${env.SITE_NAME}`,
        description:
          `Для подтверждения вашего нового email адреса на ${env.SITE_NAME} используйте следующий код:`,
        validity: "10 минут",
      };
    case "forget-password":
      return {
        title: "Сброс пароля",
        preview: `Код для сброса пароля - ${env.SITE_NAME}`,
        description:
          `Для сброса пароля вашей учетной записи на ${env.SITE_NAME} используйте следующий код:`,
        validity: "10 минут",
      };
  }
};

export function VerificationOTP({ otp, type, email }: VerificationOTPProps) {
  const info = getVerificationInfo(type);

  return (
    <Html>
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Preview>{info.preview}</Preview>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {info.title}
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Здравствуйте!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              {info.description}
            </Text>
            <Section className="my-[32px] text-center">
              <Text className="text-[32px] font-bold tracking-[0.5em] text-black">
                {otp}
              </Text>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>Важная информация:</strong>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              • Код действителен в течение {info.validity}
              <br />• Введите код на странице подтверждения
              <br />• Если вы не запрашивали этот код, проигнорируйте это письмо
            </Text>
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
