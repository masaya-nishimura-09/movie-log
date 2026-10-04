"use client";

import { Toast } from "@base-ui/react/toast";
import {
  type FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
} from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { User } from "@/schemas/user/user";

type AccountFormProps = {
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  user: User;
  dict: Dictionary["account"];
  passwordDict: Dictionary["passwordInput"];
  counterTemplate: string;
};

export function AccountForm({
  action,
  user,
  dict,
  passwordDict,
  counterTemplate,
}: AccountFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const toastManager = Toast.useToastManager();
  const toastManagerRef = useRef(toastManager);
  toastManagerRef.current = toastManager;
  const formRef = useRef<HTMLFormElement>(null);
  const failure = state?.success === false ? state : undefined;
  const message = (key: string) =>
    key in dict ? dict[key as keyof typeof dict] : dict.unexpectedError;

  useEffect(() => {
    if (!state?.success) return;
    toastManagerRef.current.add({ title: dict.saved, type: "success" });
    const password = formRef.current?.elements.namedItem("password");
    if (password instanceof HTMLInputElement) password.value = "";
  }, [state, dict.saved]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-5.5"
    >
      {failure && !failure.errors && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-destructive-foreground text-sm"
        >
          {message(failure.messageKey)}
        </p>
      )}
      <FormField
        label={dict.username}
        htmlFor="username"
        error={failure?.errors?.username && dict.usernameError}
      >
        <CountedInput
          id="username"
          name="username"
          maxLength={100}
          required
          defaultValue={user.username}
          counterTemplate={counterTemplate}
        />
      </FormField>
      <FormField
        label={dict.email}
        htmlFor="email"
        error={failure?.errors?.email && dict.emailError}
      >
        <Input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={user.email}
        />
      </FormField>
      <FormField
        label={dict.password}
        htmlFor="password"
        hint={dict.passwordHint}
        error={failure?.errors?.password && dict.passwordError}
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
      <div className="flex justify-end gap-2 border-secondary border-t pt-3.5">
        <Button
          type="reset"
          variant="outline"
          className="hidden md:inline-flex"
        >
          {dict.cancel}
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="h-12 flex-1 md:h-11 md:flex-none"
        >
          {dict.save}
        </Button>
      </div>
    </form>
  );
}
