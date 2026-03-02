import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar as CalendarComponent } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { format, parse, isValid } from "date-fns";
import {
  Calendar as CalendarIcon,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { supabase } from "../src/lib/supabase";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { WORK_TYPE_DB, WORK_TYPE_LABEL, isValidWorkType, type WorkTypeDb } from "../src/constants/workTypes";
import { STATUS_TYPES, getStatusOptions, isValidStatus } from "../src/constants/statusTypes";

interface AddApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddApplicationModal({
  open,
  onOpenChange,
}: AddApplicationModalProps) {
  const [includeCoverLetter, setIncludeCoverLetter] =
    useState(false);
  const [appliedDate, setAppliedDate] = useState<Date>();
  const [followUpDate, setFollowUpDate] = useState<Date>();

  // Form state for validation
  const [company, setCompany] = useState("");
  const [roleType, setRoleType] = useState("");
  const [status, setStatus] = useState(STATUS_TYPES.APPLIED); // Default to "applied"
  const [position, setPosition] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [source, setSource] = useState("");
  const [priority, setPriority] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!company || !roleType || !status) {
      toast.error(
        "Please fill all required fields before saving.",
        {
          duration: 3000,
          style: {
            background: "var(--destructive)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
            fontFamily: "Figtree, sans-serif",
          },
          className:
            "animate-in slide-in-from-right-5 duration-150",
          icon: (
            <AlertCircle
              className="h-5 w-5"
              style={{ color: "#FFFFFF" }}
            />
          ),
        },
      );
      return;
    }

    setIsSaving(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) {
        toast.error("No logged-in user found");
        setIsSaving(false);
        return;
      }

      // Validate work type before saving
      if (workType && !isValidWorkType(workType)) {
        toast.error(
          "Work Type is invalid. Please choose Remote / Hybrid / On-site.",
          {
            duration: 3000,
            style: {
              background: "var(--destructive)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "Figtree, sans-serif",
            },
            className:
              "animate-in slide-in-from-right-5 duration-150",
            icon: (
              <AlertCircle
                className="h-5 w-5"
                style={{ color: "#FFFFFF" }}
              />
            ),
          },
        );
        setIsSaving(false);
        return;
      }

      // Validate status before saving
      if (status && !isValidStatus(status)) {
        toast.error(
          "Status is invalid. Please choose a valid status.",
          {
            duration: 3000,
            style: {
              background: "var(--destructive)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "Figtree, sans-serif",
            },
            className:
              "animate-in slide-in-from-right-5 duration-150",
            icon: (
              <AlertCircle
                className="h-5 w-5"
                style={{ color: "#FFFFFF" }}
              />
            ),
          },
        );
        setIsSaving(false);
        return;
      }

      // Save to server via API endpoint instead of direct Supabase query
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b47aab4/jobs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            company: company,
            position: position || null,
            status: status,
            applied_date: appliedDate ? appliedDate.toISOString().split('T')[0] : null,
            date: appliedDate ? appliedDate.toISOString() : new Date().toISOString(),
            location: location || null,
            work_type: workType || null,
            source: source || null,
            role: roleType,
            priority: priority || null,
            job_type: jobType || null,
            salary_range: salaryRange || null,
            job_url: jobUrl || null,
            contact_person: contactPerson || null,
            contact_email: contactEmail || null,
            cover_letter: coverLetter || null,
            job_description: jobDescription || null,
            notes: notes || null,
            follow_up_date: followUpDate ? followUpDate.toISOString().split('T')[0] : null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to save application');
      }

      // Success feedback
      toast.success("✅ Application saved!", {
        duration: 3000,
        style: {
          background: "var(--color-success)",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "8px",
          padding: "12px 20px",
          fontSize: "14px",
          fontWeight: "500",
          fontFamily: "Figtree, sans-serif",
        },
        className:
          "animate-in slide-in-from-right-5 duration-150",
        icon: (
          <CheckCircle
            className="h-5 w-5"
            style={{ color: "#FFFFFF" }}
          />
        ),
      });

      // Reset form and close modal
      setCompany("");
      setRoleType("");
      setStatus(STATUS_TYPES.APPLIED);
      setPosition("");
      setJobType("");
      setLocation("");
      setWorkType("");
      setSalaryRange("");
      setSource("");
      setPriority("");
      setJobUrl("");
      setContactPerson("");
      setContactEmail("");
      setCoverLetter("");
      setJobDescription("");
      setNotes("");
      setAppliedDate(undefined);
      setFollowUpDate(undefined);
      setIncludeCoverLetter(false);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save application");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      e.target instanceof HTMLInputElement
    ) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden w-full"
        style={{
          maxWidth: "min(1200px, 94vw)",
          minWidth: "320px",
          borderRadius: "12px",
          boxShadow: "var(--elevation-md)",
        }}
      >
        <DialogHeader
          className="px-8 pt-8 pb-6"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <DialogTitle
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontWeight: "600",
              color: "var(--vibe-text-primary)",
            }}
          >
            Add New Application
          </DialogTitle>
          <DialogDescription
            style={{
              fontFamily: "Figtree, sans-serif",
              fontSize: "14px",
              color: "var(--vibe-text-secondary)",
            }}
          >
            Fill in the details below to track a new job
            application.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          style={{
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="px-8 pt-8 pb-4"
          >
            {/* Basic Information */}
            <div className="mb-10">
              <h3
                className="mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "var(--vibe-text-primary)",
                }}
              >
                Basic Information
              </h3>
              <div
                className="h-px mb-7"
                style={{ backgroundColor: "var(--border)" }}
              />

              <div
                className="grid gap-x-8 gap-y-7"
                style={{
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                }}
              >
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="company"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Company{" "}
                    <span style={{ color: "var(--destructive)" }}>*</span>
                  </Label>
                  <Input
                    id="company"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="role-type"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Role Type{" "}
                    <span style={{ color: "var(--destructive)" }}>*</span>
                  </Label>
                  <Select
                    required
                    value={roleType}
                    onValueChange={setRoleType}
                  >
                    <SelectTrigger id="role-type">
                      <SelectValue placeholder="Select role type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product-design">
                        Product Design
                      </SelectItem>
                      <SelectItem value="ux-design">
                        UX Design
                      </SelectItem>
                      <SelectItem value="ui-design">
                        UI Design
                      </SelectItem>
                      <SelectItem value="visual-design">
                        Visual Design
                      </SelectItem>
                      <SelectItem value="design-leadership">
                        Design Leadership
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="position"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Position
                  </Label>
                  <Input
                    id="position"
                    placeholder="e.g., Senior Product Designer"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="job-type"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Job Type
                  </Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger id="job-type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">
                        Full-time
                      </SelectItem>
                      <SelectItem value="part-time">
                        Part-time
                      </SelectItem>
                      <SelectItem value="contract">
                        Contract
                      </SelectItem>
                      <SelectItem value="freelance">
                        Freelance
                      </SelectItem>
                      <SelectItem value="internship">
                        Internship
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="location"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="work-type"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Work Type
                  </Label>
                  <Select value={workType} onValueChange={setWorkType}>
                    <SelectTrigger id="work-type">
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_TYPE_DB.map((type) => (
                        <SelectItem key={type} value={type}>
                          {WORK_TYPE_LABEL[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className="flex flex-col gap-2"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <Label
                    htmlFor="salary-range"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Salary Range
                  </Label>
                  <Input
                    id="salary-range"
                    placeholder="e.g., $120k - $150k"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="mb-10">
              <h3
                className="mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "var(--vibe-text-primary)",
                }}
              >
                Application Details
              </h3>
              <div
                className="h-px mb-7"
                style={{ backgroundColor: "var(--border)" }}
              />

              <div
                className="grid gap-x-8 gap-y-7"
                style={{
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                }}
              >
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="status"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Status{" "}
                    <span style={{ color: "var(--destructive)" }}>*</span>
                  </Label>
                  <Select
                    required
                    value={status}
                    onValueChange={setStatus}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {getStatusOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="applied-date"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Applied Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-11"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {appliedDate ? (
                          format(appliedDate, "PPP")
                        ) : (
                          <span style={{ color: "var(--vibe-text-secondary)" }}>
                            Pick a date
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <CalendarComponent
                        mode="single"
                        selected={appliedDate}
                        onSelect={setAppliedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="source"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Source
                  </Label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">
                        LinkedIn
                      </SelectItem>
                      <SelectItem value="company-website">
                        Company Website
                      </SelectItem>
                      <SelectItem value="indeed">Indeed</SelectItem>
                      <SelectItem value="glassdoor">
                        Glassdoor
                      </SelectItem>
                      <SelectItem value="referral">
                        Referral
                      </SelectItem>
                      <SelectItem value="recruiter">
                        Recruiter
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="priority"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Priority
                  </Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className="flex flex-col gap-2"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <Label
                    htmlFor="job-url"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Job Posting URL
                  </Label>
                  <Input
                    id="job-url"
                    type="url"
                    placeholder="https://..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Communication */}
            <div className="mb-10">
              <h3
                className="mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "var(--vibe-text-primary)",
                }}
              >
                Communication
              </h3>
              <div
                className="h-px mb-7"
                style={{ backgroundColor: "var(--border)" }}
              />

              <div
                className="grid gap-x-8 gap-y-7"
                style={{
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                }}
              >
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="contact-person"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Contact Person
                  </Label>
                  <Input
                    id="contact-person"
                    placeholder="e.g., Jane Smith"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="contact-email"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Contact Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="email@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="follow-up-date"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Follow-up Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left h-11"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {followUpDate ? (
                          format(followUpDate, "PPP")
                        ) : (
                          <span style={{ color: "var(--vibe-text-secondary)" }}>
                            Pick a date
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <CalendarComponent
                        mode="single"
                        selected={followUpDate}
                        onSelect={setFollowUpDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "var(--vibe-text-primary)",
                }}
              >
                Additional Information
              </h3>
              <div
                className="h-px mb-7"
                style={{ backgroundColor: "var(--border)" }}
              />

              <div
                className="grid gap-x-8 gap-y-7"
                style={{
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                }}
              >
                <div
                  className="flex items-center gap-3"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <Switch
                    id="cover-letter-toggle"
                    checked={includeCoverLetter}
                    onCheckedChange={setIncludeCoverLetter}
                  />
                  <Label
                    htmlFor="cover-letter-toggle"
                    className="cursor-pointer"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "400",
                      fontSize: "14px",
                    }}
                  >
                    Include cover letter
                  </Label>
                </div>

                {includeCoverLetter && (
                  <div
                    className="flex flex-col gap-2 animate-in fade-in duration-200"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <Textarea
                      placeholder="Paste or write your cover letter here…"
                      className="min-h-[120px] resize-y"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                )}

                <div
                  className="flex flex-col gap-2"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <Label
                    htmlFor="job-description"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Job Description
                  </Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste job details or requirements from the posting…"
                    className="min-h-[120px] resize-y"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div
                  className="flex flex-col gap-2"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <Label
                    htmlFor="notes"
                    style={{
                      color: "var(--vibe-text-primary)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any personal notes or remarks…"
                    className="min-h-[120px] resize-y"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>
        </ScrollArea>

        {/* Sticky Footer */}
        <div
          className="px-8 py-4 border-t flex justify-end gap-3"
          style={{
            backgroundColor: "var(--vibe-surface-subtle)",
            borderColor: "var(--border)",
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
