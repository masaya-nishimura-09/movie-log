"use client";

import type { ActionResult } from "@/actions/action-result";
import { Input } from "@/components/atoms/input";
import { AccountFormCard } from "@/components/molecules/account-form-card";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { User } from "@/schemas/user/user";

type AccountEmailFormProps = {
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  user: User;
  dict: Dictionary["account"];
  passwordDict: Dictionary["passwordInput"];
};

export function AccountEmailForm({
  action,
  user,
  dict,
  passwordDict,
}: AccountEmailFormProps) {
  return (
    <AccountFormCard
      title={dict.emailTitle}
      action={action}
      dict={dict}
      clearOnSuccess={["password"]}
    >
      {(failure) => (
        <>
          <FormField
            label={dict.email}
            htmlFor="email"
            error={failure?.errors?.email && dict.emailError}
          >
            <Input
              key={user.email}
              id="email"
              name="email"
              type="email"
              required
              defaultValue={user.email}
            />
          </FormField>
          <FormField
            label={dict.currentPassword}
            htmlFor="emailPassword"
            hint={dict.currentPasswordHint}
            error={failure?.errors?.password && dict.passwordError}
          >
            <PasswordInput
              id="emailPassword"
              name="password"
              autoComplete="current-password"
              required
              minLength={8}
              maxLength={72}
              showLabel={passwordDict.show}
              hideLabel={passwordDict.hide}
            />
          </FormField>
        </>
      )}
    </AccountFormCard>
  );
}
