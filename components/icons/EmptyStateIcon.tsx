import React from "react";

export const EmptyStateIcon = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M13 5.21875H24.2M24.2455 5.39855L29.0706 24.3746"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M17.7878 16.6376H6.59369C5.82813 16.6376 5.20752 17.2582 5.20752 18.0238C5.20752 18.7893 5.82813 19.4099 6.59369 19.4099H17.7878C18.5533 19.4099 19.1739 18.7893 19.1739 18.0238C19.1739 17.2582 18.5533 16.6376 17.7878 16.6376Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1.42 1.42"
      />
      <path
        d="M20.9709 10.2357H9.77679C9.01123 10.2357 8.39062 10.8563 8.39062 11.6219C8.39062 12.3874 9.01123 13.008 9.77679 13.008H20.9709C21.7364 13.008 22.357 12.3874 22.357 11.6219C22.357 10.8563 21.7364 10.2357 20.9709 10.2357Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1.42 1.42"
      />
      <path
        d="M14.581 23.0326H3.3869C2.62134 23.0326 2.00073 23.6532 2.00073 24.4188C2.00073 25.1843 2.62134 25.8049 3.3869 25.8049H14.581C15.3465 25.8049 15.9671 25.1843 15.9671 24.4188C15.9671 23.6532 15.3465 23.0326 14.581 23.0326Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1.42 1.42"
      />
    </svg>
  );
};