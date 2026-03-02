# Job Details Drawer - Display Rules Implementation

## Overview
Updated the Job Details Drawer to follow conditional visibility rules for sections and consistent empty field handling.

## Implementation Details

### 1. Helper Functions

**`hasValue(value: any): boolean`**
- Checks if a value is not null, undefined, or empty string
- Used to determine field visibility

**`renderEmptyField()`**
- Returns a styled "Not mentioned" placeholder
- Uses `text-muted-foreground` class
- Styled with Figtree font, 14px size
- Includes `aria-label="No value"` for accessibility

### 2. Section Visibility Checks

All sections now check if at least one field has a value before rendering:

```tsx
const hasStatusAndDates = jobData && (
  hasValue(jobData.status) ||
  hasValue(jobData.appliedDate) ||
  hasValue(jobData.followUpDate)
);

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

const hasPriority = jobData && hasValue(jobData.priority);
```

### 3. Conditional Section Rendering

Each section is wrapped in a conditional:

```tsx
{hasStatusAndDates && (
  <div className="mb-10">
    {/* Section content */}
  </div>
)}
```

### 4. Field-Level Display Logic

Each field within a visible section shows either:
- **Has value**: The actual value in primary text color
- **No value**: "Not mentioned" in muted text color
- **Loading**: Skeleton placeholder

Example:
```tsx
{jobData ? (
  hasValue(jobData.appliedDate) ? (
    <p style={{ /* primary text */ }}>
      {jobData.appliedDate}
    </p>
  ) : (
    renderEmptyField()
  )
) : (
  <Skeleton className="h-5 w-28" />
)}
```

### 5. Updated Sections

#### Status & Dates
- **Fields**: Status (Badge), Applied Date, Follow-up Date
- **Visibility**: Shows if any field has value
- **Empty handling**: "Not mentioned" for dates

#### Role & Work Type
- **Fields**: Role Type, Job Type, Work Type, Location
- **Visibility**: Shows if any field has value
- **Empty handling**: "Not mentioned" for each empty field

#### Source & Links
- **Fields**: Source, Job Posting URL
- **Visibility**: Shows if Source OR Job URL has value
- **Empty handling**: "Not mentioned" for Source; URL only shows if exists
- **Special case**: Entire section hidden if both Source and Job URL are missing

#### Priority
- **Fields**: Priority badge
- **Visibility**: Shows only if priority has value
- **Empty handling**: Section hidden entirely if no priority

### 6. Mock Data Examples

Updated `JobDrawerProvider.tsx` with test cases:

**Job ID "1"** - Full data (all sections visible):
```json
{
  "company": "Figma",
  "status": "interview",
  "appliedDate": "Oct 15, 2024",
  "followUpDate": "Oct 30, 2024",
  "roleType": "Product Designer",
  "jobType": "Full-time",
  "workType": "Remote",
  "location": "San Francisco, CA",
  "source": "LinkedIn",
  "jobUrl": "https://www.figma.com/careers",
  "priority": "high"
}
```

**Job ID "2"** - Partial data (some "Not mentioned"):
```json
{
  "company": "Google",
  "status": "applied",
  "appliedDate": "Oct 22, 2024",
  // No followUpDate → "Not mentioned"
  "roleType": "UX Design",
  // No jobType → "Not mentioned"
  "workType": "Hybrid",
  "location": "Mountain View, CA",
  "source": "Company Site"
  // No jobUrl
  // No priority → Priority section hidden
}
```

**Job ID "3"** - Minimal data (sections hidden):
```json
{
  "company": "Meta",
  "status": "follow-up",
  // No appliedDate → "Not mentioned"
  "followUpDate": "Nov 5, 2024",
  // No role/work type data → Entire section hidden
  // No source/links → Entire section hidden
  "priority": "medium"
}
```

## User Experience

### Before
- All sections always visible
- Empty fields showed "N/A"
- Inconsistent placeholder text

### After
- Sections only appear when relevant
- Consistent "Not mentioned" for empty fields
- Cleaner, less cluttered interface
- Better visual hierarchy

## Accessibility

- Empty field placeholders include `aria-label="No value"`
- Maintains proper heading structure
- Skeleton loaders for loading states
- All interactive elements remain keyboard accessible

## Design System Compliance

All styling uses CSS variables from the design system:

- `--font-family-body`: Figtree
- `--font-family-heading`: Poppins
- `--vibe-text-primary`: Primary text color
- `--vibe-text-secondary`: Secondary text color
- `--text-primary`: Standard primary text
- `--text-muted`: Muted/subdued text for "Not mentioned"

## Testing Checklist

- [x] Section hides when all fields empty
- [x] Section shows when at least one field has value
- [x] Empty fields show "Not mentioned" in muted style
- [x] Filled fields show values in primary text
- [x] Loading skeletons still work
- [x] No "N/A" anywhere
- [x] Priority section hides when no priority
- [x] Source & Links section hides when both empty
- [x] Accessibility labels present
- [x] Design system variables used throughout

## Future Enhancements

- [ ] Add animation for section appearance/disappearance
- [ ] Show count of filled vs total fields
- [ ] Add "Complete your profile" prompt for empty sections
- [ ] Track which fields are most commonly left empty
