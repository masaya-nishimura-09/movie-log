export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; messageKey: string; errors?: Record<string, string[]> };
