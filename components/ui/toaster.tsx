"use client";

import { useTheme } from "next-themes";
import { Toaster as Toasty } from "sonner";

export default function Toaster() {
  const { theme } = useTheme();
  console.log(theme);

  if (typeof theme === "string") {
    return (
      <Toasty
        richColors
        theme={theme as "light" | "dark" | "system" | undefined}
      />
    );
  }
}
