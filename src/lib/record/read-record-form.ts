export function readRecordForm(formData: FormData) {
  const text = (name: string) => String(formData.get(name) ?? "");
  const texts = (name: string) => formData.getAll(name).map(String);

  const rows = new Map<number, { personName: string; creditRole: string }>();
  for (const [key, value] of formData) {
    const match = /^credits\.(\d+)\.(personName|creditRole)$/.exec(key);
    if (!match) continue;
    const row = rows.get(Number(match[1])) ?? {
      personName: "",
      creditRole: "",
    };
    row[match[2] as "personName" | "creditRole"] = String(value).trim();
    rows.set(Number(match[1]), row);
  }

  return {
    title: text("title"),
    watchedAt: text("watchedAt"),
    score: text("score"),
    platform: text("platform"),
    releaseYear: text("releaseYear"),
    runtime: text("runtime") || "0",
    genres: texts("genres"),
    countries: texts("countries"),
    language: text("language"),
    credits: [...rows.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, row]) => row)
      .filter((row) => row.personName !== ""),
    posterUrl: text("posterUrl").trim(),
    moodTags: texts("moodTags"),
    memo: text("memo"),
  };
}
