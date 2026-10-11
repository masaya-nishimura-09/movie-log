export function fill(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function pattern(template: string) {
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/\\\{\w+\\\}/g, ".+")}$`);
}

export function shows(...texts: string[]) {
  for (const text of texts) cy.contains(text).should("exist");
}

export function longDate(date: Date, lang = "ja") {
  return new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
