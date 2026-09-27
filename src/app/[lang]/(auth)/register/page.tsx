import { RegisterForm } from "@/components/organisms/register-form";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export default async function RegisterPage() {
  const [lang, dict] = await Promise.all([getLocale(), getDictionary()]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-bold text-foreground text-xl">
          {dict.register.title}
        </h1>
        <p className="text-muted-foreground text-xs">
          {dict.register.description}
        </p>
      </div>
      <RegisterForm
        lang={lang}
        dict={dict.register}
        passwordDict={dict.passwordInput}
        counterTemplate={dict.characterCount}
      />
    </div>
  );
}
