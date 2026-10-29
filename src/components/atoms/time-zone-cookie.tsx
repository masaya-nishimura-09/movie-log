"use client";

import { useEffect } from "react";
import { timeZoneCookie } from "@/lib/date/time-zone";

const cookieMaxAgeMs = 365 * 24 * 60 * 60 * 1000;

export function TimeZoneCookie() {
  useEffect(() => {
    void cookieStore.set({
      name: timeZoneCookie,
      value: Intl.DateTimeFormat().resolvedOptions().timeZone,
      path: "/",
      expires: Date.now() + cookieMaxAgeMs,
    });
  }, []);

  return null;
}
