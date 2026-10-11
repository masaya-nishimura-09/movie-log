import {
  buildContactMail,
  type ContactContext,
} from "@/lib/contact/contact-mail";
import type { ContactInput } from "@/schemas/contact/contact";

const resendUrl = "https://api.resend.com/emails";
const defaultFrom = "Cinelog <onboarding@resend.dev>";

export async function sendContactMail(
  input: ContactInput,
  context: ContactContext,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  if (!to) throw new Error("CONTACT_TO_EMAIL is not set");

  const mail = buildContactMail(input, context);
  const response = await fetch(resendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? defaultFrom,
      to: [to],
      reply_to: input.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend returned ${response.status}`);
  }
}
