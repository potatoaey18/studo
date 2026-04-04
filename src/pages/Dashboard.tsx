import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationCenter from "@/components/NotificationCenter";
import { AppSidebar, SectionId } from "@/components/AppSidebar";
import SectionModal from "@/components/dashboard/SectionModal";
import AnalyticsModal from "@/components/dashboard/AnalyticsModal";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import ExamCountdown from "@/components/dashboard/ExamCountdown";
import TaskList from "@/components/dashboard/TaskList";
import { demoTasks, demoStudySessions, demoExpenses } from "@/lib/demoData";

const Dashboard = ({ onSignOut }: { onSignOut: () => void }) => {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [analyticsType, setAnalyticsType] = useState<"study" | "expense" | "tasks" | null>(null);

  const completedTasks = demoTasks.filter((t) => t.completed).length;
  const totalStudyHours = demoStudySessions.reduce((s, ss) => s + ss.hours, 0);
  const totalExpenses = demoExpenses.reduce((s, e) => s + e.amount, 0);

  const handleSectionClick = (id: SectionId) => {
    if (id === "overview") {
      setActiveSection(null);
      return;
    }
    if (id === "kanban") {
      setActiveSection("kanban");
      return;
    }
    setActiveSection(id);
  };

  const modalSection = activeSection && activeSection !== "overview" && activeSection !== "kanban"
    ? activeSection as Exclude<SectionId, "overview" | "kanban">
    : null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeSection={activeSection} onSectionClick={handleSectionClick} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="font-display text-lg font-bold tracking-tight">Studo</h1>
              </div>
              <div className="flex items-center gap-1">
                <NotificationCenter />
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={onSignOut} className="rounded-full">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
            {activeSection === "kanban" ? (
              <KanbanBoard />
            ) : (
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
            )}
          </main>
        </div>
      </div>

      {/* Editable section modals */}
      <SectionModal section={modalSection} onClose={() => setActiveSection(null)} />

      {/* Analytics modal */}
      <AnalyticsModal open={!!analyticsType} onClose={() => setAnalyticsType(null)} type={analyticsType || "study"} />
    </SidebarProvider>
  );
};

export default Dashboard;
