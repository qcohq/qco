import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Tailwind,
	Text,
} from "@react-email/components";
import { emailTailwindConfig } from "../../tailwind";

interface OrderDeletedEmailProps {
	username: string;
	orderId: string;
	orderNumber: string;
	createdAt: string;
	totalAmount: string;
}

export default function OrderDeletedEmail({
	username,
	orderId,
	orderNumber,
	createdAt,
	totalAmount,
}: OrderDeletedEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Заказ №{orderNumber} удалён</Preview>
			<Tailwind config={emailTailwindConfig}>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							Заказ удалён
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Здравствуйте, {username}!
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Ваш заказ был удалён из системы.
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							<strong>Номер заказа:</strong> {orderNumber}
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							<strong>Дата заказа:</strong> {createdAt}
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							<strong>Сумма заказа:</strong> {totalAmount}
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Если вы не запрашивали удаление заказа или у вас возникли вопросы,
							пожалуйста, свяжитесь с нашей службой поддержки.
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
