interface SidebarCollapseIconProps {
  className?: string;
}

export function SidebarCollapseIcon({ className }: SidebarCollapseIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer rounded rectangle frame */}
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      
      {/* Vertical divider line */}
      <line
        x1="5.5"
        y1="1"
        x2="5.5"
        y2="15"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Chevron left arrow */}
      <path
        d="M4 8L2.5 6.5L4 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
