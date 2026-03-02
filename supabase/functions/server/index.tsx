import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client with service role
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9b47aab4/health", (c) => {
  return c.json({ status: "ok" });
});

// Database initialization endpoint
app.post("/make-server-9b47aab4/init-db", async (c) => {
  try {
    console.log("Initializing database schema...");
    
    // Check if we can access the database
    const { data, error } = await supabase.from("kv_store_9b47aab4").select("*").limit(1);
    
    if (error) {
      console.error("Database access error:", error);
      return c.json({ 
        status: "error", 
        message: "Database access error",
        error: error.message 
      }, 500);
    }
    
    console.log("Database is accessible");
    return c.json({ status: "ok", message: "Database is ready" });
  } catch (err) {
    console.error("Database initialization error:", err);
    return c.json({ 
      status: "error", 
      message: "Failed to initialize database",
      error: err instanceof Error ? err.message : String(err)
    }, 500);
  }
});

// Auth signup endpoint
app.post("/make-server-9b47aab4/signup", async (c) => {
  try {
    const { email, password, username } = await c.req.json();
    
    console.log("Creating user:", email);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username: username || email.split('@')[0] },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });
    
    if (error) {
      // Handle specific error cases to avoid polluting logs with expected errors
      if (error.code === 'email_exists' || error.message?.includes('already been registered')) {
        console.log("Signup attempt for existing email:", email);
        return c.json({ 
          error: {
            code: 'email_exists',
            message: 'User already exists',
          },
          message: 'User already exists',
          code: 'email_exists' 
        }, 400);
      }

      console.error("Signup error:", error);
      // Return the full error object structure so frontend can handle codes like 'email_exists'
      return c.json({ 
        error: error, // Send full object
        message: error.message,
        code: error.code 
      }, 400);
    }
    
    console.log("User created successfully:", data.user?.id);
    return c.json({ user: data.user });
  } catch (err) {
    console.error("Signup exception:", err);
    return c.json({ 
      error: err instanceof Error ? err.message : "Failed to create user" 
    }, 500);
  }
});

// Get all jobs for a user
app.get("/make-server-9b47aab4/jobs", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.id;
    const prefix = `job:${userId}:`;
    
    const jobs = await kv.getByPrefix(prefix);
    
    return c.json({ jobs: jobs || [] });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return c.json({ 
      error: err instanceof Error ? err.message : "Failed to fetch jobs" 
    }, 500);
  }
});

// Get job statistics for a user
app.get("/make-server-9b47aab4/jobs/stats", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.id;
    const prefix = `job:${userId}:`;
    
    const jobs = await kv.getByPrefix(prefix);
    
    // Calculate statistics
    const total = jobs.length;
    
    // Active statuses: applied, interview, follow-up
    const active = jobs.filter((job: any) => 
      ['applied', 'interview', 'follow-up'].includes(job.status)
    ).length;
    
    // Rejected
    const rejected = jobs.filter((job: any) => job.status === 'rejected').length;
    
    // This week (applications created this week)
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay() || 7;
    if (day !== 1) startOfWeek.setDate(startOfWeek.getDate() - (day - 1));
    
    const thisWeek = jobs.filter((job: any) => {
      const appliedDate = new Date(job.applied_date || job.created_at);
      return appliedDate >= startOfWeek;
    }).length;
    
    // Get recent applications (last 3)
    const sortedJobs = [...jobs].sort((a: any, b: any) => {
      const dateA = new Date(a.applied_date || a.created_at);
      const dateB = new Date(b.applied_date || b.created_at);
      return dateB.getTime() - dateA.getTime();
    });
    
    const recent = sortedJobs.slice(0, 3);
    
    return c.json({
      total,
      active,
      rejected,
      thisWeek,
      recent,
    });
  } catch (err) {
    console.error("Error fetching job stats:", err);
    return c.json({ 
      error: err instanceof Error ? err.message : "Failed to fetch statistics" 
    }, 500);
  }
});

// Create a new job
app.post("/make-server-9b47aab4/jobs", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.id;
    const jobData = await c.req.json();
    
    // Generate a unique ID for the job
    const jobId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const key = `job:${userId}:${jobId}`;
    
    const job = {
      id: jobId,
      user_id: userId,
      created_at: new Date().toISOString(),
      ...jobData,
    };
    
    await kv.set(key, job);
    
    return c.json({ job });
  } catch (err) {
    console.error("Error creating job:", err);
    return c.json({ 
      error: err instanceof Error ? err.message : "Failed to create job" 
    }, 500);
  }
});

// Update a job
app.put("/make-server-9b47aab4/jobs/:jobId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.id;
    const jobId = c.req.param('jobId');
    const updates = await c.req.json();
    
    const key = `job:${userId}:${jobId}`;
    
    // Get existing job
    const existingJob = await kv.get(key);
    
    if (!existingJob) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    // Merge updates
    const updatedJob = {
      ...existingJob,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    await kv.set(key, updatedJob);
    
    return c.json({ job: updatedJob });
  } catch (err) {
    console.error("Error updating job:", err);
    return c.json({ 
      error: err instanceof Error ? err.message : "Failed to update job" 
    }, 500);
  }
});

// Delete a job
app.delete("/make-server-9b47aab4/jobs/:jobId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.id;
    const jobId = c.req.param('jobId');
    const key = `job:${userId}:${jobId}`;
    
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (err) {
    console.error("Error deleting job:", err);
    return c.json({ 
      error: err instanceof Error ? err.message : "Failed to delete job" 
    }, 500);
  }
});

// Delete multiple jobs
app.post("/make-server-9b47aab4/jobs/delete-batch", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = user.id;
    const { jobIds } = await c.req.json();
    
    if (!Array.isArray(jobIds)) {
      return c.json({ error: 'Invalid job IDs' }, 400);
    }
    
    // Delete all jobs
    const keys = jobIds.map(jobId => `job:${userId}:${jobId}`);
    await kv.mdel(keys);
    
    return c.json({ success: true, deleted: jobIds.length });
  } catch (err) {
    console.error("Error deleting jobs:", err);
    return c.json({ 
      error: err instanceof Error ? err.message : "Failed to delete jobs" 
    }, 500);
  }
});

Deno.serve(app.fetch);