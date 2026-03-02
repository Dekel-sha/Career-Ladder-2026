import {
  useState,
  useRef,
  Component,
  ErrorInfo,
  ReactNode,
  useEffect,
} from "react";
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  Plus,
} from "lucide-react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import sidebarLogoAnimation from "@/assets/placeholder-lottie";
import { Button } from "./ui/button";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip@1.1.8";
import logoIcon from "@/assets/logo-icon.svg";
import { motion } from "motion/react";

interface LottieErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface LottieErrorBoundaryState {
  hasError: boolean;
}

class LottieErrorBoundary extends Component<
  LottieErrorBoundaryProps,
  LottieErrorBoundaryState
> {
  constructor(props: LottieErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(
    _: Error,
  ): LottieErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Lottie animation failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

interface SidebarProps {
  activePage:
    | "dashboard"
    | "applications"
    | "analytics"
    | "settings";
  onNavigate: (
    page:
      | "dashboard"
      | "applications"
      | "analytics"
      | "settings",
  ) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  onNewApplication: () => void;
}

export function Sidebar({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onNewApplication,
}: SidebarProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const isAnimatingRef = useRef(false);
  const [isTooltipEnabled, setIsTooltipEnabled] = useState(false);

  // Disable tooltips immediately when state changes
  useEffect(() => {
    setIsTooltipEnabled(false);
  }, [isCollapsed]);

  const handleLogoMouseEnter = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    lottieRef.current?.setSpeed(1);
    lottieRef.current?.goToAndPlay(0, true);
  };

  const handleLogoMouseLeave = () => {
    // Animation plays to the end and stops via onComplete
  };

  const navItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "applications" as const,
      label: "All Applications",
      icon: Briefcase,
    },
    {
      id: "analytics" as const,
      label: "Analytics",
      icon: BarChart3,
    },
  ];

  // Animation timing constants
  const SIDEBAR_ANIM_DURATION = 0.14;
  const TEXT_FADE_DURATION = 0.08;

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen border-r border-sidebar-border flex flex-col"
      initial={false}
      animate={{
        width: isCollapsed ? 72 : 256,
        backgroundColor: isCollapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-expanded)",
      }}
      transition={{
        duration: SIDEBAR_ANIM_DURATION,
        ease: "linear",
      }}
      onAnimationComplete={() => {
        if (isCollapsed) {
          setIsTooltipEnabled(true);
        }
      }}
      style={{
        boxShadow: "none",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      <style>{`
        .sidebar-nav-item {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          border-radius: var(--radius-unified);
          transition: background-color 150ms ease-in-out;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--primary-text-color);
          padding-left: 12px; /* Fixed padding for icon alignment */
          gap: 12px; /* Fixed gap between icon and text */
          white-space: nowrap;
        }
        
        .sidebar-nav-item:hover {
          background: var(--vibe-hover-bg);
        }
        
        .sidebar-nav-item.active {
          background: var(--vibe-day-hover);
          color: var(--primary-text-color);
        }
        
        .sidebar-nav-item svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }
        
        .sidebar-button-medium {
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          border-radius: var(--radius-unified);
          background: var(--primary);
          color: var(--primary-foreground);
          border: none;
          cursor: pointer;
          transition: all 150ms ease-in-out;
          font-family: 'Figtree', sans-serif;
          font-size: var(--text-sm);
          font-weight: 500;
          gap: 12px;
          padding-left: 12px;
          box-shadow: none;
          white-space: nowrap;
          justify-content: flex-start;
        }
        
        .sidebar-button-medium:hover {
          background: rgba(0, 115, 234, 0.9);
          box-shadow: none;
        }
        
        .sidebar-button-medium svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* Centering container for icons to ensure 40px target size */
        .icon-container {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Lottie Logo Container */
        .sidebar-logo-container {
            width: 28px;
            height: 28px;
            transition: filter 0.3s ease;
        }

        /* Dark Mode: Turn logo to #f5f5f5 */
        /* brightness(0) turns it black, invert(0.96) turns black to #F5F5F5 */
        :global(.dark) .sidebar-logo-container {
            filter: brightness(0) invert(0.96);
        }
        /* Fallback selector if :global isn't supported in this environment's style tag */
        .dark .sidebar-logo-container {
            filter: brightness(0) invert(0.96);
        }
      `}</style>

      {/* Logo */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "16px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          onMouseEnter={handleLogoMouseEnter}
          onMouseLeave={handleLogoMouseLeave}
        >
          {/* Single Logo Component - Persists across all states */}
          <div className="sidebar-logo-container">
            <LottieErrorBoundary
              fallback={
                <img
                  src={logoIcon}
                  alt="Career Ladder"
                  className="h-7"
                />
              }
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={sidebarLogoAnimation}
                loop={false}
                autoplay={false}
                onComplete={() => {
                  isAnimatingRef.current = false;
                  lottieRef.current?.goToAndStop(0, true);
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </LottieErrorBoundary>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "var(--space-16)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-8)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <TooltipProvider key={item.id}>
              <TooltipPrimitive.Root open={isTooltipEnabled && isCollapsed ? undefined : false} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                  >
                    <div className="icon-container">
                        <Icon />
                    </div>
                    <motion.span
                        initial={false}
                        animate={{
                            opacity: isCollapsed ? 0 : 1,
                            clipPath: isCollapsed ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)",
                        }}
                        transition={{
                            duration: TEXT_FADE_DURATION,
                            ease: "linear",
                        }}
                        style={{
                            fontFamily: "'Figtree', sans-serif",
                            fontSize: "var(--text-sm)",
                            fontWeight: 400,
                            lineHeight: 1.5,
                        }}
                    >
                        {item.label}
                    </motion.span>
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </TooltipPrimitive.Root>
            </TooltipProvider>
          );
        })}

        {/* Spacer */}
        <div style={{ marginTop: "var(--space-8)" }}>
          {/* New Application Button */}
          <TooltipProvider>
            <TooltipPrimitive.Root open={isTooltipEnabled && isCollapsed ? undefined : false} delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={onNewApplication}
                  className="sidebar-button-medium"
                >
                  <div className="icon-container">
                    <Plus />
                  </div>
                  <motion.span
                    initial={false}
                    animate={{
                        opacity: isCollapsed ? 0 : 1,
                        clipPath: isCollapsed ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)",
                        width: isCollapsed ? 0 : "auto",
                    }}
                    transition={{
                        duration: TEXT_FADE_DURATION,
                        ease: "linear",
                    }}
                    style={{
                        fontWeight: 500,
                    }}
                  >
                    New Application
                  </motion.span>
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>New Application</p>
                </TooltipContent>
              )}
            </TooltipPrimitive.Root>
          </TooltipProvider>
        </div>
      </nav>

      {/* Collapse Button */}
      <div
        style={{
          padding: "var(--space-16)",
          display: "flex",
          justifyContent: isCollapsed ? "center" : "flex-end",
          alignItems: "center",
        }}
      >
        <style>{`
          .sidebar-collapse-button {
            display: flex;
            width: 32px;
            height: 32px;
            justify-content: center;
            align-items: center;
            border-radius: var(--space-4);
            border: none;
            background: transparent;
            color: var(--primary-text-color);
            cursor: pointer;
            transition: background-color 150ms ease-in-out, color 150ms ease-in-out;
            flex-shrink: 0;
          }
          
          .sidebar-collapse-button:hover {
            background: var(--primary-background-hover-color);
            color: var(--primary-text-color);
          }
          
          .sidebar-collapse-button:active {
            background: var(--primary-selected-color);
            color: var(--primary-text-color);
          }
          
          .sidebar-collapse-button:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
          }
          
          .sidebar-collapse-button svg {
            width: 16px;
            height: 16px;
            color: currentColor;
          }
        `}</style>

        <TooltipProvider>
          <TooltipPrimitive.Root open={isTooltipEnabled && isCollapsed ? undefined : false}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggleCollapse(!isCollapsed)}
                className="sidebar-collapse-button text-[16px]"
                aria-label={
                  isCollapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ width: "20px", height: "20px" }}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 5C2 3.89543 2.89543 3 4 3H16C17.1046 3 18 3.89543 18 5V15C18 16.1046 17.1046 17 16 17H4C2.89543 17 2 16.1046 2 15V5ZM7.5 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V15C16.5 15.2761 16.2761 15.5 16 15.5H7.5L7.5 4.5ZM6 4.5H4C3.72386 4.5 3.5 4.72386 3.5 5V15C3.5 15.2761 3.72386 15.5 4 15.5H6L6 4.5Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                {isCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"}
              </p>
            </TooltipContent>
          </TooltipPrimitive.Root>
        </TooltipProvider>
      </div>
    </motion.aside>
  );
}
