"use client";

import { Toast } from "@base-ui/react/toast";
import { type ReactNode, useEffect, useRef } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import { dictMessage } from "@/lib/text/dict-message";

type Failure = Extract<ActionResult<null>, { success: false }>;

type AccountFormCardProps = {
  title: string;
  action: (
    previous: ActionResult<null> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<null>>;
  dict: Dictionary["account"];
  clearOnSuccess?: string[];
  children: (failure: Failure | undefined) => ReactNode;
};

export function AccountFormCard({
  title,
  action,
  dict,
  clearOnSuccess = [],
  children,
}: AccountFormCardProps) {
  const { state, failure, pending, submit } = useFormSubmit(action);
  const toastManager = Toast.useToastManager();
  const toastManagerRef = useRef(toastManager);
  toastManagerRef.current = toastManager;
  const formRef = useRef<HTMLFormElement>(null);
  const clearOnSuccessRef = useRef(clearOnSuccess);
  clearOnSuccessRef.current = clearOnSuccess;

  useEffect(() => {
    if (!state?.success) return;
    toastManagerRef.current.add({ title: dict.saved, type: "success" });
    for (const name of clearOnSuccessRef.current) {
      const field = formRef.current?.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.value = "";
    }
  }, [state, dict.saved]);

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-4 rounded-2xl bg-card p-4 md:p-5.5"
    >
      <h2 className="font-bold text-[15px] text-foreground">{title}</h2>
      {failure && !failure.errors && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      {children(failure)}
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
