# Job Details Drawer - Display Examples

## Visual Reference for Conditional Display Rules

### Example 1: Complete Job Application (All Sections Visible)

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Figma                                              ✏️ 🗑️ ✕ │
│  Senior Product Designer                                    │
├─────────────────────────────────────────────────────────────┤
│  Details | Notes                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATUS & DATES                                             │
│  ────────────────────────────────────────────────────────   │
│  Status              Applied Date                           │
│  [Interview]         Oct 15, 2024                           │
│                                                              │
│  Follow-up Date                                             │
│  Oct 30, 2024                                               │
│                                                              │
│  ROLE & WORK TYPE                                           │
│  ────────────────────────────────────────────────────────   │
│  Role Type           Job Type                               │
│  Product Designer    Full-time                              │
│                                                              │
│  Work Type           Location                               │
│  Remote              San Francisco, CA                      │
│                                                              │
│  SOURCE & LINKS                                             │
│  ────────────────────────────────────────────────────────   │
│  Source                                                     │
│  LinkedIn                                                   │
│                                                              │
│  Job Posting URL                                            │
│  https://www.figma.com/careers 🔗                          │
│                                                              │
│  PRIORITY                                                   │
│  ────────────────────────────────────────────────────────   │
│  [High]                                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Example 2: Partial Job Application (Some Fields Empty)

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Google                                             ✏️ 🗑️ ✕ │
│  UX Designer                                                │
├─────────────────────────────────────────────────────────────┤
│  Details | Notes                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATUS & DATES                                             │
│  ────────────────────────────────────────────────────────   │
│  Status              Applied Date                           │
│  [Applied]           Oct 22, 2024                           │
│                                                              │
│  Follow-up Date                                             │
│  Not mentioned       👈 Muted text, smaller size            │
│                                                              │
│  ROLE & WORK TYPE                                           │
│  ────────────────────────────────────────────────────────   │
│  Role Type           Job Type                               │
│  UX Design           Not mentioned  👈 Muted text           │
│                                                              │
│  Work Type           Location                               │
│  Hybrid              Mountain View, CA                      │
│                                                              │
│  SOURCE & LINKS                                             │
│  ────────────────────────────────────────────────────────   │
│  Source                                                     │
│  Company Site                                               │
│                     👈 No Job URL field shown               │
│                                                              │
│  ⚠️ PRIORITY SECTION HIDDEN (no priority value)             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Example 3: Minimal Job Application (Multiple Sections Hidden)

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Meta                                               ✏️ 🗑️ ✕ │
│  Product Designer                                           │
├─────────────────────────────────────────────────────────────┤
│  Details | Notes                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATUS & DATES                                             │
│  ────────────────────────────────────────────────────────   │
│  Status              Applied Date                           │
│  [Follow-up]         Not mentioned  👈 Muted text           │
│                                                              │
│  Follow-up Date                                             │
│  Nov 5, 2024                                                │
│                                                              │
│  ⚠️ ROLE & WORK TYPE SECTION HIDDEN                         │
│     (all fields empty: roleType, jobType, workType,         │
│      location)                                              │
│                                                              │
│  ⚠️ SOURCE & LINKS SECTION HIDDEN                           │
│     (both source and jobUrl empty)                          │
│                                                              │
│  PRIORITY                                                   │
│  ────────────────────────────────────────────────────────   │
│  [Medium]                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Example 4: Loading State

```
┌─────────────────────────────────────────────────────────────┐
│  📋 ▓▓▓▓▓▓▓▓                                          ✏️ 🗑️ ✕ │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                           │
├─────────────────────────────────────────────────────────────┤
│  Details | Notes                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATUS & DATES                                             │
│  ────────────────────────────────────────────────────────   │
│  Status              Applied Date                           │
│  ▓▓▓▓▓▓              ▓▓▓▓▓▓▓▓▓▓                             │
│                                                              │
│  Follow-up Date                                             │
│  ▓▓▓▓▓▓▓▓▓▓                                                 │
│                                                              │
│  ... (skeleton loaders for all sections)                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Display Decision Tree

```
For each section:
  ┌─ Does at least ONE field have a value?
  │
  ├─ YES → Show section header + divider
  │         │
  │         └─ For each field in section:
  │             │
  │             ├─ Has value? → Show value in primary text
  │             └─ No value?  → Show "Not mentioned" in muted text
  │
  └─ NO → Hide entire section (header, divider, fields)
```

---

## Field States Summary

### State 1: Has Value
```tsx
<p style={{ 
  fontFamily: "var(--font-family-body)", 
  fontSize: "14px", 
  color: "var(--text-primary)" 
}}>
  Oct 15, 2024
</p>
```

### State 2: No Value (Empty)
```tsx
<span 
  className="text-muted-foreground"
  aria-label="No value"
  style={{ 
    fontFamily: "var(--font-family-body)", 
    fontSize: "14px" 
  }}
>
  Not mentioned
</span>
```

### State 3: Loading
```tsx
<Skeleton className="h-5 w-28" />
```

---

## Section Visibility Rules

| Section | Condition to Show | Fields Checked |
|---------|------------------|----------------|
| **Status & Dates** | Any field has value | `status`, `appliedDate`, `followUpDate` |
| **Role & Work Type** | Any field has value | `roleType`, `jobType`, `workType`, `location` |
| **Source & Links** | Source OR URL exists | `source`, `jobUrl` |
| **Priority** | Priority has value | `priority` |

---

## Interaction Examples

### Clicking a Job Card
```
User clicks → Drawer slides in → Shows skeleton → Fetches data → Updates with actual data
                ↓
            URL updates to ?drawer=1
```

### Missing Data Scenarios

**Scenario A**: User applied but hasn't set follow-up
- ✅ Section shown (status and applied date present)
- 📝 Follow-up shows "Not mentioned"

**Scenario B**: No work type information at all
- ❌ Entire "Role & Work Type" section hidden
- ✨ Cleaner interface, no empty section

**Scenario C**: Has source but no URL
- ✅ Section shown (source present)
- 📝 URL field not rendered at all
- 💡 Only source field visible

---

## Testing with Different Job IDs

```bash
# Test with full data
Click job with ID "1" → All sections visible

# Test with partial data
Click job with ID "2" → Some "Not mentioned", Priority hidden

# Test with minimal data
Click job with ID "3" → Multiple sections hidden

# Test loading state
Click any job → See skeletons during 300ms delay
```

---

## Accessibility Notes

Every "Not mentioned" field includes:
```html
<span 
  className="text-muted-foreground" 
  aria-label="No value"
>
  Not mentioned
</span>
```

Screen reader announces: "Field name: No value"

Example:
- Visual: "Applied Date: Not mentioned"
- Screen reader: "Applied Date, No value"
