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
import { translateOrderStatus } from "../src/utils/order-status-translations";

const defaultOrderUrl = `${env.SITE_URL}/orders`;

interface OrderStatusUpdatedEmailProps {
	username: string;
	orderId: string;
	orderNumber: string;
	orderUrl?: string;
	status: string;
	comment?: string;
}

export function OrderStatusUpdatedEmail({
	username,
	orderId,
	orderNumber,
	orderUrl = defaultOrderUrl,
	status,
	comment,
}: OrderStatusUpdatedEmailProps) {
	const translatedStatus = translateOrderStatus(status);

	return (
		<Html>
			<Head />
			<Preview>Изменён статус заказа №{orderNumber}</Preview>
			<Tailwind config={emailTailwindConfig}>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							Обновление статуса заказа
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Здравствуйте, {username}!
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Статус вашего заказа <strong>№{orderNumber}</strong> был изменён на:{" "}
							<strong>{translatedStatus}</strong>.
						</Text>
						{comment && (
							<Text className="text-[14px] leading-[24px] text-black">
								<strong>Комментарий:</strong> {comment}
							</Text>
						)}
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
