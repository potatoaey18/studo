import {
  BarChart3, Clock, BookOpen, ListChecks, GraduationCap, Users,
  CalendarDays, DollarSign, FolderOpen, Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export type SectionId =
  | "dashboard"
  | "study-tracker"
  | "courses"
  | "requirements"
  | "exams"
  | "group-projects"
  | "class-schedule"
  | "expenses"
  | "resources"
  | "settings";

const items: { id: SectionId; title: string; icon: React.ElementType }[] = [
  { id: "dashboard", title: "Dashboard", icon: BarChart3 },
  { id: "study-tracker", title: "Study Tracker", icon: Clock },
  { id: "courses", title: "Courses", icon: BookOpen },
  { id: "requirements", title: "Requirements", icon: ListChecks },
  { id: "exams", title: "Exams", icon: GraduationCap },
  { id: "group-projects", title: "Group Projects", icon: Users },
  { id: "class-schedule", title: "Class Schedule", icon: CalendarDays },
  { id: "expenses", title: "Expense Tracker", icon: DollarSign },
  { id: "resources", title: "Resources", icon: FolderOpen },
  { id: "settings", title: "Settings", icon: Settings },
];

interface AppSidebarProps {
  activeSection: SectionId;
  onSectionClick: (id: SectionId) => void;
}

export function AppSidebar({ activeSection, onSectionClick }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-display tracking-tight">
            {!collapsed && "Studo"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionClick(item.id)}
                    className={`cursor-pointer transition-colors ${
                      activeSection === item.id
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
