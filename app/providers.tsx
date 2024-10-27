"use client"
import { ThemeProvider } from "@/components/ui/theme-provider";
import React from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    )
  }