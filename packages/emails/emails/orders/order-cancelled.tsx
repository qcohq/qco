import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface OrderCancelledEmailProps {
    username: string;
    orderNumber: string;
    orderUrl?: string;
}

export default function OrderCancelledEmail({
    username,
    orderNumber,
    orderUrl,
}: OrderCancelledEmailProps) {
    return (
        <Html>
            <Tailwind>
                <Head />
                <Preview>Заказ №{orderNumber} отменён</Preview>
                <Body className="bg-white font-sans">
                    <Container className="mx-auto py-8 px-4">
                        <Section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <Heading className="text-2xl font-bold text-gray-900 mb-4">
                                Заказ отменён
                            </Heading>

                            <Text className="text-gray-700 mb-4">
                                Здравствуйте, {username}!
                            </Text>

                            <Text className="text-gray-700 mb-4">
                                К сожалению, ваш заказ №<strong>{orderNumber}</strong> был отменён.
                            </Text>

                            <Text className="text-gray-700 mb-4">
                                Если у вас есть вопросы по поводу отмены заказа, пожалуйста, свяжитесь с нашей службой поддержки.
                            </Text>

                            {orderUrl && (
                                <Section className="text-center">
                                    <Link
                                        href={orderUrl}
                                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-decoration-none hover:bg-blue-700"
                                    >
                                        Посмотреть детали заказа
                                    </Link>
                                </Section>
                            )}

                            <Text className="text-gray-600 text-sm mt-6">
                                Спасибо за понимание!
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
} 
