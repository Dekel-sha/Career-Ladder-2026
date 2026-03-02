import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-lg border px-4 py-3 text-sm outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Vibe UI Kit input states
        "border-input bg-input-background placeholder:text-muted-foreground/60 text-foreground",
        "hover:border-[var(--vibe-neutral-500)]",
        "focus:border-ring focus:ring-1 focus:ring-ring",
        "selection:bg-primary selection:text-primary-foreground",
        "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
        "transition-all duration-150",
        "file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
