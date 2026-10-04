"use client";

import { Toast } from "@base-ui/react/toast";
import { CircleCheck } from "lucide-react";

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-[0_3px_0_0_var(--primary-edge)] transition-all duration-200 data-ending-style:-translate-y-2 data-starting-style:-translate-y-2 data-ending-style:opacity-0 data-starting-style:opacity-0"
    >
      {toast.type === "success" && (
        <CircleCheck className="size-5 shrink-0" aria-hidden />
      )}
      <Toast.Title className="font-medium text-sm" />
    </Toast.Root>
  ));
}

export function Toaster() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="pointer-events-none fixed inset-x-4 top-17 z-[60] flex flex-col items-center gap-2 md:top-20">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  );
}
