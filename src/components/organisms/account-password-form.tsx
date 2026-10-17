"use client";

import type { ActionResult } from "@/actions/action-result";
import { AccountFormCard } from "@/components/molecules/account-form-card";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";

type AccountPasswordFormProps = {
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  dict: Dictionary["account"];
  passwordDict: Dictionary["passwordInput"];
};

export function AccountPasswordForm({
  action,
  dict,
  passwordDict,
}: AccountPasswordFormProps) {
  return (
    <AccountFormCard
      title={dict.passwordTitle}
      action={action}
      dict={dict}
      clearOnSuccess={["oldPassword", "newPassword"]}
    >
      {(failure) => (
        <>
          <FormField
            label={dict.currentPassword}
            htmlFor="oldPassword"
            error={failure?.errors?.oldPassword && dict.passwordError}
          >
            <PasswordInput
              id="oldPassword"
              name="oldPassword"
              autoComplete="current-password"
              required
              minLength={8}
              maxLength={72}
              showLabel={passwordDict.show}
              hideLabel={passwordDict.hide}
            />
          </FormField>
          <FormField
            label={dict.newPassword}
            htmlFor="newPassword"
            hint={dict.passwordHint}
            error={failure?.errors?.newPassword && dict.passwordError}
          >
            <PasswordInput
              id="newPassword"
              name="newPassword"
              autoComplete="new-password"
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
