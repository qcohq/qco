import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import type React from "react";
import { Resend } from "resend";

import { env } from "./env";

export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

export interface Emails {
  react: React.ReactElement;
  subject: string;
  to: string[];
  from?: string;
}

export type EmailHtml = {
  html: string;
  subject: string;
  to: string[];
  from?: string;
};

const DEFAULT_FROM_EMAIL = "noreply@qco.me";

export const sendEmail = async (email: Emails) => {
  const from = email.from || env.EMAIL_FROM || DEFAULT_FROM_EMAIL;

  if (env.EMAIL_SANDBOX_ENABLED === "true") {
    const mailOptions: Mail.Options = {
      from,
      to: email.to,
      html: await render(email.react),
      subject: email.subject,
    };
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_SANDBOX_HOST,
      secure: false,
      port: 2500,
    });
    return transporter.sendMail(mailOptions);
  }
  if (!resend) {

    return Promise.resolve();
  }
  await resend.emails.send({ ...email, from });
};

export const sendEmailHtml = async (email: EmailHtml) => {
  const from = email.from || env.EMAIL_FROM || DEFAULT_FROM_EMAIL;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      to: email.to,
      from,
      subject: email.subject,
      html: email.html,
    }),
  });
};
