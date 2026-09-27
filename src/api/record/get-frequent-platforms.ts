import { mockRecords } from "@/api/record/mock-records";
import type { Platform } from "@/schemas/record/enums";

export async function getFrequentPlatforms(limit: number): Promise<Platform[]> {
  const counts = new Map<Platform, number>();
  for (const { platform } of mockRecords) {
    counts.set(platform, (counts.get(platform) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([platform]) => platform);
}
