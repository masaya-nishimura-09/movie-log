import { headers } from "next/headers";
import { z } from "zod";
import { logError } from "@/lib/log/logger";

const siteverifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const siteverifyResponseSchema = z.object({ success: z.boolean() });

const useMock = process.env.USE_MOCK === "true";

async function siteverify(
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

export async function verifyTurnstile(
  formData: FormData,
): Promise<"verificationFailed" | "unexpectedError" | undefined> {
  if (useMock) return undefined;

  const token = String(formData.get("cf-turnstile-response") ?? "");
  if (token === "") return "verificationFailed";
  try {
    const remoteIp = (await headers()).get("x-real-ip") ?? undefined;
    return (await siteverify(token, remoteIp))
      ? undefined
      : "verificationFailed";
  } catch (error) {
    logError("error", "turnstile_verify_failed", error);
    return "unexpectedError";
  }
}

export function turnstileSiteKey(): string | undefined {
  return useMock ? undefined : process.env.TURNSTILE_SITE_KEY;
}
