import * as React from "react";
import { cn } from "./utils";

export type StatusLabelVariant = 'applied' | 'interview' | 'follow-up' | 'rejected' | 'offer' | 'accepted' | 'pending';
export type PriorityLabelVariant = 'high' | 'medium' | 'low';
export type LabelSize = 'default' | 'small';

interface StatusLabelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: StatusLabelVariant | PriorityLabelVariant;
  size?: LabelSize;
  children: React.ReactNode;
}

/**
 * StatusLabel component based on Career Ladder design system
 * Unified label component for status and priority badges
 * Uses CSS variables from globals.css for full design system integration
 */
export const StatusLabel = React.forwardRef<HTMLButtonElement, StatusLabelProps>(
  ({ variant = 'applied', size = 'default', className, children, ...props }, ref) => {
    
    // Get CSS variable name for background color based on variant
    const getBackgroundVar = () => {
      const variantLower = variant.toLowerCase();
      
      // Status colors
      if (variantLower === 'applied') return '--status-applied';
      if (variantLower === 'interview') return '--status-interview';
      if (variantLower === 'follow-up') return '--status-follow-up';
      if (variantLower === 'pending') return '--status-pending';
      if (variantLower === 'rejected') return '--status-rejected';
      if (variantLower === 'offer') return '--status-offer';
      if (variantLower === 'accepted') return '--status-accepted';
      
      // Priority colors
      if (variantLower === 'high') return '--priority-high';
      if (variantLower === 'medium') return '--priority-medium';
      if (variantLower === 'low') return '--priority-low';
      
      return '--primary';
    };

    const backgroundVar = getBackgroundVar();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center justify-center shrink-0 transition-opacity hover:opacity-90",
          className
        )}
        style={{
          display: 'flex',
          height: size === 'small' ? 'var(--label-height-small)' : 'var(--label-height)',
          padding: size === 'small' 
            ? '0 var(--label-padding-x-small)' 
            : '0 var(--label-padding-x)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--space-8)',
          flexShrink: 0,
          borderRadius: size === 'small' ? 'var(--label-border-radius-small)' : 'var(--label-border-radius)',
          background: `var(${backgroundVar})`,
        }}
        {...props}
      >
        <p 
          className="relative shrink-0 text-center text-nowrap text-white whitespace-pre"
          style={{
            fontFamily: 'Figtree, sans-serif',
            fontSize: size === 'small' ? 'var(--text-xs)' : 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: size === 'small' ? '16px' : '20px',
          }}
        >
          {children}
        </p>
      </button>
    );
  }
);

StatusLabel.displayName = "StatusLabel";

/**
 * OutlineLabel component - outlined version of StatusLabel
 * Uses CSS variables from globals.css for full design system integration
 */
interface OutlineLabelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: StatusLabelVariant | PriorityLabelVariant;
  size?: LabelSize;
  children: React.ReactNode;
}

export const OutlineLabel = React.forwardRef<HTMLButtonElement, OutlineLabelProps>(
  ({ variant = 'applied', size = 'default', className, children, ...props }, ref) => {
    
    // Get CSS variable name for border and text color based on variant
    const getColorVar = () => {
      const variantLower = variant.toLowerCase();
      
      // Status colors
      if (variantLower === 'applied') return '--status-applied';
      if (variantLower === 'interview') return '--status-interview';
      if (variantLower === 'follow-up') return '--status-follow-up';
      if (variantLower === 'pending') return '--status-pending';
      if (variantLower === 'rejected') return '--status-rejected';
      if (variantLower === 'offer') return '--status-offer';
      if (variantLower === 'accepted') return '--status-accepted';
      
      // Priority colors
      if (variantLower === 'high') return '--priority-high';
      if (variantLower === 'medium') return '--priority-medium';
      if (variantLower === 'low') return '--priority-low';
      
      return '--primary';
    };

    const colorVar = getColorVar();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center justify-center shrink-0 relative transition-opacity hover:opacity-90",
          className
        )}
        style={{
          display: 'flex',
          height: size === 'small' ? 'var(--label-height-small)' : 'var(--label-height)',
          padding: size === 'small' 
            ? '0 var(--label-padding-x-small)' 
            : '0 var(--label-padding-x)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--space-8)',
          flexShrink: 0,
          borderRadius: size === 'small' ? 'var(--label-border-radius-small)' : 'var(--label-border-radius)',
        }}
        {...props}
      >
        <div 
          aria-hidden="true" 
          className="absolute inset-0 pointer-events-none"
          style={{
            border: `1px solid var(${colorVar})`,
            borderRadius: size === 'small' ? 'var(--label-border-radius-small)' : 'var(--label-border-radius)',
          }}
        />
        <p 
          className="relative shrink-0 text-center text-nowrap whitespace-pre"
          style={{
            fontFamily: 'Figtree, sans-serif',
            fontSize: size === 'small' ? 'var(--text-xs)' : 'var(--text-sm)',
            fontWeight: 'var(--font-weight-normal)',
            lineHeight: size === 'small' ? '16px' : '20px',
            color: `var(${colorVar})`,
          }}
        >
          {children}
        </p>
      </button>
    );
  }
);

OutlineLabel.displayName = "OutlineLabel";
