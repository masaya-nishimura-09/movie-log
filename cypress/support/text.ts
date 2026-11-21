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

export function weekdayDate(date: Date, lang = "ja") {
  return new Intl.DateTimeFormat(lang, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(date);
}

export function formDate(date: Date, lang = "ja") {
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return new Intl.DateTimeFormat(lang, {
    year: sameYear ? undefined : "numeric",
    month: sameYear ? "numeric" : "2-digit",
    day: sameYear ? "numeric" : "2-digit",
    weekday: "short",
  }).format(date);
}
