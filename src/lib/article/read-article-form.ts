export function readArticleForm(formData: FormData) {
  const text = (name: string) => String(formData.get(name) ?? "");

  let content: unknown;
  try {
    content = JSON.parse(text("content"));
  } catch {
    content = undefined;
  }

  return {
    title: text("title"),
    content,
  };
}
