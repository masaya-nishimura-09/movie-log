import { z } from "zod";

const siteverifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const siteverifyResponseSchema = z.object({ success: z.boolean() });

export async function verifyTurnstile(
  token: string,
  remoteIp: string | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new Error("TURNSTILE_SECRET_KEY is not set");

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  const response = await fetch(siteverifyUrl, { method: "POST", body });
  if (!response.ok) {
    throw new Error(`Turnstile siteverify returned ${response.status}`);
  }
  return siteverifyResponseSchema.parse(await response.json()).success;
}
