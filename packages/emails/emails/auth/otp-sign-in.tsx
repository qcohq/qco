import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Tailwind,
	Text,
} from "@react-email/components";

import { emailTailwindConfig } from "../../tailwind";
import { env } from "../../env";

export default function OtpSignInEmail({
	otp,
	isSignUp = false,
}: {
	otp: string;
	isSignUp?: boolean;
}) {
	const action = isSignUp ? "Sign Up" : "Sign In";

	return (
		<Html>
			<Tailwind config={emailTailwindConfig}>
				<Head />
				<Preview>{`Your OTP Code for ${action} - ${env.SITE_NAME}`}</Preview>
				<Body className="mx-auto my-auto bg-white font-sans">
					<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
						<Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
							{action} to <strong>{env.SITE_NAME}</strong>
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							Hello,
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Your One-Time Password (OTP) for {action.toLowerCase()} is:
						</Text>
						<Text className="my-[20px] text-center text-[24px] font-bold">
							{otp}
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							Please use this code to complete your {action.toLowerCase()}{" "}
							process. This code will expire in 10 minutes.
						</Text>
						<Text className="text-[14px] leading-[24px] text-black">
							If you didn't request this code, please ignore this email.
						</Text>
						<Text className="mt-[20px] text-[12px] leading-[24px] text-[#666666]">
							This is an automated message, please do not reply to this email.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
