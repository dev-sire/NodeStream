"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export default function ThemeProviders({ children, ...props }: React.ComponentProps<typeof ThemeProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  );
}
