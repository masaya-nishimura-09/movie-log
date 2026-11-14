"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { PendingContent } from "@/components/atoms/pending-content";
import { DropdownMenuItem } from "@/components/molecules/dropdown-menu";

export function LogoutMenuItem({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <DropdownMenuItem
      nativeButton
      closeOnClick={false}
      disabled={pending}
      aria-busy={pending || undefined}
      render={<button type="submit" className="w-full" />}
    >
      <PendingContent
        pending={pending}
        icon={<LogOut aria-hidden />}
        label={label}
        pendingLabel={pendingLabel}
      />
    </DropdownMenuItem>
  );
}
