"use client"

import { Toaster } from "sonner"

export function ToastProvider() {
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: "oklch(0.16 0.02 250)",
          border: "1px solid oklch(0.25 0.02 250)",
          color: "oklch(0.95 0.01 250)",
        },
      }}
    />
  )
}
