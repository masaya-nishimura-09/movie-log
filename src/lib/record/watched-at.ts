import { startOfLocalDay } from "@/lib/date/start-of-local-day";

export function convertWatchedAt(formData: FormData) {
  formData.set(
    "watchedAt",
    startOfLocalDay(String(formData.get("watchedAt") ?? "")),
  );
}
