import * as React from "react";

import { cn } from "./utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-150",
        // Vibe UI Kit states
        "border-input bg-input-background placeholder:text-muted-foreground/60 text-foreground",
        "hover:border-[var(--vibe-neutral-500)]",
        "focus:border-ring focus:ring-1 focus:ring-ring",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
