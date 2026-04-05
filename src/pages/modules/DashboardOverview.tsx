import { useState } from "react";
import { useData } from "@/lib/dataContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnalyticsModal from "@/components/dashboard/AnalyticsModal";

const DashboardOverview = () => {
  const { sessions, tasks, expenses, exams, getCourse } = useData();
  const [analyticsType, setAnalyticsType] = useState<"study" | "expense" | "tasks" | null>(null);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalStudyHours = sessions.reduce((s, ss) => s + ss.hours, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const upcomingTasks = [...tasks]
    .filter((t) => !t.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  const upcomingExams = [...exams]
    .filter((e) => e.status !== "done")
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const now = new Date();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setAnalyticsType("study")}>
          <p className="text-xs text-muted-foreground">Study Hours</p>
          <p className="font-display text-2xl font-bold mt-1">{totalStudyHours.toFixed(1)}h</p>
          <p className="text-xs text-muted-foreground mt-1">Click to view breakdown →</p>
        </Card>
        <Card className="p-5 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setAnalyticsType("tasks")}>
          <p className="text-xs text-muted-foreground">Tasks Completed</p>
          <p className="font-display text-2xl font-bold mt-1">{completedTasks}/{tasks.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Click to view chart →</p>
        </Card>
        <Card className="p-5 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setAnalyticsType("expense")}>
          <p className="text-xs text-muted-foreground">Total Expenses</p>
          <p className="font-display text-2xl font-bold mt-1">PHP{totalExpenses.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground mt-1">Click to view distribution →</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-display font-semibold text-sm mb-3">Upcoming Tasks</h3>
          <div className="space-y-2">
            {upcomingTasks.map((t) => (
              <Card key={t.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{getCourse(t.courseId)?.code} · {t.dueDate}</p>
                </div>
                <Badge variant={t.priority === "high" ? "destructive" : "secondary"} className="text-[10px]">{t.priority}</Badge>
              </Card>
            ))}
            {upcomingTasks.length === 0 && <p className="text-xs text-muted-foreground italic">No upcoming tasks</p>}
          </div>
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm mb-3">Exam Countdown</h3>
          <div className="space-y-2">
            {upcomingExams.map((e) => {
              const examDate = new Date(e.date);
              const diff = Math.max(0, Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
              return (
                <Card key={e.id} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{e.subject}</p>
                    <p className="text-xs text-muted-foreground">{e.location} · {e.date}</p>
                  </div>
                  <span className="font-display text-lg font-bold">{diff}d</span>
                </Card>
              );
            })}
            {upcomingExams.length === 0 && <p className="text-xs text-muted-foreground italic">No upcoming exams</p>}
          </div>
        </div>
      </div>

      <AnalyticsModal open={!!analyticsType} onClose={() => setAnalyticsType(null)} type={analyticsType || "study"} />
    </div>
  );
};

export default DashboardOverview;
