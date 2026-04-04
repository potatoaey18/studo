import { useState } from "react";
import { BookOpen, CheckSquare, Clock, BarChart3, DollarSign, KanbanSquare, Search, FolderOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationCenter from "@/components/NotificationCenter";
import CourseList from "@/components/dashboard/CourseList";
import TaskList from "@/components/dashboard/TaskList";
import ExamCountdown from "@/components/dashboard/ExamCountdown";
import StudySessions from "@/components/dashboard/StudySessions";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import ExpenseList from "@/components/dashboard/ExpenseList";
import ResearchList from "@/components/dashboard/ResearchList";
import ResourceList from "@/components/dashboard/ResourceList";
import AnalyticsModal from "@/components/dashboard/AnalyticsModal";
import { demoTasks, demoStudySessions, demoExpenses } from "@/lib/demoData";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "study", label: "Study", icon: Clock },
  { id: "kanban", label: "Kanban", icon: KanbanSquare },
  { id: "expenses", label: "Expenses", icon: DollarSign },
  { id: "research", label: "Research", icon: Search },
  { id: "resources", label: "Resources", icon: FolderOpen },
];

const Dashboard = ({ onSignOut }: { onSignOut: () => void }) => {
  const [analyticsType, setAnalyticsType] = useState<"study" | "expense" | "tasks" | null>(null);

  const completedTasks = demoTasks.filter((t) => t.completed).length;
  const totalStudyHours = demoStudySessions.reduce((s, ss) => s + ss.hours, 0);
  const totalExpenses = demoExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold tracking-tight">Studo</h1>
          <div className="flex items-center gap-1">
            <NotificationCenter />
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={onSignOut} className="rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="gap-1.5 text-xs">
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => setAnalyticsType("study")} className="p-5 rounded-xl border bg-card hover:bg-accent/50 transition-colors text-left">
                  <p className="text-xs text-muted-foreground">Study Hours</p>
                  <p className="font-display text-2xl font-bold mt-1">{totalStudyHours}h</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to view breakdown →</p>
                </button>
                <button onClick={() => setAnalyticsType("tasks")} className="p-5 rounded-xl border bg-card hover:bg-accent/50 transition-colors text-left">
                  <p className="text-xs text-muted-foreground">Tasks Completed</p>
                  <p className="font-display text-2xl font-bold mt-1">{completedTasks}/{demoTasks.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to view chart →</p>
                </button>
                <button onClick={() => setAnalyticsType("expense")} className="p-5 rounded-xl border bg-card hover:bg-accent/50 transition-colors text-left">
                  <p className="text-xs text-muted-foreground">Total Expenses</p>
                  <p className="font-display text-2xl font-bold mt-1">${totalExpenses.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Click to view distribution →</p>
                </button>
              </div>

              {/* Quick views */}
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
            </div>
            <AnalyticsModal open={!!analyticsType} onClose={() => setAnalyticsType(null)} type={analyticsType || "study"} />
          </TabsContent>

          <TabsContent value="courses"><CourseList /></TabsContent>
          <TabsContent value="tasks"><TaskList /></TabsContent>
          <TabsContent value="study"><StudySessions /></TabsContent>
          <TabsContent value="kanban"><KanbanBoard /></TabsContent>
          <TabsContent value="expenses"><ExpenseList /></TabsContent>
          <TabsContent value="research"><ResearchList /></TabsContent>
          <TabsContent value="resources"><ResourceList /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
