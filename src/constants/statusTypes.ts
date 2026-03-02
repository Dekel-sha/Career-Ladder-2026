/**
 * Status Types Constants
 * 
 * This file contains the mapping between database enum values and display labels
 * for application statuses. The database uses snake_case enum values (status_type),
 * while the UI displays user-friendly labels.
 * 
 * Database enum values (status_type):
 * - "applied"
 * - "interview"
 * - "follow_up"
 * - "accepted"
 * - "rejected"
 */

export const STATUS_TYPES = {
  APPLIED: "applied",
  INTERVIEW: "interview",
  FOLLOW_UP: "follow_up",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type StatusTypeValue = (typeof STATUS_TYPES)[keyof typeof STATUS_TYPES];

export const STATUS_LABELS: Record<StatusTypeValue, string> = {
  [STATUS_TYPES.APPLIED]: "Applied",
  [STATUS_TYPES.INTERVIEW]: "Interview",
  [STATUS_TYPES.FOLLOW_UP]: "Follow-up",
  [STATUS_TYPES.ACCEPTED]: "Offer",
  [STATUS_TYPES.REJECTED]: "Rejected",
};

/**
 * Get display label for a status type value
 */
export function getStatusLabel(status: string | null | undefined): string {
  if (!status) return "Unknown";
  return STATUS_LABELS[status as StatusTypeValue] || status;
}

/**
 * Validate if a status value is valid
 */
export function isValidStatus(status: string): status is StatusTypeValue {
  return Object.values(STATUS_TYPES).includes(status as StatusTypeValue);
}

/**
 * Get all status options for dropdowns
 */
export function getStatusOptions() {
  return Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
}
