import { type FormEvent, startTransition, useActionState } from "react";
import type { ActionResult } from "@/actions/action-result";

export function useFormSubmit<T>(
  action: (
    previous: ActionResult<T> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<T>>,
  prepare?: (formData: FormData) => void,
) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const failure = state?.success === false ? state : undefined;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    prepare?.(formData);
    startTransition(() => formAction(formData));
  };

  return { state, failure, pending, submit };
}
