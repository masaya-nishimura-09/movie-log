"use client";

import type { ActionResult } from "@/actions/action-result";
import { AccountFormCard } from "@/components/molecules/account-form-card";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { User } from "@/schemas/user/user";

type AccountUsernameFormProps = {
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  user: User;
  dict: Dictionary["account"];
  counterTemplate: string;
};

export function AccountUsernameForm({
  action,
  user,
  dict,
  counterTemplate,
}: AccountUsernameFormProps) {
  return (
    <AccountFormCard title={dict.usernameTitle} action={action} dict={dict}>
      {(failure) => (
        <FormField
          label={dict.username}
          htmlFor="username"
          error={failure?.errors?.username && dict.usernameError}
        >
          <CountedInput
            key={user.username}
            id="username"
            name="username"
            maxLength={100}
            required
            defaultValue={user.username}
            counterTemplate={counterTemplate}
          />
        </FormField>
      )}
    </AccountFormCard>
  );
}
