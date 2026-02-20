"use client";

import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"        // adds class="light" or "dark" to <html>
      defaultTheme="light"     // fallback theme during SSR
      enableSystem={true}      // respects system preference
    >
      {children}
    </ThemeProvider>
  );
}
