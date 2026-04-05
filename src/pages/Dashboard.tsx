import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationCenter from "@/components/NotificationCenter";
import { AppSidebar, SectionId } from "@/components/AppSidebar";
import { DataProvider } from "@/lib/dataContext";
import DashboardOverview from "./modules/DashboardOverview";
import StudyTrackerModule from "./modules/StudyTrackerModule";
import CoursesModule from "./modules/CoursesModule";
import RequirementsModule from "./modules/RequirementsModule";
import ExamsModule from "./modules/ExamsModule";
import GroupProjectsModule from "./modules/GroupProjectsModule";
import ClassScheduleModule from "./modules/ClassScheduleModule";
import ExpensesModule from "./modules/ExpensesModule";
import ResourcesModule from "./modules/ResourcesModule";
import SettingsModule from "./modules/SettingsModule";

const Dashboard = ({ onSignOut }: { onSignOut: () => void }) => {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");

  const renderModule = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardOverview />;
      case "study-tracker": return <StudyTrackerModule />;
      case "courses": return <CoursesModule />;
      case "requirements": return <RequirementsModule />;
      case "exams": return <ExamsModule />;
      case "group-projects": return <GroupProjectsModule />;
      case "class-schedule": return <ClassScheduleModule />;
      case "expenses": return <ExpensesModule />;
      case "research": return <ResearchModule />;
      case "resources": return <ResourcesModule />;
      case "settings": return <SettingsModule />;
    }
  };

  return (
    <DataProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar activeSection={activeSection} onSectionClick={setActiveSection} />

          <div className="flex-1 flex flex-col min-w-0">
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
              {renderModule()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </DataProvider>
  );
};

export default Dashboard;
