import { CalendarIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format } from "date-fns@4.1.0";
import { WORK_TYPE_DB, WORK_TYPE_LABEL } from "../src/constants/workTypes";

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

interface JobDetailsEditProps {
  formData: FormData;
  formErrors: FormErrors;
  onUpdateField: (field: keyof FormData, value: any) => void;
  disabled?: boolean;
}

const labelStyle = {
  fontFamily: "var(--font-family-body)",
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--vibe-text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  marginBottom: "8px",
};

const sectionTitleStyle = {
  fontFamily: "var(--font-family-body)",
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--vibe-text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const errorStyle = {
  fontFamily: "var(--font-family-body)",
  fontSize: "12px",
  color: "#DC3545",
  marginTop: "4px",
};

export function JobDetailsEdit({
  formData,
  formErrors,
  onUpdateField,
  disabled = false,
}: JobDetailsEditProps) {
  return (
    <>
      {/* Statuses & Dates */}
      <div className="mb-10">
        <h4 className="mb-4" style={sectionTitleStyle}>
          Statuses & Dates
        </h4>
        <div className="h-px mb-4" style={{ backgroundColor: "#E6E9EF" }} />

        <div className="grid grid-cols-2 gap-6">
          {/* Status */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-status" style={labelStyle}>
              Status <span style={{ color: "#DC3545" }}>*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onUpdateField("status", value)}
              disabled={disabled}
            >
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.status && <p style={errorStyle}>{formErrors.status}</p>}
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-priority" style={labelStyle}>
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => onUpdateField("priority", value)}
              disabled={disabled}
            >
              <SelectTrigger id="edit-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applied Date */}
          <div className="flex flex-col gap-2">
            <Label style={labelStyle}>Applied Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left"
                  disabled={disabled}
                  style={{
                    fontFamily: "var(--font-family-body)",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.appliedDate ? (
                    format(formData.appliedDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.appliedDate}
                  onSelect={(date) => onUpdateField("appliedDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Follow-up Date */}
          <div className="flex flex-col gap-2">
            <Label style={labelStyle}>Follow-up Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left"
                  disabled={disabled}
                  style={{
                    fontFamily: "var(--font-family-body)",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.followUpDate ? (
                    format(formData.followUpDate, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.followUpDate}
                  onSelect={(date) => onUpdateField("followUpDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Role & Work Type */}
      <div className="mb-10">
        <h4 className="mb-4" style={sectionTitleStyle}>
          Role & Work Type
        </h4>
        <div className="h-px mb-4" style={{ backgroundColor: "#E6E9EF" }} />

        <div className="grid grid-cols-2 gap-6">
          {/* Role Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-role-type" style={labelStyle}>
              Role Type <span style={{ color: "#DC3545" }}>*</span>
            </Label>
            <Select
              value={formData.roleType}
              onValueChange={(value) => onUpdateField("roleType", value)}
              disabled={disabled}
            >
              <SelectTrigger id="edit-role-type">
                <SelectValue placeholder="Select role type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="product-design">Product Design</SelectItem>
                <SelectItem value="ux-design">UX Design</SelectItem>
                <SelectItem value="ui-design">UI Design</SelectItem>
                <SelectItem value="visual-design">Visual Design</SelectItem>
                <SelectItem value="design-leadership">Design Leadership</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.roleType && <p style={errorStyle}>{formErrors.roleType}</p>}
          </div>

          {/* Job Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-job-type" style={labelStyle}>
              Job Type
            </Label>
            <Select
              value={formData.jobType}
              onValueChange={(value) => onUpdateField("jobType", value)}
              disabled={disabled}
            >
              <SelectTrigger id="edit-job-type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Work Type */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-work-type" style={labelStyle}>
              Work Type
            </Label>
            <Select
              value={formData.workType}
              onValueChange={(value) => onUpdateField("workType", value)}
              disabled={disabled}
            >
              <SelectTrigger id="edit-work-type">
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

          {/* Location */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-location" style={labelStyle}>
              Location
            </Label>
            <Input
              id="edit-location"
              value={formData.location}
              onChange={(e) => onUpdateField("location", e.target.value)}
              placeholder="e.g., San Francisco, CA"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Source & Links */}
      <div className="mb-10">
        <h4 className="mb-4" style={sectionTitleStyle}>
          Source & Links
        </h4>
        <div className="h-px mb-4" style={{ backgroundColor: "#E6E9EF" }} />

        <div className="grid grid-cols-2 gap-6">
          {/* Source */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-source" style={labelStyle}>
              Source
            </Label>
            <Input
              id="edit-source"
              value={formData.source}
              onChange={(e) => onUpdateField("source", e.target.value)}
              placeholder="e.g., LinkedIn, Indeed"
              disabled={disabled}
            />
          </div>

          {/* Job URL */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-job-url" style={labelStyle}>
              Job URL
            </Label>
            <Input
              id="edit-job-url"
              type="url"
              value={formData.jobUrl}
              onChange={(e) => onUpdateField("jobUrl", e.target.value)}
              placeholder="https://..."
              disabled={disabled}
            />
            {formErrors.jobUrl && <p style={errorStyle}>{formErrors.jobUrl}</p>}
          </div>

          {/* Salary Range */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-salary-range" style={labelStyle}>
              Salary Range
            </Label>
            <Input
              id="edit-salary-range"
              value={formData.salaryRange}
              onChange={(e) => onUpdateField("salaryRange", e.target.value)}
              placeholder="e.g., $120k - $150k"
              disabled={disabled}
            />
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-company" style={labelStyle}>
              Company <span style={{ color: "#DC3545" }}>*</span>
            </Label>
            <Input
              id="edit-company"
              value={formData.company}
              onChange={(e) => onUpdateField("company", e.target.value)}
              placeholder="Company name"
              disabled={disabled}
            />
            {formErrors.company && <p style={errorStyle}>{formErrors.company}</p>}
          </div>

          {/* Position */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-position" style={labelStyle}>
              Position
            </Label>
            <Input
              id="edit-position"
              value={formData.position}
              onChange={(e) => onUpdateField("position", e.target.value)}
              placeholder="e.g., Senior Product Designer"
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Job Requirements */}
      <div className="mb-10">
        <h4 className="mb-4" style={sectionTitleStyle}>
          Job Requirements
        </h4>
        <div className="h-px mb-4" style={{ backgroundColor: "#E6E9EF" }} />

        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-requirements" style={labelStyle}>
            Requirements
          </Label>
          <Textarea
            id="edit-requirements"
            value={formData.requirements}
            onChange={(e) => onUpdateField("requirements", e.target.value)}
            placeholder="Enter job requirements..."
            rows={6}
            disabled={disabled}
            style={{
              fontFamily: "var(--font-family-body)",
              fontSize: "14px",
            }}
          />
        </div>
      </div>
    </>
  );
}
