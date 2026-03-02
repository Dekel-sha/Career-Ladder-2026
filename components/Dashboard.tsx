import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";
import { supabase } from "../src/lib/supabase";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Briefcase,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Info,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { StatusLabel } from "./ui/status-label";
import { EmptyState } from "./EmptyState";

import { isNetworkError } from "../src/lib/supabaseHelper";

interface DashboardProps {
  onNewApplication: () => void;
}

export function Dashboard({ onNewApplication }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [thisWeek, setThisWeek] = useState(0);
  const [recent, setRecent] = useState<any[]>([]);
  const [checkedTasks, setCheckedTasks] = useState<
    Record<number, boolean>
  >({});
  const [isOffline, setIsOffline] = useState(false);

  // Helper function to fetch with retry logic for auth errors
  const fetchWithRetry = async (url: string, options: RequestInit = {}) => {
    // Get current session
    const { data: sessionData } = await supabase.auth.getSession();
    let token = sessionData?.session?.access_token;

    if (!token) {
      throw new Error("No session available");
    }

    // First attempt
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });

    // If unauthorized, try to refresh session and retry
    if (response.status === 401) {
      console.log("Token expired, refreshing session...");
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError && refreshData.session) {
        token = refreshData.session.access_token;
        // Retry with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // If refresh fails with "Invalid Refresh Token", explicitly sign out to clear state
        if (refreshError && (
             refreshError.message.includes("Invalid Refresh Token") || 
             refreshError.message.includes("Refresh Token Not Found")
           )) {
          console.warn("Session invalid, signing out...", refreshError.message);
          await supabase.auth.signOut();
          // Throwing error here to stop further execution, App.tsx will handle redirect
          throw new Error("Session expired");
        }
        console.error("Failed to refresh session:", refreshError);
      }
    }

    return response;
  };

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setIsOffline(false);

      try {
        // Ensure we have a session first (even if fetchWithRetry gets it again, we want to fail early if offline)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          if (isNetworkError(sessionError)) {
            setIsOffline(true);
            setIsLoading(false);
            return;
          }
          console.error('Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }
        
        if (!sessionData?.session) {
          // Not logged in, stop here (App will redirect)
          setIsLoading(false);
          return;
        }

        // Fetch statistics from server using retry logic
        const response = await fetchWithRetry(
          `https://${projectId}.supabase.co/functions/v1/make-server-9b47aab4/jobs/stats`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          
          // Only log if it's NOT a 401, since 401s are handled or expected if session is truly dead
          if (response.status !== 401) {
            console.error('Error fetching stats:', errorData);
          }
          
          // Handle unauthorized error
          if (response.status === 401) {
            // Only show toast if we couldn't recover
            toast.error('Session expired. Please log in again.');
          } else {
            toast.error('Failed to load dashboard statistics');
          }
          
          setIsLoading(false);
          return;
        }

        const stats = await response.json();
        
        setTotal(stats.total || 0);
        setActive(stats.active || 0);
        setRejected(stats.rejected || 0);
        setThisWeek(stats.thisWeek || 0);
        setRecent(stats.recent || []);

      } catch (err) {
        if (isNetworkError(err)) {
          console.warn('Network error loading dashboard:', err);
          setIsOffline(true);
        } else {
          console.error('Unexpected error loading dashboard:', err);
          toast.error('An unexpected error occurred. Please try refreshing the page.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const kpiData = [
    {
      label: "Total Application",
      value: total.toString(),
      icon: Briefcase,
      iconColor: "--icon-color-blue",
      tooltip:
        "The total number of job applications you have submitted",
    },
    {
      label: "Active",
      value: active.toString(),
      icon: TrendingUp,
      iconColor: "--icon-color-green",
      tooltip:
        "Applications currently in progress or awaiting response",
    },
    {
      label: "Rejected",
      value: rejected.toString(),
      icon: XCircle,
      iconColor: "--icon-color-red",
      tooltip: "Applications that were not successful",
    },
    {
      label: "This Week",
      value: thisWeek.toString(),
      icon: Calendar,
      iconColor: "--icon-color-purple",
      tooltip:
        "Number of applications submitted in the current week",
    },
  ];

  // Helper function to calculate days ago
  const getDaysAgo = (dateString: string): string => {
    const appliedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - appliedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return "1 month ago";
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const todaysTasks = [
    {
      id: 1,
      text: "Follow up with Figma recruiter",
      priority: "high",
    },
    {
      id: 2,
      text: "Prepare portfolio for Google interview",
      priority: "high",
    },
    {
      id: 3,
      text: "Update resume with latest project",
      priority: "medium",
    },
  ];

  const handleTaskToggle = (taskId: number) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleNewApplication = () => {
    onNewApplication();
  };

  return (
    <TooltipProvider>
      <div className="p-8 space-y-8 max-w-[1440px] mx-auto w-full bg-[rgba(255,255,255,0)]" id="Dashboard-Main">
        {isOffline && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5" />
            <span>
              You are currently offline or unable to connect to the server. Data may not be up to date.
            </span>
          </div>
        )}
        
        {/* KPI Cards Section */}
        <div
          className="grid grid-cols-4 gap-6"
          id="Dashboard-KPIs"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    background: "var(--primary-background-color)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-unified)",
                    boxShadow: "var(--shadow-default)",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))
            : kpiData.map((kpi, index) => {
                const Icon = kpi.icon;

                return (
                  <div
                    key={index}
                    style={{
                      background:
                        "var(--primary-background-color)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-unified)",
                      boxShadow: "var(--shadow-default)",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {/* Icon and Info Row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{
                          color: `var(${kpi.iconColor})`,
                        }}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="outline-none focus:outline-none hover:opacity-70 transition-opacity"
                            style={{ cursor: "help" }}
                            aria-label="More information"
                          >
                            <Info
                              className="w-4 h-4"
                              style={{
                                color: "var(--text-secondary)",
                              }}
                            />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          {kpi.tooltip}
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Number */}
                    <div
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontWeight: "400",
                        color: "var(--text-primary)",
                        lineHeight: "1.5",
                      }}
                    >
                      {kpi.value}
                    </div>

                    {/* Title */}
                    <div
                      style={{
                        fontFamily: "Figtree, sans-serif",
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "var(--text-secondary)",
                        lineHeight: "1.5",
                      }}
                    >
                      {kpi.label}
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Applications - Takes 2 columns */}
          <Card
            className="col-span-2"
            id="Dashboard-RecentApplications"
          >
            <CardHeader className="px-6 py-5">
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-lg" />
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))
              ) : recent.length === 0 ? (
                <EmptyState
                  title="No applications yet"
                  description='Click "New Application" to get started!'
                  actionLabel="New Application"
                  onAction={handleNewApplication}
                  className="py-8"
                />
              ) : (
                recent.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-border"
                    data-job-id={app.id.toString()}
                    data-role="job-card"
                  >
                    <div className="flex items-center gap-4">
                      {/* Company Logo/Avatar */}
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-primary">
                          {app.company[0]}
                        </span>
                      </div>
                      <div>
                        <h4 className="mb-0.5">{app.position}</h4>
                        <p className="text-muted-foreground text-sm">
                          {app.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <StatusLabel
                              variant={app.status as any}
                              size="default"
                              className="mb-1 cursor-help"
                            >
                              {app.status === "applied" ? "Applied" : app.status === "interview" ? "Interview" : app.status === "follow-up" ? "Follow-up" : app.status === "rejected" ? "Rejected" : app.status === "offer" ? "Offer" : app.status}
                            </StatusLabel>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            Status: {app.status === "applied" ? "Applied" : app.status === "interview" ? "Interview" : app.status === "follow-up" ? "Follow-up" : app.status === "rejected" ? "Rejected" : app.status === "offer" ? "Offer" : app.status}
                          </TooltipContent>
                        </Tooltip>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(app.date)}
                        </p>
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {getDaysAgo(app.date)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Today's Tasks */}
          <Card
            id="Dashboard-QuickActions"
          >
            <CardHeader className="px-6 py-5">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-3">
              {/* Buttons with proper hierarchy */}
              <Button
                className="w-full"
                variant="default"
                onClick={handleNewApplication}
              >
                New Application
              </Button>
              <Button
                className="w-full"
                variant="secondary"
              >
                View All
              </Button>
              <Button
                className="w-full"
                variant="secondary"
              >
                Open Analytics
              </Button>

              {/* Today's Tasks */}
              <div
                className="pt-5 border-t border-border"
                id="Dashboard-Tasks"
              >
                <h4 className="mb-4">Today's Tasks</h4>
                <ul className="space-y-3">
                  {todaysTasks.map((task) => {
                    const isChecked = checkedTasks[task.id];
                    return (
                      <li
                        key={task.id}
                        className="flex items-start gap-3 group hover:bg-muted/30 p-2 rounded-md transition-colors cursor-pointer"
                        onClick={() =>
                          handleTaskToggle(task.id)
                        }
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() =>
                            handleTaskToggle(task.id)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              task.priority === "high"
                                ? "bg-[#DC3545]"
                                : task.priority === "medium"
                                  ? "bg-[#FFC107]"
                                  : "bg-[#BDBDBD]"
                            }`}
                          />
                          <span
                            className={`text-sm leading-relaxed ${
                              isChecked
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                            }`}
                          >
                            {task.text}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
