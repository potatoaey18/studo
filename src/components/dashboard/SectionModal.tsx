import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SectionId } from "@/components/AppSidebar";
import EditableCourses from "./EditableCourses";
import EditableTasks from "./EditableTasks";
import EditableExams from "./EditableExams";
import EditableStudySessions from "./EditableStudySessions";
import EditableExpenses from "./EditableExpenses";
import EditableResearch from "./EditableResearch";
import EditableResources from "./EditableResources";

const sectionMeta: Record<Exclude<SectionId, "overview" | "kanban">, { title: string; desc: string }> = {
  courses: { title: "Courses", desc: "Manage your enrolled courses" },
  tasks: { title: "Tasks", desc: "Track assignments and deadlines" },
  exams: { title: "Exams", desc: "Upcoming exam schedule" },
  study: { title: "Study Sessions", desc: "Log and review study time" },
  expenses: { title: "Expenses", desc: "Track academic spending" },
  research: { title: "Research Sources", desc: "Manage references and sources" },
  resources: { title: "Resources", desc: "Course materials and links" },
};

interface SectionModalProps {
  section: Exclude<SectionId, "overview" | "kanban"> | null;
  onClose: () => void;
}

const SectionModal = ({ section, onClose }: SectionModalProps) => {
  if (!section) return null;
  const meta = sectionMeta[section];

  const renderContent = () => {
    switch (section) {
      case "courses": return <EditableCourses />;
      case "tasks": return <EditableTasks />;
      case "exams": return <EditableExams />;
      case "study": return <EditableStudySessions />;
      case "expenses": return <EditableExpenses />;
      case "research": return <EditableResearch />;
      case "resources": return <EditableResources />;
    }
  };

  return (
    <Dialog open={!!section} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-display text-lg">{meta.title}</DialogTitle>
          <DialogDescription>{meta.desc}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="px-6 pb-6 max-h-[65vh]">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SectionModal;
