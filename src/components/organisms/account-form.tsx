import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { User } from "@/schemas/user/user";

type AccountFormProps = {
  user: User;
  dict: Dictionary["account"];
  passwordDict: Dictionary["passwordInput"];
  counterTemplate: string;
};

export function AccountForm({
  user,
  dict,
  passwordDict,
  counterTemplate,
}: AccountFormProps) {
  return (
    <form className="flex flex-col gap-4 rounded-2xl border bg-card p-4 md:p-5.5">
      <FormField label={dict.username} htmlFor="username">
        <CountedInput
          id="username"
          name="username"
          maxLength={100}
          required
          defaultValue={user.username}
          counterTemplate={counterTemplate}
        />
      </FormField>
      <FormField label={dict.email} htmlFor="email">
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
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
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
        <Button type="button" className="h-12 flex-1 md:h-11 md:flex-none">
          {dict.save}
        </Button>
      </div>
    </form>
  );
}
