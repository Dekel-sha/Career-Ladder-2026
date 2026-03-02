# Job Details Drawer - Usage Guide

## Overview
The Job Details Drawer is a global, persistent side panel that displays detailed information about job applications. It can be triggered from anywhere in the application by clicking on job items.

## Key Features

### 🎯 Global Trigger System
- **Automatic Detection**: Any element with `data-job-id`, `data-role="job-row"`, or `data-role="job-card"` will automatically open the drawer when clicked
- **Smart Click Handling**: Ignores clicks on interactive elements (buttons, links, inputs) to prevent conflicts
- **Keyboard Support**: ESC key closes the drawer
- **URL Integration**: Updates URL with `?drawer=1` when open, and can auto-open from URL

### 🎨 Visual Design
- Width: 880px (default), resizable up to 920px by dragging the left edge
- Drop shadow: `0 8px 24px rgba(0, 0, 0, 0.08)`
- Rounded corners on the left side (12px)
- Smooth slide-in animation (200ms ease-in-out)
- No background overlay (persistent drawer style)

### ♿ Accessibility
- Focus trap when open
- Returns focus to trigger element on close
- `aria-label="Job details"` for screen readers
- Full keyboard navigation support

## How to Use

### 1. Basic Implementation

Any existing job item can trigger the drawer by adding data attributes:

```tsx
// Using data-job-id (recommended)
<div data-job-id="123" className="job-card">
  <h3>Senior Designer</h3>
  <p>Figma</p>
</div>

// Using data-role
<div data-role="job-card" data-job-id="456">
  <h3>Product Designer</h3>
  <p>Google</p>
</div>

// Table row example
<TableRow 
  data-job-id={application.id} 
  data-role="job-row"
  className="cursor-pointer"
>
  <TableCell>{application.company}</TableCell>
  <TableCell>{application.position}</TableCell>
</TableRow>
```

### 2. Programmatic Control

You can also control the drawer programmatically using the context:

```tsx
import { useJobDrawer } from './components/JobDrawerProvider';

function MyComponent() {
  const { open, close, isOpen, jobId } = useJobDrawer();

  const handleViewDetails = (id: string) => {
    open(id);
  };

  return (
    <button onClick={() => handleViewDetails('job-123')}>
      View Details
    </button>
  );
}
```

### 3. Interactive Elements

The drawer smartly ignores clicks on interactive elements:

```tsx
<div data-job-id="123" className="job-card">
  <h3>Senior Designer</h3>
  
  {/* These won't trigger the drawer */}
  <button onClick={handleEdit}>Edit</button>
  <a href="/apply">Apply Now</a>
  <input type="checkbox" />
  
  {/* Cmd/Ctrl + Click on links still works */}
  <a href="/job/123">View in new tab</a>
</div>
```

## Architecture

### Components Structure

```
JobDrawerProvider (Context Provider)
  ├── Global click listener (document-level delegation)
  ├── URL synchronization (?drawer=1)
  ├── Focus management
  └── JobDetailsDrawer (Visual Component)
      ├── Resizable handle
      ├── Header with actions
      ├── Tabs (Details | Notes)
      ├── ScrollArea with content
      └── Skeleton loaders
```

### Data Flow

1. User clicks on a job item with `data-job-id`
2. Global click listener captures the event
3. JobDrawerProvider opens drawer with the job ID
4. URL updates to include `?drawer=1`
5. Drawer fetches job data and displays it
6. While loading, skeleton placeholders are shown
7. On close, URL parameter is removed and focus returns to trigger

## Customization

### Fetching Real Data

Replace the mock data fetching in `JobDrawerProvider.tsx`:

```tsx
const fetchJobData = async (id: string) => {
  setIsLoading(true);
  
  try {
    // Replace with your API call
    const response = await fetch(`/api/jobs/${id}`);
    const data = await response.json();
    setJobData(data);
  } catch (error) {
    console.error('Failed to fetch job data:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### Styling

The drawer uses your design system's CSS variables:
- `--font-family-heading`: Poppins
- `--font-family-body`: Figtree
- `--vibe-text-primary`: Main text color
- `--vibe-text-secondary`: Secondary text color
- `--text-primary`: Primary text color
- `--text-muted`: Muted text color

## Best Practices

1. **Always add cursor-pointer**: Make it visually clear that items are clickable
   ```tsx
   <div data-job-id="123" className="cursor-pointer">
   ```

2. **Use unique IDs**: Ensure each job has a unique identifier
   ```tsx
   data-job-id={application.id.toString()}
   ```

3. **Preserve interactivity**: Don't wrap interactive elements if they shouldn't trigger the drawer
   ```tsx
   {/* Good */}
   <div data-job-id="123">
     <button onClick={e => e.stopPropagation()}>Action</button>
   </div>
   ```

4. **Loading states**: The drawer shows skeletons automatically while loading

5. **Error handling**: Add error boundaries around the drawer for production

## Examples in Codebase

### Dashboard Recent Applications
Location: `/components/Dashboard.tsx`

```tsx
<div
  data-job-id={app.id.toString()}
  data-role="job-card"
  className="cursor-pointer"
>
  <h4>{app.position}</h4>
  <p>{app.company}</p>
</div>
```

### All Applications Table
Location: `/components/AllApplications.tsx`

```tsx
<TableRow
  data-job-id={app.id.toString()}
  data-role="job-row"
  className="cursor-pointer"
>
  <TableCell>{app.company}</TableCell>
  <TableCell>{app.position}</TableCell>
</TableRow>
```

## Troubleshooting

**Drawer doesn't open when clicking**
- Check if `data-job-id` or `data-role` attribute is present
- Verify the element is not inside another clickable element
- Check console for JavaScript errors

**Interactive elements trigger drawer**
- The system should ignore clicks on buttons, links, inputs automatically
- If needed, add `onClick={e => e.stopPropagation()}` to the interactive element

**Drawer content not loading**
- Check the `fetchJobData` function in `JobDrawerProvider.tsx`
- Verify the job ID is being passed correctly
- Check network requests in browser DevTools

**URL not updating**
- Ensure the drawer is wrapped in `JobDrawerProvider`
- Check browser console for errors
- Verify `window.history.pushState` is available

## Future Enhancements

- [ ] Add loading error states
- [ ] Implement edit functionality
- [ ] Add delete confirmation
- [ ] Support for multiple drawers (stacking)
- [ ] Keyboard shortcuts (e.g., 'E' for edit, 'D' for delete)
- [ ] Animation preferences (reduce motion support)
- [ ] Offline support with cached data
