const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const notCountries = /^(AA|Q[M-Z]|X[A-JL-Z]|ZZ|EU|EZ|UN)$/;

function canonical(code: string): string {
  return new Intl.Locale(`und-${code}`).region ?? code;
}

const countryCodes = [...letters]
  .flatMap((first) => [...letters].map((second) => `${first}${second}`))
  .filter((code) => !notCountries.test(code) && canonical(code) === code);

const namesByLang = new Map<string, Map<string, string>>();

function codesByName(lang: string): Map<string, string> {
  const cached = namesByLang.get(lang);
  if (cached) return cached;
  const names = new Intl.DisplayNames(lang, {
    type: "region",
    fallback: "none",
  });
  const map = new Map<string, string>();
  for (const code of countryCodes) {
    const name = names.of(code);
    if (name) map.set(name.toLowerCase(), code);
  }
  namesByLang.set(lang, map);
  return map;
}

export function countryCode(input: string, lang: string): string | undefined {
  const text = input.trim();
  if (text === "") return undefined;
  const byName = codesByName(lang);
  if (/^[A-Za-z]{2}$/.test(text)) {
    const code = canonical(text.toUpperCase());
    if (countryCodes.includes(code)) return code;
  }
  return byName.get(text.toLowerCase());
}
