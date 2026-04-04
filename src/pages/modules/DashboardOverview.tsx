import { useState } from "react";
import { demoTasks, demoStudySessions, demoExpenses } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import TaskList from "@/components/dashboard/TaskList";
import ExamCountdown from "@/components/dashboard/ExamCountdown";
import AnalyticsModal from "@/components/dashboard/AnalyticsModal";

const DashboardOverview = () => {
  const [analyticsType, setAnalyticsType] = useState<"study" | "expense" | "tasks" | null>(null);

  const completedTasks = demoTasks.filter((t) => t.completed).length;
  const totalStudyHours = demoStudySessions.reduce((s, ss) => s + ss.hours, 0);
  const totalExpenses = demoExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          className="p-5 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => setAnalyticsType("study")}
        >
          <p className="text-xs text-muted-foreground">Study Hours</p>
          <p className="font-display text-2xl font-bold mt-1">{totalStudyHours}h</p>
          <p className="text-xs text-muted-foreground mt-1">Click to view breakdown →</p>
        </Card>
        <Card
          className="p-5 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => setAnalyticsType("tasks")}
        >
          <p className="text-xs text-muted-foreground">Tasks Completed</p>
          <p className="font-display text-2xl font-bold mt-1">{completedTasks}/{demoTasks.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Click to view chart →</p>
        </Card>
        <Card
          className="p-5 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => setAnalyticsType("expense")}
        >
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="font-display text-2xl font-bold mt-1">${totalExpenses.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground mt-1">Click to view distribution →</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-display font-semibold text-sm mb-3">Upcoming Tasks</h3>
          <TaskList />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm mb-3">Exam Countdown</h3>
          <ExamCountdown />
        </div>
      </div>

      <AnalyticsModal open={!!analyticsType} onClose={() => setAnalyticsType(null)} type={analyticsType || "study"} />
    </div>
  );
};

export default DashboardOverview;
