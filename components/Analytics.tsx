import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Briefcase, TrendingUp, XCircle, AlertCircle, Calendar, Info } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from './ui/button';
import { EmptyState } from './EmptyState';

export function Analytics() {
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState('30-days');
  const [isEmpty, setIsEmpty] = useState(false);

  const kpiData = [
    { 
      label: 'Total Applications', 
      value: '48', 
      icon: Briefcase, 
      iconColor: '--icon-color-blue',
      tooltip: 'The total number of job applications you have submitted'
    },
    { 
      label: 'Active', 
      value: '23', 
      icon: TrendingUp, 
      iconColor: '--icon-color-green',
      tooltip: 'Applications currently in progress or awaiting response'
    },
    { 
      label: 'Rejected', 
      value: '12', 
      icon: XCircle, 
      iconColor: '--icon-color-red',
      tooltip: 'Applications that were not successful'
    },
    { 
      label: 'Follow-ups Due', 
      value: '8', 
      icon: AlertCircle, 
      iconColor: '--icon-color-orange',
      tooltip: 'Applications requiring follow-up action from you'
    },
    { 
      label: 'This Week', 
      value: '5', 
      icon: Calendar, 
      iconColor: '--icon-color-purple',
      tooltip: 'Number of applications submitted in the current week'
    },
  ];

  const statusData = [
    { name: 'Applied', value: 18, color: '#0073EA' },
    { name: 'Interview', value: 12, color: '#0073EA' },
    { name: 'Follow-up', value: 6, color: '#FFC107' },
    { name: 'Rejected', value: 12, color: '#DC3545' },
  ];

  const workTypeData = [
    { name: 'Remote', value: 22, color: '#9333EA' },
    { name: 'Hybrid', value: 15, color: '#06B6D4' },
    { name: 'On-site', value: 11, color: '#14B8A6' },
  ];

  const sourceData = [
    { name: 'LinkedIn', value: 20, color: '#1E3A8A' },
    { name: 'Company Site', value: 16, color: '#FB923C' },
    { name: 'Referral', value: 8, color: '#06B6D4' },
    { name: 'Indeed', value: 4, color: '#6B7280' },
  ];

  const roleData = [
    { name: 'Product Design', value: 18, color: '#0073EA' },
    { name: 'UX Design', value: 15, color: '#9333EA' },
    { name: 'UI Design', value: 9, color: '#06B6D4' },
    { name: 'Design Leadership', value: 6, color: '#14B8A6' },
  ];

  const trendData = [
    { month: 'Jun', applications: 5 },
    { month: 'Jul', applications: 8 },
    { month: 'Aug', applications: 12 },
    { month: 'Sep', applications: 15 },
    { month: 'Oct', applications: 8 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = statusData.length > 0 
        ? ((data.value / statusData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)
        : 0;
      
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name || label}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} applications ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} applications
          </p>
        </div>
      );
    }
    return null;
  };

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]" id="Analytics-EmptyState">
        <EmptyState
          title="No analytics available yet"
          description="Start tracking applications to see insights and trends."
          actionLabel="New Application"
          onAction={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1440px] mx-auto w-full" id="Analytics-Main">
      {/* Header with Period Filter */}
      <div className="flex items-center justify-between">
        <h1>Analytics</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7-days">Last 7 days</SelectItem>
            <SelectItem value="30-days">Last 30 days</SelectItem>
            <SelectItem value="90-days">Last 90 days</SelectItem>
            <SelectItem value="all-time">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <TooltipProvider>
        <div className="grid grid-cols-5 gap-6" id="Analytics-KPIs">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
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
          ) : (
            kpiData.map((kpi, index) => {
              const Icon = kpi.icon;
              
              return (
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
            })
          )}
        </div>
      </TooltipProvider>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Applications by Status - Pie Chart */}
        <Card className="rounded-lg shadow-sm" id="Analytics-ByStatus">
          <CardHeader className="px-6 py-5">
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="bg-[var(--vibe-surface-subtle)] rounded-lg p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                        stroke="var(--card)"
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Based on data from the last 90 days
            </p>
          </CardContent>
        </Card>

        {/* Applications by Work Type - Bar Chart */}
        <Card className="rounded-lg shadow-sm" id="Analytics-ByWorkType">
          <CardHeader className="px-6 py-5">
            <CardTitle>Applications by Work Type</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="bg-[var(--vibe-surface-subtle)] rounded-lg p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <RechartsTooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {workTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 justify-center">
              {workTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Remote positions lead by 47% compared to other types
            </p>
          </CardContent>
        </Card>

        {/* Applications by Source - Bar Chart */}
        <Card className="rounded-lg shadow-sm" id="Analytics-BySource">
          <CardHeader className="px-6 py-5">
            <CardTitle>Applications by Source</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="bg-[var(--vibe-surface-subtle)] rounded-lg p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <RechartsTooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {sourceData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              LinkedIn is the most effective channel for applications
            </p>
          </CardContent>
        </Card>

        {/* Applications by Role - Bar Chart */}
        <Card className="rounded-lg shadow-sm" id="Analytics-ByRole">
          <CardHeader className="px-6 py-5">
            <CardTitle>Applications by Role</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="bg-[var(--vibe-surface-subtle)] rounded-lg p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    tick={{ fill: 'var(--muted-foreground)' }}
                  />
                  <RechartsTooltip content={<CustomBarTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {roleData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Product Design roles account for 37.5% of applications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Trend - Line Chart (Full Width) */}
      <Card className="rounded-lg shadow-sm" id="Analytics-Trend">
        <CardHeader className="px-6 py-5">
          <CardTitle>Application Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="bg-[var(--vibe-surface-subtle)] rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--muted-foreground)"
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  tick={{ fill: 'var(--muted-foreground)' }}
                />
                <RechartsTooltip content={<CustomBarTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#0073EA" 
                  strokeWidth={3}
                  dot={{ fill: '#0073EA', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                  className="hover:opacity-80 transition-opacity"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Application activity peaked in September — showing a 25% increase from August
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
