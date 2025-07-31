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

export function WelcomeEmail({ username = "username" }: { username: string }) {
	return (
		<Html>
			<Head />
			<Preview>Добро пожаловать в {env.SITE_NAME}</Preview>
			<Tailwind config={emailTailwindConfig}>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							Добро пожаловать в <strong>{env.SITE_NAME}</strong>
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Здравствуйте, {username}!
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Мы рады приветствовать вас! Ваша учетная запись успешно создана на{" "}
							<strong>{env.SITE_NAME}</strong>.
						</Text>
						<Section className="mb-[32px] mt-[32px] text-center">
							<Button
								className="rounded bg-[#000000] px-4 py-3 text-center text-[12px] font-semibold text-white no-underline"
								href={env.SITE_URL}
							>
								Начать работу
							</Button>
						</Section>
						<Text className="text-[14px] leading-[24px] text-black">
							Если кнопка выше не работает, скопируйте и вставьте эту ссылку в
							ваш браузер:{" "}
							<Link href={env.SITE_URL} className="text-blue-600 no-underline">
								{env.SITE_URL}
							</Link>
						</Text>
						<Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
						<Text className="text-[12px] leading-[24px] text-[#666666]">
							Это письмо отправлено на адрес{" "}
							<span className="text-black">{username}</span>. Если вы не
							создавали учетную запись на {env.SITE_NAME}, проигнорируйте это письмо или
							свяжитесь с нашей службой поддержки, если у вас есть вопросы.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
