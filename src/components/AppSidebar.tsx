import { BookOpen, CheckSquare, Clock, KanbanSquare, DollarSign, Search, FolderOpen, GraduationCap, BarChart3 } from "lucide-react";
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

export type SectionId = "overview" | "courses" | "tasks" | "exams" | "study" | "kanban" | "expenses" | "research" | "resources";

const items: { id: SectionId; title: string; icon: React.ElementType }[] = [
  { id: "overview", title: "Overview", icon: BarChart3 },
  { id: "courses", title: "Courses", icon: BookOpen },
  { id: "tasks", title: "Tasks", icon: CheckSquare },
  { id: "exams", title: "Exams", icon: GraduationCap },
  { id: "study", title: "Study Sessions", icon: Clock },
  { id: "kanban", title: "Kanban Board", icon: KanbanSquare },
  { id: "expenses", title: "Expenses", icon: DollarSign },
  { id: "research", title: "Research", icon: Search },
  { id: "resources", title: "Resources", icon: FolderOpen },
];

interface AppSidebarProps {
  activeSection: SectionId | null;
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
            {!collapsed && "Modules"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionClick(item.id)}
                    className={`cursor-pointer transition-colors ${
                      activeSection === item.id ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted/50"
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
