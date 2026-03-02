import React from "react";
import { Button } from "./ui/button";
import { EmptyStateIcon } from "./icons/EmptyStateIcon";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 ${className || ""}`}
    >
      <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
        {icon || <EmptyStateIcon className="w-8 h-8 text-muted-foreground" />}
      </div>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="gap-2">
          <span>+</span>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
