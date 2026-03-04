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
import { supabase } from "../src/lib/supabase";

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

  const fetchJobData = async (id: string) => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from("jobs")
      .select(`
        id,
        company,
        position_title,
        status,
        applied_date,
        follow_up_date,
        role,
        job_type,
        work_type,
        location,
        source,
        job_url,
        salary_range,
        priority,
        job_description,
        cover_letter,
        notes
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Failed to fetch job data:", error);
      setIsLoading(false);
      return;
    }

    setJobData({
      id: data.id,
      company: data.company,
      position: data.position_title,
      status: data.status,
      appliedDate: data.applied_date,
      followUpDate: data.follow_up_date,
      roleType: data.role,
      jobType: data.job_type,
      workType: data.work_type,
      location: data.location,
      source: data.source,
      jobUrl: data.job_url,
      salaryRange: data.salary_range,
      priority: data.priority?.toLowerCase() as "low" | "medium" | "high" | undefined,
      requirements: data.job_description,
      coverLetter: data.cover_letter,
      notes: data.notes ? [data.notes] : [],
    });

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
