# Job Details Drawer - Structure Refactor

## Overview
Refactored the Job Details Drawer for better clarity and logical grouping of information, moving Priority into the main status section and adding new sections for Job Requirements and Cover Letter.

---

## 1. Section Reorganization

### Details Tab Structure (New Order)

```
Details Tab
├── Statuses & Dates (renamed from "Status & Dates")
│   ├── Status
│   ├── Priority (moved from bottom)
│   ├── Applied Date
│   └── Follow-up Date
│
├── Role & Work Type
│   ├── Role Type
│   ├── Job Type
│   ├── Work Type
│   └── Location
│
├── Source & Links
│   ├── Source
│   └── Job Posting URL
│
└── Job Requirements (NEW)
    └── Multi-line text content
```

### Notes Tab Structure (New Order)

```
Notes Tab
├── Cover Letter (NEW)
│   └── Multi-line text content
│
└── Notes (existing)
    └── List of user notes
```

---

## 2. Key Changes

### A. Section Renaming
**Before:** "Status & Dates"  
**After:** "Statuses & Dates"

**Rationale:** The section now contains both Status and Priority, making the plural form more accurate.

### B. Priority Field Relocation

**Before:**
- Priority was its own section at the bottom of Details tab
- Separated from other status-related information

**After:**
- Priority is now the second field in "Statuses & Dates"
- Field order: Status → Priority → Applied Date → Follow-up Date

**Rationale:** 
- Priority is a status indicator, not a standalone section
- Groups all status and timeline information together
- Reduces visual clutter by eliminating a separate section
- Follows information hierarchy (what → priority → when)

### C. New Job Requirements Section

**Location:** Details tab, after "Source & Links"

**Specifications:**
- **Visibility:** Only shown if `jobData.requirements` exists
- **Content:** Multi-line text with preserved line breaks
- **Typography:**
  - Font: Figtree (body)
  - Size: 14px
  - Weight: 400
  - Color: `var(--vibe-text-primary)`
  - Line height: 1.6
  - White space: `pre-wrap` (preserves formatting)

**Example Data:**
```
5+ years of experience in product design
Strong portfolio demonstrating design systems work
Experience with Figma and prototyping tools
Excellent communication and collaboration skills
BS/BA in Design, HCI, or related field
```

### D. New Cover Letter Section

**Location:** Notes tab, above user notes list

**Specifications:**
- **Visibility:** Only shown if `jobData.coverLetter` exists
- **Content:** Multi-line text with preserved line breaks
- **Typography:** Same as Job Requirements
- **Section title:** "Cover Letter" (12px uppercase)

**Empty State Logic:**
- Empty state now only shows when BOTH cover letter AND notes are missing
- If cover letter exists but no notes, only cover letter section displays
- If notes exist but no cover letter, only notes section displays

---

## 3. Visual Layout

### Statuses & Dates Section (2x2 Grid)

```
┌─────────────────────────────────────────────────────────┐
│  STATUSES & DATES                                        │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  STATUS               PRIORITY                           │
│  [Interview]          [High]                             │
│                                                          │
│  APPLIED DATE         FOLLOW-UP DATE                     │
│  Oct 15, 2024         Oct 30, 2024                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Job Requirements Section (Full Width)

```
┌─────────────────────────────────────────────────────────┐
│  JOB REQUIREMENTS                                        │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  5+ years of experience in product design               │
│  Strong portfolio demonstrating design systems work     │
│  Experience with Figma and prototyping tools            │
│  Excellent communication and collaboration skills       │
│  BS/BA in Design, HCI, or related field                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Notes Tab with Cover Letter

```
┌─────────────────────────────────────────────────────────┐
│  COVER LETTER                                            │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Dear Hiring Manager,                                   │
│                                                          │
│  I am excited to apply for the Senior Product Designer  │
│  position at Figma. With over 6 years of experience...  │
│                                                          │
│  Best regards,                                           │
│  [Your Name]                                             │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  NOTES                                                   │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Initial phone screen went well. Team seems very   │  │
│  │ collaborative.                                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Design challenge due next week - focus on         │  │
│  │ accessibility features.                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Data Model Updates

### Interface Changes

```typescript
interface JobDetailsDrawerProps {
  jobData?: {
    // ... existing fields ...
    priority?: "low" | "medium" | "high";
    requirements?: string;      // NEW
    coverLetter?: string;        // NEW
    notes?: string[];
  };
}
```

### Conditional Visibility Logic

```typescript
// Updated to include priority
const hasStatusAndDates = jobData && (
  hasValue(jobData.status) ||
  hasValue(jobData.priority) ||      // Added
  hasValue(jobData.appliedDate) ||
  hasValue(jobData.followUpDate)
);

// New sections
const hasRequirements = jobData && hasValue(jobData.requirements);
const hasCoverLetter = jobData && hasValue(jobData.coverLetter);
```

---

## 5. Mock Data Examples

### Job #1: Full Application (All Fields)
```javascript
{
  company: "Figma",
  status: "interview",
  priority: "high",
  appliedDate: "Oct 15, 2024",
  followUpDate: "Oct 30, 2024",
  // ... role/work type fields ...
  requirements: "5+ years of experience...\nStrong portfolio...",
  coverLetter: "Dear Hiring Manager,\n\nI am excited...",
  notes: ["Phone screen went well", "Design challenge due"]
}
```
**Display:**
- ✅ Statuses & Dates (all 4 fields)
- ✅ Role & Work Type
- ✅ Source & Links
- ✅ Job Requirements
- ✅ Cover Letter (in Notes tab)
- ✅ Notes list (in Notes tab)

### Job #2: Partial Data
```javascript
{
  company: "Google",
  status: "applied",
  appliedDate: "Oct 22, 2024",
  // No priority, followUpDate
  requirements: "3+ years UX design experience...",
  // No coverLetter
  notes: []
}
```
**Display:**
- ✅ Statuses & Dates (Status + Applied Date, Priority shows "Not mentioned")
- ✅ Role & Work Type
- ✅ Source & Links
- ✅ Job Requirements
- ❌ Cover Letter hidden (no data)
- ❌ Notes section hidden (empty array)
- ✅ "No notes yet" empty state shown in Notes tab

### Job #3: Minimal Data
```javascript
{
  company: "Meta",
  status: "follow-up",
  followUpDate: "Nov 5, 2024",
  priority: "medium",
  // No requirements
  coverLetter: "Dear Meta Team,\n\nI'm writing...",
  notes: ["Follow up scheduled"]
}
```
**Display:**
- ✅ Statuses & Dates (Status + Priority + Follow-up Date)
- ❌ Role & Work Type hidden (all fields empty)
- ❌ Source & Links hidden (all fields empty)
- ❌ Job Requirements hidden (no data)
- ✅ Cover Letter (in Notes tab)
- ✅ Notes list (in Notes tab)

---

## 6. Responsive Behavior

### Desktop (≥768px)
- Statuses & Dates: 2-column grid
- Job Requirements: Full width paragraph
- Cover Letter: Full width paragraph
- Notes: Full width cards

### Mobile (<768px)
- All grids collapse to single column
- Text sections remain full width
- Consistent padding and spacing maintained

---

## 7. Styling Specifications

### Section Headers
```css
font-family: var(--font-family-body);  /* Figtree */
font-size: 12px;
font-weight: 600;
color: var(--vibe-text-secondary);
text-transform: uppercase;
letter-spacing: 0.5px;
margin-bottom: 16px;  /* 4 to divider, 4 after divider = 8px total */
```

### Section Dividers
```css
height: 1px;
background-color: #E6E9EF;
margin-bottom: 16px;
```

### Multi-line Content (Requirements & Cover Letter)
```css
font-family: var(--font-family-body);  /* Figtree */
font-size: 14px;
font-weight: 400;
color: var(--vibe-text-primary);
line-height: 1.6;
white-space: pre-wrap;  /* Preserves line breaks and formatting */
```

### Section Spacing
```css
margin-bottom: 40px;  /* 10 = 40px */
```

### Priority Badge (Same as Status)
```css
padding: 4px 12px;  /* px-3 py-1 */
border-radius: 4px;
text-transform: capitalize;
```

---

## 8. User Experience Improvements

### Before
```
Details Tab
├── Status & Dates (3 fields)
├── Role & Work Type
├── Source & Links
└── Priority (separate section at bottom)

Notes Tab
└── Notes list OR empty state
```
**Issues:**
- Priority separated from other status information
- No way to store/view job requirements
- No way to store/view cover letter
- Notes tab always felt empty without notes

### After
```
Details Tab
├── Statuses & Dates (4 fields - more cohesive)
├── Role & Work Type
├── Source & Links
└── Job Requirements (valuable context)

Notes Tab
├── Cover Letter (important application artifact)
└── Notes list OR empty state
```
**Benefits:**
- ✅ All status information grouped logically
- ✅ Job requirements provide context for preparation
- ✅ Cover letter preserved as application artifact
- ✅ Notes tab has more value even before adding notes
- ✅ Reduced visual clutter (one less section header)
- ✅ Better information hierarchy

---

## 9. Content Guidelines

### Job Requirements
**Purpose:** Store the job posting requirements/qualifications for easy reference during preparation.

**Format:** Plain text with line breaks, typically:
- Years of experience required
- Technical skills needed
- Education requirements
- Soft skills or attributes

**Example:**
```
5+ years of experience in product design
Strong portfolio demonstrating design systems work
Experience with Figma and prototyping tools
Excellent communication and collaboration skills
BS/BA in Design, HCI, or related field
```

### Cover Letter
**Purpose:** Store the cover letter submitted with the application for reference.

**Format:** Plain text with paragraphs, typically:
- Opening salutation
- Introduction paragraph
- Body paragraphs (experience, fit, interest)
- Closing paragraph
- Sign-off

**Example:**
```
Dear Hiring Manager,

I am excited to apply for the Senior Product Designer position at Figma...

Best regards,
[Your Name]
```

---

## 10. Migration Checklist

- [x] Rename "Status & Dates" to "Statuses & Dates"
- [x] Move Priority field into Statuses & Dates section
- [x] Update field order: Status → Priority → Applied Date → Follow-up Date
- [x] Remove standalone Priority section
- [x] Add `requirements` field to interface
- [x] Add `coverLetter` field to interface
- [x] Create Job Requirements section in Details tab
- [x] Create Cover Letter section in Notes tab
- [x] Update conditional visibility logic
- [x] Update Notes tab empty state logic
- [x] Add section title to Notes list when cover letter exists
- [x] Update mock data with example requirements
- [x] Update mock data with example cover letters
- [x] Test all visibility combinations
- [x] Verify responsive layout
- [x] Verify text formatting (line breaks preserved)
- [x] Verify styling consistency

---

## 11. Future Enhancements

### Phase 1: Basic Editing
- [ ] Add edit mode for requirements
- [ ] Add edit mode for cover letter
- [ ] Rich text formatting for cover letter
- [ ] Character count for cover letter

### Phase 2: Smart Features
- [ ] AI-powered cover letter suggestions
- [ ] Highlight matching skills from requirements
- [ ] Generate interview prep questions from requirements
- [ ] Track which requirements you meet (checklist)

### Phase 3: Templates
- [ ] Cover letter templates
- [ ] Requirement parsing from job postings
- [ ] Auto-populate from LinkedIn/resume
- [ ] Version history for cover letters

---

## Summary

The refactored Job Details Drawer now provides:

✅ **Better Information Architecture:** Status and Priority grouped together  
✅ **More Context:** Job requirements help with preparation  
✅ **Application Artifacts:** Cover letters preserved for reference  
✅ **Cleaner Interface:** One less section header, better visual hierarchy  
✅ **Enhanced Notes Tab:** Valuable content even without user notes  
✅ **Consistent Styling:** All sections follow Vibe UI Kit standards  
✅ **Flexible Visibility:** Sections only appear when relevant  

The drawer now serves as a comprehensive application management tool, not just a data viewer.
