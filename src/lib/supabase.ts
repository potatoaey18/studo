import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://pnqakgdfgshfuzxviooe.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucWFrZ2RmZ3NoZnV6eHZpb29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDYzMjEsImV4cCI6MjA5MDkyMjMyMX0.Te85UOUb5VmcpE3U2Ub-OuVmtUefWZ6kb9b3WB54XOk"
);