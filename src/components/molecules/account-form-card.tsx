"use client";

import { Toast } from "@base-ui/react/toast";
import { type ReactNode, useEffect, useRef } from "react";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { AccountSection } from "@/components/molecules/account-section";
import { useFormSubmit } from "@/hooks/use-form-submit";
import type { Dictionary } from "@/i18n/get-dictionary";
import { dictMessage } from "@/lib/text/dict-message";

type Failure = Extract<ActionResult<never>, { success: false }>;

type AccountFormCardProps<T> = {
  title: string;
  description: string;
  action: (
    previous: ActionResult<T> | undefined,
    formData: FormData,
  ) => Promise<ActionResult<T>>;
  dict: Dictionary["account"];
  resetOnSuccess?: string[];
  successNotice?: (data: T) => ReactNode;
  children: (failure: Failure | undefined) => ReactNode;
};

export function AccountFormCard<T>({
  title,
  description,
  action,
  dict,
  resetOnSuccess = [],
  successNotice,
  children,
}: AccountFormCardProps<T>) {
  const { state, failure, pending, submit } = useFormSubmit(action);
  const toastManager = Toast.useToastManager();
  const toastManagerRef = useRef(toastManager);
  toastManagerRef.current = toastManager;
  const formRef = useRef<HTMLFormElement>(null);
  const resetOnSuccessRef = useRef(resetOnSuccess);
  resetOnSuccessRef.current = resetOnSuccess;
  const hasNotice = successNotice !== undefined;

  useEffect(() => {
    if (!state?.success) return;
    if (!hasNotice) {
      toastManagerRef.current.add({ title: dict.saved, type: "success" });
    }
    for (const name of resetOnSuccessRef.current) {
      const field = formRef.current?.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.value = field.defaultValue;
    }
  }, [state, dict.saved, hasNotice]);

  return (
    <AccountSection title={title} description={description}>
      <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        className="flex flex-col"
      >
        {failure && !failure.errors && (
          <FormAlert className="mb-3.5">
            {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
          </FormAlert>
        )}
        {state?.success && successNotice && !pending && (
          <output className="mb-3.5 rounded-lg bg-secondary px-3.5 py-2.5 text-foreground text-sm">
            {successNotice(state.data)}
          </output>
        )}
        {children(failure)}
        <Button
          type="submit"
          size="sm"
          pending={pending}
          pendingLabel={dict.saving}
          className="mt-3.5 h-11 w-full px-4 md:h-10 md:w-auto md:self-start"
        >
          {dict.save}
        </Button>
      </form>
    </AccountSection>
  );
}
