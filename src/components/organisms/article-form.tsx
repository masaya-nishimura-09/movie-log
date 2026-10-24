"use client";

import type { JSONContent } from "@tiptap/react";
import Link from "next/link";
import type { ActionResult } from "@/actions/action-result";
import { Button, buttonVariants } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { ArticleEditor } from "@/components/molecules/article-editor";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import { dictMessage } from "@/lib/text/dict-message";
import { contentRequiredMessage } from "@/schemas/article/article-input";

type ArticleFormProps = {
  action: (
    previous: ActionResult<never> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<never>>;
  backHref: string;
  values: { title: string; content?: JSONContent };
  dict: Dictionary["articleForm"];
  editorDict: Dictionary["articleEditor"];
  counterTemplate: string;
};

export function ArticleForm({
  action,
  backHref,
  values,
  dict,
  editorDict,
  counterTemplate,
}: ArticleFormProps) {
  const { failure, pending, submit } = useFormSubmit(action);
  const titleError = failure?.errors?.title ? dict.errors.title : undefined;
  const contentErrors = failure?.errors?.content;
  const contentError = contentErrors
    ? contentErrors.includes(contentRequiredMessage)
      ? dict.errors.contentRequired
      : dict.errors.content
    : undefined;

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-5 md:px-10 md:pt-8"
    >
      {failure && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      <section className="flex flex-col gap-4.5 rounded-[18px] bg-card p-4.5 md:p-5.5">
        <FormField
          label={dict.title}
          htmlFor="title"
          required
          requiredLabel={dict.required}
          error={titleError}
        >
          <CountedInput
            id="title"
            name="title"
            maxLength={255}
            defaultValue={values.title}
            counterTemplate={counterTemplate}
            aria-invalid={titleError ? true : undefined}
          />
        </FormField>
        <FormField
          label={dict.content}
          required
          requiredLabel={dict.required}
          error={contentError}
        >
          <ArticleEditor
            name="content"
            defaultValue={values.content}
            dict={editorDict}
            invalid={Boolean(contentError)}
          />
        </FormField>
      </section>
      <div className="mb-6 flex justify-end gap-2">
        <Link
          href={backHref}
          className={buttonVariants({ variant: "outline" })}
        >
          {dict.cancel}
        </Link>
        <Button type="submit" disabled={pending}>
          {dict.save}
        </Button>
      </div>
    </form>
  );
}
