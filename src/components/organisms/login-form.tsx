import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";

type LoginFormProps = {
  lang: Locale;
  dict: Dictionary["login"];
  passwordDict: Dictionary["passwordInput"];
};

export function LoginForm({ lang, dict, passwordDict }: LoginFormProps) {
  return (
    <form className="flex flex-col gap-5">
      <FormField label={dict.email} htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
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
          autoComplete="current-password"
          minLength={8}
          maxLength={72}
          required
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
      <Button type="button" size="lg" className="mt-1 w-full">
        {dict.submit}
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        {dict.toRegisterPrompt}{" "}
        <Link
          href={`/${lang}/register`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {dict.toRegister}
        </Link>
      </p>
    </form>
  );
}
