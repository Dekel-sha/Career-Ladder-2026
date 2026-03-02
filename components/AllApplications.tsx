import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { supabase } from "../src/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip@1.1.8";
import {
  Search,
  Edit,
  Trash2,
  Info,
  X,
  Download,
  RefreshCw,
  Calendar,
  ChevronUp,
  ChevronDown,
  Circle,
  Filter,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { StatusLabel } from "./ui/status-label";
import { Chips } from "./ui/chips";
import { WORK_TYPE_LABEL, type WorkTypeDb } from "../src/constants/workTypes";
import { EmptyState } from "./EmptyState";

interface Application {
  id: string;
  company: string;
  position: string;
  status:
    | "applied"
    | "interview"
    | "follow-up"
    | "rejected"
    | "offer";
  appliedDate: string | null;
  location: string | null;
  workType: WorkTypeDb | null;
  source: string | null;
  role: string | null;
  priority: "High" | "Medium" | "Low" | null;
}

export function AllApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(),
  );
  const [statusFilter, setStatusFilter] =
    useState("all-status");
  const [workTypeFilter, setWorkTypeFilter] =
    useState("all-work");
  const [priorityFilter, setPriorityFilter] =
    useState("all-priority");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // Fetch applications from Supabase
  useEffect(() => {
    async function load() {
      setIsLoading(true);

      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id;
      if (!userId) {
        setApplications([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("jobs")
        .select(`
          id,
          company,
          position_title,
          status,
          applied_date,
          location,
          work_type,
          source,
          role,
          priority
        `)
        .eq("user_id", userId)
        .order("applied_date", { ascending: false });

      if (error) {
        console.error(error);
        setApplications([]);
        setIsLoading(false);
        return;
      }

      const mapped = (data ?? []).map((row) => ({
        id: row.id,
        company: row.company,
        position: row.position_title,
        status: row.status,
        appliedDate: row.applied_date,
        location: row.location,
        workType: row.work_type,
        source: row.source,
        role: row.role,
        priority: row.priority,
      }));

      setApplications(mapped);
      setIsLoading(false);
    }

    load();
  }, []);

  // Listen for application deletion events
  useEffect(() => {
    const handleApplicationDeleted = (event: CustomEvent) => {
      const deletedId = event.detail.id;
      setDeletedIds(prev => new Set(prev).add(deletedId));
      
      // Also remove from selected IDs if it was selected
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(deletedId);
        return newSet;
      });
    };

    window.addEventListener('applicationDeleted', handleApplicationDeleted as EventListener);
    
    return () => {
      window.removeEventListener('applicationDeleted', handleApplicationDeleted as EventListener);
    };
  }, []);

  // Applications are now fetched from Supabase in useEffect above

  const hasActiveFilters =
    statusFilter !== "all-status" ||
    workTypeFilter !== "all-work" ||
    priorityFilter !== "all-priority" ||
    searchQuery !== "";

  const handleSelectAll = () => {
    if (selectedIds.size === applications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(
        new Set(applications.map((app) => app.id)),
      );
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleClearFilters = () => {
    setStatusFilter("all-status");
    setWorkTypeFilter("all-work");
    setPriorityFilter("all-priority");
    setSearchQuery("");
    toast.success("Filters cleared");
  };

  const handleBulkDelete = () => {
    toast.success(`${selectedIds.size} applications deleted`);
    setSelectedIds(new Set());
  };

  const handleBulkStatusChange = () => {
    toast.success(
      `Status updated for ${selectedIds.size} applications`,
    );
    setSelectedIds(new Set());
  };

  const handleBulkExport = () => {
    toast.success(
      `Exporting ${selectedIds.size} applications to CSV`,
    );
  };

  const handleEdit = (company: string) => {
    toast.success(`Opening editor for ${company}`);
  };

  const handleDelete = (company: string) => {
    toast.success(`Application for ${company} deleted`);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <ChevronUp className="w-3 h-3" />;
      case "Medium":
        return <Circle className="w-3 h-3" />;
      case "Low":
        return <ChevronDown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  /**
   * Format date from YYYY-MM-DD to Israeli format DD/MM/YYYY
   * @param dateString - Date in YYYY-MM-DD format
   * @returns Date in DD/MM/YYYY format
   */
  const formatDateToIsraeli = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const isEmpty = applications.length === 0;

  return (
    <div
      className="p-8 space-y-8 max-w-[1440px] mx-auto w-full"
      id="AllApplications-Main"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[16px]">All Applications</h1>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by company, title, or keyword..."
          className="pl-12 h-12 text-base text-left"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter/Selection Bar Container - Fixed Height */}
      <div className="w-full mt-8 relative" id="AllApplications-ControlBar" style={{ minHeight: '48px' }}>
        {/* Filters Bar - Shows when no selection */}
        <div 
          className={`w-full transition-all duration-200 ease-in-out ${
            selectedIds.size > 0 
              ? 'opacity-0 pointer-events-none absolute inset-0' 
              : 'opacity-100 relative'
          }`}
          id="AllApplications-Filters"
        >
          <div className="flex w-full items-center gap-2 md:flex-nowrap flex-wrap">
            {/* LEFT: Dropdowns */}
            <div className="flex items-center gap-2 flex-1 min-w-0 py-[0px] px-[0px] p-[0px]">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger
                  className={`shrink-0 w-36 md:w-40 ${statusFilter !== "all-status" ? "border-primary bg-primary/5" : ""}`}
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">
                    All Status
                  </SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">
                    Interview
                  </SelectItem>
                  <SelectItem value="follow-up">
                    Follow-up
                  </SelectItem>
                  <SelectItem value="rejected">
                    Rejected
                  </SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={workTypeFilter}
                onValueChange={setWorkTypeFilter}
              >
                <SelectTrigger
                  className={`shrink-0 w-36 md:w-40 ${workTypeFilter !== "all-work" ? "border-primary bg-primary/5" : ""}`}
                >
                  <SelectValue placeholder="Work Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-work">
                    All Work Types
                  </SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="on_site">On-site</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
              >
                <SelectTrigger
                  className={`shrink-0 w-36 md:w-40 ${priorityFilter !== "all-priority" ? "border-primary bg-primary/5" : ""}`}
                >
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-priority">
                    All Priority
                  </SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* RIGHT: Date range + Clear */}
            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap px-[0px] py-[0px] mx-[0px] my-[0px] m-[0px] p-[0px]">
              <div className="relative shrink-0">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  type="date"
                  className="w-36 md:w-40 shrink-0 pl-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
                  placeholder="dd/mm/yyyy"
                />
              </div>
              <div className="relative shrink-0">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  type="date"
                  className="w-36 md:w-40 shrink-0 pl-[36px] [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden pt-[12px] pr-[16px] pb-[12px]"
                  placeholder="dd/mm/yyyy"
                />
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="gap-2 text-primary hover:text-primary shrink-0"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Selection Bar - Shows when items selected */}
        <div 
          className={`w-full transition-all duration-200 ease-in-out ${
            selectedIds.size > 0 
              ? 'opacity-100 relative' 
              : 'opacity-0 pointer-events-none absolute inset-0'
          }`}
          id="AllApplications-SelectionBar"
        >
          <style>{`
            .vibe-button-secondary {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              height: 40px;
              min-height: 40px;
              max-height: 40px;
              padding: 0 var(--space-16);
              gap: var(--space-8);
              border-radius: 4px;
              border: 1px solid var(--ui-border-color);
              background: transparent;
              color: var(--primary-text-color);
              font-family: var(--font-family-body);
              font-size: var(--text-sm);
              font-weight: 400;
              cursor: pointer;
              transition: all 150ms ease-in-out;
              white-space: nowrap;
            }
            
            .vibe-button-secondary:hover {
              background: var(--vibe-hover-bg);
              border-color: var(--ui-border-color);
            }
            
            .vibe-button-secondary:focus {
              outline: none;
              border-color: var(--vibe-primary-blue);
              box-shadow: 0 0 0 1px var(--vibe-primary-blue);
            }
            
            .vibe-button-secondary:active {
              background: var(--primary-hover-background-color);
              transform: scale(0.98);
            }
            
            .vibe-button-secondary:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            
            .vibe-button-primary-negative {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              height: 40px;
              min-height: 40px;
              max-height: 40px;
              padding: 0 var(--space-16);
              gap: var(--space-8);
              border-radius: 4px;
              border: none;
              background: var(--negative-color);
              color: var(--text-color-on-primary);
              font-family: var(--font-family-body);
              font-size: var(--text-sm);
              font-weight: 400;
              cursor: pointer;
              transition: all 150ms ease-in-out;
              white-space: nowrap;
            }
            
            .vibe-button-primary-negative:hover {
              background: var(--negative-color-hover);
            }
            
            .vibe-button-primary-negative:focus {
              outline: none;
              box-shadow: 0 0 0 2px rgba(216, 58, 82, 0.2);
            }
            
            .vibe-button-primary-negative:active {
              background: var(--negative-color-hover);
              transform: scale(0.98);
            }
            
            .vibe-button-primary-negative:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
            
            .vibe-button-primary-negative svg,
            .vibe-button-secondary svg {
              width: 16px;
              height: 16px;
              flex-shrink: 0;
            }
          `}</style>
          <div 
            className="flex items-center justify-between w-full"
            style={{
              height: '48px',
              fontFamily: 'var(--font-family-body)',
            }}
          >
            {/* Left: Selection count */}
            <span 
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--vibe-text-primary)',
                fontFamily: 'var(--font-family-body)',
              }}
            >
              <strong>{selectedIds.size}</strong> Application{selectedIds.size > 1 ? 's' : ''} selected
            </span>

            {/* Right: Action buttons */}
            <div className="flex items-center" style={{ gap: 'var(--space-8)' }}>
              <button
                className="vibe-button-secondary"
                onClick={() => setSelectedIds(new Set())}
              >
                Clear selection
              </button>
              <button
                className="vibe-button-primary-negative"
                onClick={handleBulkDelete}
              >
                <Trash2 />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Card id="AllApplications-Table">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <Skeleton className="h-12 w-12" />
                  <Skeleton className="h-6 flex-1" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <EmptyState
              title="No applications found yet"
              description="Add your first one to get started tracking your job search!"
              actionLabel="New Application"
              onAction={() => toast.info("Please use the 'New Application' button in the top left or dashboard")}
              className="py-24"
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="border-b-2">
                    <TableHead className="w-12 pl-4 text-justify">
                      <Checkbox
                        checked={
                          selectedIds.size ===
                          applications.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Work Type</TableHead>
                    <TableHead className="text-center">
                      Priority
                    </TableHead>
                    <TableHead className="text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TooltipProvider>
                    {applications
                      .filter(app => !deletedIds.has(app.id.toString()))
                      .map((app) => (
                      <TableRow
                        key={app.id}
                        className="hover:bg-muted/50 transition-colors border-border cursor-pointer"
                        data-job-id={app.id.toString()}
                        data-role="job-row"
                      >
                        <TableCell className="py-4 text-center">
                          <Checkbox
                            checked={selectedIds.has(app.id)}
                            onCheckedChange={() =>
                              handleSelectOne(app.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-primary">
                                {app.company[0]}
                              </span>
                            </div>
                            <span>{app.company}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <div className="font-normal">
                              {app.position}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {app.role}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <TooltipPrimitive.Root>
                            <TooltipTrigger asChild>
                              <StatusLabel
                                variant={app.status as any}
                                className="cursor-help"
                              >
                                {app.status === "applied" ? "Applied" : app.status === "interview" ? "Interview" : app.status === "follow-up" ? "Follow-up" : app.status === "rejected" ? "Rejected" : app.status === "offer" ? "Offer" : app.status}
                              </StatusLabel>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Status: {app.status === "applied" ? "Applied" : app.status === "interview" ? "Interview" : app.status === "follow-up" ? "Follow-up" : app.status === "rejected" ? "Rejected" : app.status === "offer" ? "Offer" : app.status}</p>
                            </TooltipContent>
                          </TooltipPrimitive.Root>
                        </TableCell>
                        <TableCell className="py-4 text-muted-foreground">
                          <div>
                            <div className="text-foreground">
                              {formatDateToIsraeli(
                                app.appliedDate,
                              )}
                            </div>
                            <div className="text-xs mt-0.5">
                              {app.location || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className="rounded-lg"
                          >
                            {app.workType ? WORK_TYPE_LABEL[app.workType] : "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <TooltipPrimitive.Root>
                            <TooltipTrigger asChild>
                              <Chips
                                variant={
                                  app.priority?.toLowerCase() as any || "medium"
                                }
                                className="cursor-help"
                              >
                                {app.priority || "Medium"}
                              </Chips>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Priority: {app.priority || "Medium"}</p>
                            </TooltipContent>
                          </TooltipPrimitive.Root>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TooltipPrimitive.Root>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleEdit(app.company)
                                  }
                                  className="hover:bg-accent/10"
                                >
                                  <Edit className="w-5 h-5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit application</p>
                              </TooltipContent>
                            </TooltipPrimitive.Root>

                            <TooltipPrimitive.Root>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-accent/10"
                                >
                                  <Info className="w-5 h-5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View details</p>
                              </TooltipContent>
                            </TooltipPrimitive.Root>

                            <TooltipPrimitive.Root>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDelete(app.company)
                                  }
                                  className="hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete record</p>
                              </TooltipContent>
                            </TooltipPrimitive.Root>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TooltipProvider>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}