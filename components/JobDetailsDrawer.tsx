import { useState, useEffect, useRef } from "react";
import { X, Edit3, Trash2, Briefcase, ExternalLink, CalendarIcon, CheckCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "sonner@2.0.3";
import { JobDetailsEdit } from "./JobDetailsEdit";
import { WORK_TYPE_LABEL, isValidWorkType, type WorkTypeDb } from "../src/constants/workTypes";

interface JobDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobData?: {
    id?: string;
    company: string;
    position: string;
    status: string;
    appliedDate?: string;
    followUpDate?: string;
    roleType?: string;
    jobType?: string;
    workType?: string;
    location?: string;
    source?: string;
    jobUrl?: string;
    salaryRange?: string;
    priority?: "low" | "medium" | "high";
    requirements?: string;
    coverLetter?: string;
    notes?: string[];
  };
  onDelete?: (id: string) => void; // Callback to update parent list after deletion
}

interface FormData {
  company: string;
  position: string;
  status: string;
  appliedDate?: Date;
  followUpDate?: Date;
  roleType: string;
  jobType: string;
  workType: string;
  location: string;
  source: string;
  jobUrl: string;
  salaryRange: string;
  priority: string;
  requirements: string;
  coverLetter: string;
  notes: string;
}

interface FormErrors {
  company?: string;
  roleType?: string;
  status?: string;
  jobUrl?: string;
}

export function JobDetailsDrawer({
  open,
  onOpenChange,
  jobData,
  onDelete,
}: JobDetailsDrawerProps) {
  const [width, setWidth] = useState(880);
  const [isResizing, setIsResizing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [suppressTooltips, setSuppressTooltips] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    company: "",
    position: "",
    status: "applied",
    roleType: "",
    jobType: "",
    workType: "",
    location: "",
    source: "",
    jobUrl: "",
    salaryRange: "",
    priority: "",
    requirements: "",
    coverLetter: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const focusAnchorRef = useRef<HTMLDivElement>(null);
  const modeAnnouncerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Mount/unmount lifecycle for animations (enter works)
  useEffect(() => {
    if (open) {
      setIsMounted(true);
    } else {
      // start exit transition
      setIsVisible(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !isMounted) return;

    // Ensure at least one frame is painted in the "closed" state
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        // Force reflow so initial styles are committed before flipping state
        drawerRef.current?.getBoundingClientRect();
        setIsVisible(true);
      });
      // cleanup inner rAF
      return () => cancelAnimationFrame(id2);
    });

    // cleanup outer rAF
    return () => cancelAnimationFrame(id1);
  }, [open, isMounted]);

  // After transition ends, unmount on close
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== 'transform') return;
      if (!isVisible) setIsMounted(false);
    };
    el.addEventListener('transitionend', onEnd);
    return () => el.removeEventListener('transitionend', onEnd);
  }, [isVisible]);

  // Reset edit mode when drawer closes
  useEffect(() => {
    if (!open) {
      setIsEditMode(false);
      setFormErrors({});
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        if (isEditMode) {
          handleCancel();
        } else {
          onOpenChange(false);
        }
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange, isEditMode]);

  // Suppress tooltips on mount and focus the anchor element
  useEffect(() => {
    if (open) {
      setSuppressTooltips(true);
      
      // Focus the non-interactive anchor to prevent button focus
      requestAnimationFrame(() => {
        focusAnchorRef.current?.focus();
      });

      // Re-enable tooltips after 400ms
      const timer = setTimeout(() => {
        setSuppressTooltips(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 640 && newWidth <= 920) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  if (!isMounted) return null;

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-[#DC3545] text-white";
      case "medium":
        return "bg-[#FFC107] text-[#1F1F1F]";
      case "low":
        return "bg-[#BDBDBD] text-[#1F1F1F]";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-[#0073EA] text-white";
      case "interview":
        return "bg-[#0073EA] text-white";
      case "offer":
        return "bg-[#28A745] text-white";
      case "rejected":
        return "bg-[#DC3545] text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Helper function to check if a value exists
  const hasValue = (value: any): boolean => {
    return value !== null && value !== undefined && value !== "";
  };

  // Helper to render empty field placeholder
  const renderEmptyField = () => (
    <span
      className="text-muted-foreground"
      aria-label="No value"
      style={{
        fontFamily: "var(--font-family-body)",
        fontSize: "14px",
      }}
    >
      Not mentioned
    </span>
  );

  // Check if sections should be visible
  const hasStatusAndDates = jobData && (
    hasValue(jobData.status) ||
    hasValue(jobData.priority) ||
    hasValue(jobData.appliedDate) ||
    hasValue(jobData.followUpDate)
  );

  // Parse date string to Date object
  const parseDate = (dateStr?: string): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      return new Date(dateStr);
    } catch {
      return undefined;
    }
  };

  // Enter edit mode
  const handleEditClick = () => {
    if (!jobData) return;

    const initialFormData: FormData = {
      company: jobData.company || "",
      position: jobData.position || "",
      status: jobData.status || "applied",
      appliedDate: parseDate(jobData.appliedDate),
      followUpDate: parseDate(jobData.followUpDate),
      roleType: jobData.roleType || "",
      jobType: jobData.jobType || "",
      workType: jobData.workType || "",
      location: jobData.location || "",
      source: jobData.source || "",
      jobUrl: jobData.jobUrl || "",
      salaryRange: jobData.salaryRange || "",
      priority: jobData.priority || "",
      requirements: jobData.requirements || "",
      coverLetter: jobData.coverLetter || "",
      notes: jobData.notes?.join("\n") || "",
    };

    setFormData(initialFormData);
    setOriginalData(initialFormData);
    setFormErrors({});
    setIsEditMode(true);

    // Announce mode change
    if (modeAnnouncerRef.current) {
      modeAnnouncerRef.current.textContent = "Edit mode enabled";
    }
  };

  // Check if form has unsaved changes
  const hasUnsavedChanges = (): boolean => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty is valid (optional field)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.company.trim()) {
      errors.company = "Company is required";
    }

    if (!formData.roleType) {
      errors.roleType = "Role type is required";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    if (formData.jobUrl && !isValidUrl(formData.jobUrl)) {
      errors.jobUrl = "Please enter a valid URL";
    }

    // Validate work type if provided
    if (formData.workType && !isValidWorkType(formData.workType)) {
      toast.error(
        "Work Type is invalid. Please choose Remote / Hybrid / On-site.",
        {
          duration: 3000,
          style: {
            background: "#D92D20",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
            fontFamily: "Figtree, sans-serif",
          },
          icon: <AlertCircle className="h-5 w-5" style={{ color: "#FFFFFF" }} />,
        }
      );
      return false;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save changes
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving", {
        duration: 3000,
        style: {
          background: "#D92D20",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Figtree, sans-serif",
        },
        icon: <AlertCircle className="h-5 w-5" style={{ color: "#FFFFFF" }} />,
      });
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/jobs/${jobData?.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     appliedDate: formData.appliedDate?.toISOString(),
      //     followUpDate: formData.followUpDate?.toISOString(),
      //   }),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Application updated", {
        duration: 3000,
        style: {
          background: "#008545",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Figtree, sans-serif",
        },
        icon: <CheckCircle className="h-5 w-5" style={{ color: "#FFFFFF" }} />,
      });

      setIsEditMode(false);
      setFormErrors({});

      // Announce mode change
      if (modeAnnouncerRef.current) {
        modeAnnouncerRef.current.textContent = "View mode";
      }

      // TODO: Refresh job data from API or update local state
    } catch (error) {
      toast.error("Failed to update application. Please try again.", {
        duration: 3000,
        style: {
          background: "#D92D20",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Figtree, sans-serif",
        },
        icon: <AlertCircle className="h-5 w-5" style={{ color: "#FFFFFF" }} />,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowCancelDialog(true);
    } else {
      exitEditMode();
    }
  };

  // Exit edit mode without saving
  const exitEditMode = () => {
    setIsEditMode(false);
    setFormErrors({});
    setShowCancelDialog(false);

    // Announce mode change
    if (modeAnnouncerRef.current) {
      modeAnnouncerRef.current.textContent = "View mode";
    }
  };

  // Update form field
  const updateFormField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Open delete confirmation dialog
  const handleDeleteClick = () => {
    setDeleteError(null);
    setShowDeleteDialog(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!jobData?.id) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/jobs/${jobData.id}`, {
      //   method: 'DELETE',
      // });
      // if (!response.ok) throw new Error('Delete failed');

      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success (90% success rate for demo)
          if (Math.random() > 0.1) {
            resolve(true);
          } else {
            reject(new Error('Delete failed'));
          }
        }, 800);
      });

      // Success: close dialog and drawer
      setShowDeleteDialog(false);
      onOpenChange(false);

      // Update parent list
      if (onDelete) {
        onDelete(jobData.id);
      }

      // Show success toast
      toast.success("Application deleted", {
        duration: 3000,
        style: {
          background: "#008545",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Figtree, sans-serif",
        },
        icon: <CheckCircle className="h-5 w-5" style={{ color: "#FFFFFF" }} />,
      });
    } catch (error) {
      // Show error in dialog
      setDeleteError("Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Close delete dialog
  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
      setDeleteError(null);
    }
  };

  const hasRoleAndWorkType = jobData && (
    hasValue(jobData.roleType) ||
    hasValue(jobData.jobType) ||
    hasValue(jobData.workType) ||
    hasValue(jobData.location)
  );

  const hasSourceAndLinks = jobData && (
    hasValue(jobData.source) ||
    hasValue(jobData.jobUrl)
  );

  const hasRequirements = jobData && hasValue(jobData.requirements);
  const hasCoverLetter = jobData && hasValue(jobData.coverLetter);

  return (
    <>
      <style>{`
        .job-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border-radius: 12px 0 0 12px;
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translateX(100%);
          opacity: 0;
          transition: transform 250ms ease-in-out, opacity 200ms ease-in-out;
          z-index: 50;
        }

        .job-drawer--open {
          transform: translateX(0);
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .job-drawer,
          .job-drawer--open {
            transition: none !important;
          }
        }
      `}</style>
      
      {/* Screen reader announcer for mode changes */}
      <div
        ref={modeAnnouncerRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Unsaved Changes Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay editing</AlertDialogCancel>
            <AlertDialogAction onClick={exitEditMode}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent
          style={{
            fontFamily: "var(--font-family-body)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              style={{
                fontFamily: "var(--font-family-heading)",
                fontSize: "20px",
                fontWeight: "600",
                color: "var(--vibe-text-primary)",
              }}
            >
              Delete application?
            </AlertDialogTitle>
            <AlertDialogDescription
              style={{
                fontFamily: "var(--font-family-body)",
                fontSize: "14px",
                color: "var(--vibe-text-secondary)",
                marginTop: "8px",
              }}
            >
              This action can't be undone. The application will be permanently removed.
            </AlertDialogDescription>
            {jobData && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "var(--background-secondary)",
                  borderRadius: "8px",
                  fontFamily: "var(--font-family-body)",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "var(--vibe-text-primary)",
                }}
              >
                {jobData.company} — {jobData.position}
              </div>
            )}
          </AlertDialogHeader>
          {deleteError && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "8px",
                fontFamily: "var(--font-family-body)",
                fontSize: "14px",
                color: "#DC3545",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle className="h-4 w-4" style={{ flexShrink: 0 }} />
              <span>{deleteError}</span>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              style={{
                fontFamily: "var(--font-family-body)",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              style={{
                fontFamily: "var(--font-family-body)",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: "#DC3545",
                color: "#FFFFFF",
              }}
              className="hover:opacity-90"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transparent Overlay - Click to close */}
      <div
        className="fixed inset-0 z-40"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transition: "opacity 200ms ease-in-out",
        }}
        onClick={() => {
          if (isEditMode && hasUnsavedChanges()) {
            handleCancel();
          } else {
            onOpenChange(false);
          }
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`job-drawer ${isVisible ? 'job-drawer--open' : ''}`}
        style={{
          width: `${width}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Resize Handle */}
        <div
          className="absolute top-0 left-0 w-1 h-full cursor-col-resize group hover:bg-[#E6E9EF] transition-colors duration-150"
          onMouseDown={() => setIsResizing(true)}
          style={{
            borderLeft: isResizing ? "3px solid var(--border)" : "none",
          }}
        >
          <div className="absolute inset-y-0 -left-1 w-3" />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5 border-b"
          style={{
            height: "80px",
            borderColor: "#E6E9EF",
          }}
        >
          {/* Non-interactive focus anchor */}
          <div 
            ref={focusAnchorRef}
            tabIndex={-1} 
            data-initial-focus 
            className="sr-only" 
            aria-hidden="true"
            style={{ outline: "none" }}
          />

          <div className="flex items-center gap-3">
            {/* Company Logo Placeholder */}
            <div
              className="flex items-center justify-center bg-[#F6F8FA] rounded-lg"
              style={{ width: "40px", height: "40px" }}
            >
              <Briefcase
                className="w-5 h-5"
                style={{ color: "var(--vibe-text-secondary)" }}
              />
            </div>

            {/* Company & Position */}
            <div className="flex flex-col gap-2">
              {jobData ? (
                <>
                  <h3
                    style={{
                      fontFamily: "var(--font-family-heading)",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "var(--vibe-text-primary)",
                      lineHeight: "1.4",
                    }}
                  >
                    {jobData.company}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-family-body)",
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "var(--vibe-text-secondary)",
                      lineHeight: "1.4",
                    }}
                  >
                    {jobData.position}
                  </p>
                </>
              ) : (
                <>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center" style={{ gap: "var(--space-8)" }}>
            <style>{`
              .drawer-icon-button {
                display: flex;
                width: 32px;
                height: 32px;
                justify-content: center;
                align-items: center;
                border-radius: var(--space-4);
                gap: var(--space-8);
                flex-shrink: 0;
                border: none;
                background: transparent;
                color: var(--primary-text-color);
                cursor: pointer;
                transition: background-color 150ms ease-in-out, color 150ms ease-in-out;
              }
              
              .drawer-icon-button:hover {
                background: var(--primary-background-hover-color);
                color: var(--primary-text-color);
              }
              
              .drawer-icon-button:active {
                background: var(--primary-selected-color);
                color: var(--primary-text-color);
              }
              
              .drawer-icon-button svg {
                width: 20px;
                height: 20px;
                aspect-ratio: 1 / 1;
                color: currentColor;
              }
            `}</style>

            {isEditMode ? (
              <>
                {/* Edit Mode Actions: Save & Cancel */}
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{
                    height: "32px",
                    padding: "0 16px",
                    fontSize: "14px",
                    fontFamily: "var(--font-family-body)",
                    fontWeight: "500",
                  }}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSaving}
                  style={{
                    height: "32px",
                    padding: "0 16px",
                    fontSize: "14px",
                    fontFamily: "var(--font-family-body)",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </Button>

                {/* Close Button */}
                {suppressTooltips ? (
                  <button
                    className="drawer-icon-button"
                    aria-label="Close"
                    onClick={() => {
                      if (hasUnsavedChanges()) {
                        handleCancel();
                      } else {
                        onOpenChange(false);
                      }
                    }}
                    disabled={isSaving}
                  >
                    <X />
                  </button>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="drawer-icon-button"
                          aria-label="Close"
                          onClick={() => {
                            if (hasUnsavedChanges()) {
                              handleCancel();
                            } else {
                              onOpenChange(false);
                            }
                          }}
                          disabled={isSaving}
                        >
                          <X />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Close</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            ) : (
              <>
                {/* View Mode Actions: Edit, Delete, Close */}
                {suppressTooltips ? (
                  <>
                    {/* Edit Button - No Tooltip */}
                    <button
                      className="drawer-icon-button"
                      aria-label="Edit application"
                      onClick={handleEditClick}
                    >
                      <Edit3 />
                    </button>

                    {/* Delete Button - No Tooltip */}
                    <button
                      className="drawer-icon-button"
                      aria-label="Delete application"
                      onClick={handleDeleteClick}
                    >
                      <Trash2 />
                    </button>

                    {/* Close Button - No Tooltip */}
                    <button
                      className="drawer-icon-button"
                      aria-label="Close"
                      onClick={() => onOpenChange(false)}
                    >
                      <X />
                    </button>
                  </>
                ) : (
                  <>
                    {/* Edit Button - With Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="drawer-icon-button"
                            aria-label="Edit application"
                            onClick={handleEditClick}
                          >
                            <Edit3 />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Application</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Delete Button - With Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="drawer-icon-button"
                            aria-label="Delete application"
                            onClick={handleDeleteClick}
                          >
                            <Trash2 />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Application</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {/* Close Button - With Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="drawer-icon-button"
                            aria-label="Close"
                            onClick={() => onOpenChange(false)}
                          >
                            <X />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Close</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div
            className="px-8"
            style={{
              height: "48px",
              backgroundColor: "var(--background)",
              borderBottom: "1px solid #D0D5DD",
            }}
          >
            <TabsList className="h-full w-auto bg-transparent p-0" style={{ gap: "24px" }}>
              <TabsTrigger
                value="details"
                className="h-full px-4 pb-0 border-b-3 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-[#F6F8FA] transition-colors"
                style={{
                  fontFamily: "var(--font-family-body)",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: activeTab === "details" ? "var(--vibe-text-primary)" : "#667085",
                  borderBottom: activeTab === "details" ? "3px solid #0073EA" : "3px solid transparent",
                  paddingBottom: "0",
                  marginBottom: "-1px",
                }}
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="h-full px-4 pb-0 border-b-3 border-transparent rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-[#F6F8FA] transition-colors"
                style={{
                  fontFamily: "var(--font-family-body)",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: activeTab === "notes" ? "var(--vibe-text-primary)" : "#667085",
                  borderBottom: activeTab === "notes" ? "3px solid #0073EA" : "3px solid transparent",
                  paddingBottom: "0",
                  marginBottom: "-1px",
                }}
              >
                Notes
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <ScrollArea className="flex-1">
            <TabsContent value="details" className="p-8 m-0">
              {isEditMode ? (
                <JobDetailsEdit
                  formData={formData}
                  formErrors={formErrors}
                  onUpdateField={updateFormField}
                  disabled={isSaving}
                />
              ) : (
                <>
                  {/* View Mode */}
                  {/* Statuses & Dates - Only show if at least one field has value */}
                  {hasStatusAndDates && (
                <div className="mb-10">
                <h4
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-family-body)",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--vibe-text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Statuses & Dates
                </h4>
                <div
                  className="h-px mb-4"
                  style={{ backgroundColor: "#E6E9EF" }}
                />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Status
                    </label>
                    {jobData ? (
                      <Badge
                        className={`${getStatusColor(jobData.status)} px-3 py-1`}
                      >
                        {jobData.status}
                      </Badge>
                    ) : (
                      <Skeleton className="h-6 w-24" />
                    )}
                  </div>

                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Priority
                    </label>
                    {jobData ? (
                      hasValue(jobData.priority) ? (
                        <Badge
                          className={`${getPriorityColor(jobData.priority)} px-3 py-1 capitalize`}
                        >
                          {jobData.priority}
                        </Badge>
                      ) : (
                        renderEmptyField()
                      )
                    ) : (
                      <Skeleton className="h-6 w-20" />
                    )}
                  </div>

                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Applied Date
                    </label>
                    {jobData ? (
                      hasValue(jobData.appliedDate) ? (
                        <p
                          style={{
                            fontFamily: "var(--font-family-body)",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "var(--vibe-text-primary)",
                          }}
                        >
                          {jobData.appliedDate}
                        </p>
                      ) : (
                        renderEmptyField()
                      )
                    ) : (
                      <Skeleton className="h-5 w-28" />
                    )}
                  </div>

                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Follow-up Date
                    </label>
                    {jobData ? (
                      hasValue(jobData.followUpDate) ? (
                        <p
                          style={{
                            fontFamily: "var(--font-family-body)",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "var(--vibe-text-primary)",
                          }}
                        >
                          {jobData.followUpDate}
                        </p>
                      ) : (
                        renderEmptyField()
                      )
                    ) : (
                      <Skeleton className="h-5 w-28" />
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Role & Work Type - Only show if at least one field has value */}
              {hasRoleAndWorkType && (
                <div className="mb-10">
                <h4
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-family-body)",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--vibe-text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Role & Work Type
                </h4>
                <div
                  className="h-px mb-4"
                  style={{ backgroundColor: "#E6E9EF" }}
                />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Role Type
                    </label>
                    {jobData ? (
                      hasValue(jobData.roleType) ? (
                        <p
                          style={{
                            fontFamily: "var(--font-family-body)",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "var(--vibe-text-primary)",
                          }}
                        >
                          {jobData.roleType}
                        </p>
                      ) : (
                        renderEmptyField()
                      )
                    ) : (
                      <Skeleton className="h-5 w-32" />
                    )}
                  </div>

                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Job Type
                    </label>
                    {jobData ? (
                      hasValue(jobData.jobType) ? (
                        <p
                          style={{
                            fontFamily: "var(--font-family-body)",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "var(--vibe-text-primary)",
                          }}
                        >
                          {jobData.jobType}
                        </p>
                      ) : (
                        renderEmptyField()
                      )
                    ) : (
                      <Skeleton className="h-5 w-24" />
                    )}
                  </div>

                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Work Type
                    </label>
                    {jobData ? (
                      hasValue(jobData.workType) ? (
                        <p
                          style={{
                            fontFamily: "var(--font-family-body)",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "var(--vibe-text-primary)",
                          }}
                        >
                          {isValidWorkType(jobData.workType) ? WORK_TYPE_LABEL[jobData.workType as WorkTypeDb] : jobData.workType}
                        </p>
                      ) : (
                        renderEmptyField()
                      )
                    ) : (
                      <Skeleton className="h-5 w-20" />
                    )}
                  </div>

                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Location
                    </label>
                    {jobData ? (
                      hasValue(jobData.location) ? (
                        <p
                          style={{
                            fontFamily: "var(--font-family-body)",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "var(--vibe-text-primary)",
                          }}
                        >
                          {jobData.location}
                        </p>
                      ) : (
                        renderEmptyField()
                      )
                    ) : (
                      <Skeleton className="h-5 w-36" />
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Source & Links - Only show if at least one field has value */}
              {hasSourceAndLinks && (
                <div className="mb-10">
                <h4
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-family-body)",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--vibe-text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Source & Links
                </h4>
                <div
                  className="h-px mb-4"
                  style={{ backgroundColor: "#E6E9EF" }}
                />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "6px",
                      }}
                    >
                      Source
                    </label>
                    {jobData ? (
                      hasValue(jobData.source) ? (
                        <p
                          style={{
                            fontFamily: "var(--font-family-body)",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "var(--vibe-text-primary)",
                          }}
                        >
                          {jobData.source}
                        </p>
                      ) : (
                        renderEmptyField()
                      )
                    ) : (
                      <Skeleton className="h-5 w-28" />
                    )}
                  </div>

                  {hasValue(jobData?.jobUrl) && (
                    <div className="col-span-2">
                      <label
                        className="block"
                        style={{
                          fontFamily: "var(--font-family-body)",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "var(--vibe-text-secondary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "6px",
                        }}
                      >
                        Job Posting URL
                      </label>
                      <a
                        href={jobData!.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline transition-colors"
                        style={{
                          fontFamily: "var(--font-family-body)",
                          fontSize: "14px",
                        }}
                      >
                        {jobData!.jobUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Job Requirements - Only show if has value */}
              {hasRequirements && (
                <div>
                  <h4
                    className="mb-4"
                    style={{
                      fontFamily: "var(--font-family-body)",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--vibe-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Job Requirements
                  </h4>
                  <div
                    className="h-px mb-4"
                    style={{ backgroundColor: "#E6E9EF" }}
                  />

                  {jobData ? (
                    <p
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "var(--vibe-text-primary)",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {jobData.requirements}
                    </p>
                  ) : (
                    <Skeleton className="h-24 w-full" />
                  )}
                </div>
              )}
                </>
              )}
            </TabsContent>

            <TabsContent value="notes" className="p-8 m-0">
              {isEditMode ? (
                <>
                  {/* Edit Mode - Cover Letter & Notes */}
                  <div className="mb-10">
                    <h4
                      className="mb-4"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Cover Letter
                    </h4>
                    <div className="h-px mb-4" style={{ backgroundColor: "#E6E9EF" }} />

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="edit-cover-letter"
                        style={{
                          fontFamily: "var(--font-family-body)",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "var(--vibe-text-secondary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Cover Letter
                      </Label>
                      <Textarea
                        id="edit-cover-letter"
                        value={formData.coverLetter}
                        onChange={(e) => updateFormField("coverLetter", e.target.value)}
                        placeholder="Enter your cover letter..."
                        rows={8}
                        disabled={isSaving}
                        style={{
                          fontFamily: "var(--font-family-body)",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-10">
                    <h4
                      className="mb-4"
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "var(--vibe-text-secondary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Notes
                    </h4>
                    <div className="h-px mb-4" style={{ backgroundColor: "#E6E9EF" }} />

                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="edit-notes"
                        style={{
                          fontFamily: "var(--font-family-body)",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "var(--vibe-text-secondary)",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                        }}
                      >
                        Notes
                      </Label>
                      <Textarea
                        id="edit-notes"
                        value={formData.notes}
                        onChange={(e) => updateFormField("notes", e.target.value)}
                        placeholder="Enter notes (one per line)..."
                        rows={10}
                        disabled={isSaving}
                        style={{
                          fontFamily: "var(--font-family-body)",
                          fontSize: "14px",
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode - Cover Letter & Notes */}
              {/* Cover Letter - Only show if has value */}
              {hasCoverLetter && (
                <div className="mb-10">
                  <h4
                    className="mb-4"
                    style={{
                      fontFamily: "var(--font-family-body)",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--vibe-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Cover Letter
                  </h4>
                  <div
                    className="h-px mb-4"
                    style={{ backgroundColor: "#E6E9EF" }}
                  />

                  {jobData ? (
                    <p
                      style={{
                        fontFamily: "var(--font-family-body)",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "var(--vibe-text-primary)",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {jobData.coverLetter}
                    </p>
                  ) : (
                    <Skeleton className="h-32 w-full" />
                  )}
                </div>
              )}

              {(!jobData?.notes || jobData.notes.length === 0) && !hasCoverLetter ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div
                    className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <h4
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-family-heading)",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "var(--vibe-text-primary)",
                    }}
                  >
                    No notes yet
                  </h4>
                  <p
                    style={{
                      fontFamily: "var(--font-family-body)",
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      textAlign: "center",
                    }}
                  >
                    Add your personal remarks or reflections here.
                  </p>
                </div>
              ) : null}
              
              {jobData?.notes && jobData.notes.length > 0 && (
                <div>
                  <h4
                    className="mb-4"
                    style={{
                      fontFamily: "var(--font-family-body)",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--vibe-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Notes
                  </h4>
                  <div
                    className="h-px mb-4"
                    style={{ backgroundColor: "#E6E9EF" }}
                  />
                  
                  <div className="space-y-4">
                    {jobData.notes.map((note, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-card"
                        style={{ borderColor: "#E6E9EF" }}
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-family-body)",
                            fontSize: "14px",
                            color: "var(--text-primary)",
                          }}
                        >
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                </>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </>
  );
}
