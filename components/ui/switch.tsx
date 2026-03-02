"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch@1.1.3";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50",
        // Vibe UI Kit toggle states
        "data-[state=unchecked]:bg-[#D0D4DA]",
        "data-[state=checked]:bg-[#0066FF]",
        "hover:data-[state=unchecked]:bg-[#E6F0FF]",
        "focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2",
        "transition-all duration-150",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0",
          "transition-transform duration-150",
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
