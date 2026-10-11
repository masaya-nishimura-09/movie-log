export function redirect(url: string): never {
  throw new Error(`REDIRECT ${url}`);
}

export function notFound(): never {
  throw new Error("NOT_FOUND");
}
