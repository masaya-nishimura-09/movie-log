import { cookies } from "next/headers";
import { resolveTimeZone, timeZoneCookie } from "@/lib/date/time-zone";

export async function getTimeZone(): Promise<string> {
  const store = await cookies();
  return resolveTimeZone(store.get(timeZoneCookie)?.value);
}
