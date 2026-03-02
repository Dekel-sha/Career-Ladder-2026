import * as React from "react";
import { cn } from "./utils";

export type ChipVariant = 'low' | 'medium' | 'high';

interface ChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ChipVariant;
  children: React.ReactNode;
}

/**
 * Chips component from Vibe UI Kit
 * Used for priority indicators with color-coded backgrounds
 * Uses CSS variables from globals.css for full design system integration
 */
export const Chips = React.forwardRef<HTMLDivElement, ChipsProps>(
  ({ variant = 'low', className, children, ...props }, ref) => {
    
    // Get CSS variable name for background color based on variant
    const getBackgroundVar = () => {
      if (variant === 'low') return '--primary-selected-color';
      if (variant === 'medium') return '--warning-color-selected';
      if (variant === 'high') return '--negative-color-selected';
      return '--primary-selected-color';
    };

    const backgroundVar = getBackgroundVar();

    return (
      <div
        ref={ref}
        className={className}
        style={{
          display: 'inline-flex',
          width: 'fit-content',
          height: '24px',
          padding: '0 8px',
          alignItems: 'center',
          borderRadius: '4px',
          background: `var(${backgroundVar})`,
        }}
        {...props}
      >
        <span
          style={{
            color: 'var(--primary-text-color)',
            fontFamily: 'Figtree, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
            whiteSpace: 'nowrap',
            textTransform: 'none',
            fontFeatureSettings: "'liga' off, 'clig' off",
          }}
        >
          {children}
        </span>
      </div>
    );
  }
);

Chips.displayName = "Chips";
