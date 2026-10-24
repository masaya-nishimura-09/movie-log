const maxLength = 80;

export function firstSentence(text: string): string {
  const trimmed = text.trim();
  const end = trimmed.search(/[。！？!?\n]/);
  const sentence = end === -1 ? trimmed : trimmed.slice(0, end + 1).trim();
  const chars = Array.from(sentence);
  return chars.length > maxLength
    ? `${chars.slice(0, maxLength).join("")}…`
    : sentence;
}
