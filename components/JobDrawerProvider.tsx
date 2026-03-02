import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { JobDetailsDrawer } from "./JobDetailsDrawer";

interface JobDrawerContextValue {
  open: (jobId: string) => void;
  close: () => void;
  isOpen: boolean;
  jobId: string | null;
}

const JobDrawerContext = createContext<JobDrawerContextValue | undefined>(
  undefined
);

export function useJobDrawer() {
  const context = useContext(JobDrawerContext);
  if (!context) {
    throw new Error("useJobDrawer must be used within JobDrawerProvider");
  }
  return context;
}

interface JobDrawerProviderProps {
  children: ReactNode;
}

export function JobDrawerProvider({ children }: JobDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobData, setJobData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Mock data for demonstration - replace with actual API call
  const fetchJobData = async (id: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock data - replace with actual API call
    // Different data based on ID to demonstrate conditional sections
    const mockDataById: Record<string, any> = {
      "1": {
        company: "Figma",
        position: "Senior Product Designer",
        status: "interview",
        appliedDate: "Oct 15, 2024",
        followUpDate: "Oct 30, 2024",
        roleType: "Product Designer",
        jobType: "Full-time",
        workType: "remote",
        location: "San Francisco, CA",
        source: "LinkedIn",
        jobUrl: "https://www.figma.com/careers",
        priority: "high" as const,
        requirements: "5+ years of experience in product design\nStrong portfolio demonstrating design systems work\nExperience with Figma and prototyping tools\nExcellent communication and collaboration skills\nBS/BA in Design, HCI, or related field",
        coverLetter: "Dear Hiring Manager,\n\nI am excited to apply for the Senior Product Designer position at Figma. With over 6 years of experience in product design and a deep passion for creating intuitive user experiences, I believe I would be a great fit for your team.\n\nMy experience includes leading design system initiatives at my current company, which aligns perfectly with Figma's focus on collaborative design tools. I'm particularly drawn to Figma's mission of making design accessible to everyone.\n\nI look forward to discussing how my skills and experience can contribute to Figma's continued success.\n\nBest regards,\n[Your Name]",
        notes: [
          "Initial phone screen went well. Team seems very collaborative.",
          "Design challenge due next week - focus on accessibility features.",
        ],
      },
      "2": {
        company: "Google",
        position: "UX Designer",
        status: "applied",
        appliedDate: "Oct 22, 2024",
        // No followUpDate
        roleType: "UX Design",
        // No jobType
        workType: "hybrid",
        location: "Mountain View, CA",
        source: "Company Site",
        // No jobUrl
        // No priority
        requirements: "3+ years UX design experience\nProficiency in Sketch, Figma, or Adobe XD\nStrong understanding of user-centered design principles\nExperience conducting user research",
        // No coverLetter
        notes: [],
      },
      "3": {
        company: "Meta",
        position: "Product Designer",
        status: "follow-up",
        // No appliedDate
        followUpDate: "Nov 5, 2024",
        // No roleType, jobType, workType, location
        // No source or jobUrl
        priority: "medium" as const,
        // No requirements
        coverLetter: "Dear Meta Team,\n\nI'm writing to express my interest in the Product Designer role. My background in social platform design makes me uniquely qualified for this position.\n\nThank you for your consideration.",
        notes: ["Follow up scheduled for next week."],
      },
    };

    const mockData = mockDataById[id] || mockDataById["1"];

    setJobData(mockData);
    setIsLoading(false);
  };

  const open = useCallback((id: string) => {
    // Store the currently focused element
    triggerElementRef.current = document.activeElement as HTMLElement;

    setJobId(id);
    setIsOpen(true);

    // Update URL with ?drawer=1
    const url = new URL(window.location.href);
    url.searchParams.set("drawer", "1");
    window.history.pushState({}, "", url.toString());

    // Fetch job data
    fetchJobData(id);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);

    // Remove ?drawer=1 from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("drawer");
    window.history.pushState({}, "", url.toString());

    // Return focus to the trigger element
    setTimeout(() => {
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    }, 100);

    // Clear job data after animation
    setTimeout(() => {
      setJobId(null);
      setJobData(null);
    }, 200);
  }, []);

  // Check URL on mount to auto-open drawer
  useEffect(() => {
    const url = new URL(window.location.href);
    const shouldOpenDrawer = url.searchParams.get("drawer") === "1";

    if (shouldOpenDrawer) {
      // Extract jobId from URL path or query params if available
      // For now, using a mock ID - you can customize this based on your routing
      const mockJobId = "mock-job-id";
      open(mockJobId);
    }
  }, [open]);

  // Global click listener for job items
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore right-click and middle-click
      if (e.button !== 0) return;

      const target = e.target as HTMLElement;

      // Ignore clicks on interactive elements
      const isInteractive =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea") ||
        target.closest('[role="checkbox"]') ||
        target.closest('[role="menuitem"]') ||
        target.closest('[role="button"]');

      if (isInteractive) {
        // Allow Cmd/Ctrl + Click on links to open in new tab
        if (target.closest("a") && (e.metaKey || e.ctrlKey)) {
          return;
        }
        // Don't prevent default for interactive elements
        if (!target.closest("a")) {
          return;
        }
      }

      // Find the job item element
      const jobItem = target.closest(
        '[data-job-id], [data-role="job-row"], [data-role="job-card"], [aria-role="job-item"]'
      ) as HTMLElement;

      if (jobItem) {
        e.preventDefault();

        // Get job ID from data attribute
        const id =
          jobItem.getAttribute("data-job-id") ||
          jobItem.getAttribute("id") ||
          "unknown";

        open(id);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [open]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusableElements = drawerRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Set initial focus when drawer opens
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;

      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }
  }, [isOpen]);

  const value: JobDrawerContextValue = {
    open,
    close,
    isOpen,
    jobId,
  };

  return (
    <JobDrawerContext.Provider value={value}>
      {children}
      <div ref={drawerRef} aria-label="Job details">
        <JobDetailsDrawer
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          jobData={isLoading ? undefined : jobData}
          onDelete={(id) => {
            // TODO: Remove the deleted item from the list in the parent component
            // This would typically trigger a refetch or update local state
            console.log("Application deleted:", id);
            
            // You can emit a custom event that the AllApplications component can listen to
            window.dispatchEvent(new CustomEvent('applicationDeleted', { detail: { id } }));
          }}
        />
      </div>
    </JobDrawerContext.Provider>
  );
}
