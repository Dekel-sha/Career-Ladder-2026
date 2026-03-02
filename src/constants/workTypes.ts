// Work Type Constants - Single Source of Truth
// Database column: work_type ENUM('remote', 'hybrid', 'on_site')

export const WORK_TYPE_DB = ["remote", "hybrid", "on_site"] as const;
export type WorkTypeDb = typeof WORK_TYPE_DB[number];

export const WORK_TYPE_LABEL: Record<WorkTypeDb, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  on_site: "On-site",
};

/**
 * Type guard to validate work type against database values
 * @param value - The value to check
 * @returns true if value is a valid work type
 */
export function isValidWorkType(value: string): value is WorkTypeDb {
  return (WORK_TYPE_DB as readonly string[]).includes(value);
}
