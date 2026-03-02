/**
 * Unified badge styling helpers for Career Ladder
 * Ensures consistent status and priority badges across all pages
 * 
 * Note: This file is deprecated. Use StatusLabel component from './status-label' instead.
 * Keeping for backward compatibility.
 */

export type StatusType = 'Applied' | 'Interview' | 'Follow-up' | 'Rejected' | 'Offer' | 'Accepted' | 'Pending';
export type PriorityType = 'High' | 'Medium' | 'Low' | 'high' | 'medium' | 'low';

/**
 * Get status variant for StatusLabel component
 */
export function getStatusLabelVariant(status: string): string {
  return status.toLowerCase();
}

/**
 * Get priority variant for StatusLabel component
 */
export function getPriorityLabelVariant(priority: string): string {
  return priority.toLowerCase();
}

/**
 * Get unified status badge variant
 * Status badges: Applied/Interview (Blue), Follow-up/Pending (Yellow), Rejected (Red), Offer/Accepted (Green)
 */
export function getStatusVariant(status: string): 'default' | 'warning' | 'destructive' | 'success' {
  const statusLower = status.toLowerCase();
  
  if (statusLower === 'offer' || statusLower === 'accepted') {
    return 'success';
  }
  
  if (statusLower === 'applied' || statusLower === 'interview') {
    return 'default';
  }
  
  if (statusLower === 'follow-up' || statusLower === 'pending') {
    return 'warning';
  }
  
  if (statusLower === 'rejected') {
    return 'destructive';
  }
  
  return 'default';
}

/**
 * Get unified priority badge variant
 * Priority badges: High (Red), Medium (Yellow), Low (Gray)
 */
export function getPriorityVariant(priority: string): 'destructive' | 'warning' | 'secondary' {
  const priorityLower = priority.toLowerCase();
  
  if (priorityLower === 'high') {
    return 'destructive';
  }
  
  if (priorityLower === 'medium') {
    return 'warning';
  }
  
  return 'secondary';
}

/**
 * Get priority badge class for custom styling
 */
export function getPriorityClass(priority: string): string {
  const priorityLower = priority.toLowerCase();
  
  if (priorityLower === 'high') {
    return 'bg-[#DC3545] text-white hover:bg-[#DC3545]/90';
  }
  
  if (priorityLower === 'medium') {
    return 'bg-[#FFC107] text-white hover:bg-[#FFC107]/90';
  }
  
  return 'bg-[#BDBDBD] text-white hover:bg-[#BDBDBD]/90';
}
