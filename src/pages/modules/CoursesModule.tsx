import { useState } from "react";
import { useData } from "@/lib/dataContext";
import { Course } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";

const fields: FieldConfig[] = [
  { key: "name", label: "Course Name", placeholder: "e.g. Data Structures" },
  { key: "code", label: "Course Code", placeholder: "e.g. CS201" },
  { key: "professor", label: "Professor", placeholder: "e.g. Dr. Kim" },
  { key: "schedule", label: "Schedule", placeholder: "e.g. MWF 9:00 AM" },
];

const CoursesModule = () => {
  const { courses, setCourses } = useData();
  const [selected, setSelected] = useState<Course | null>(null);

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setCourses((cs) => cs.map((c) => (c.id === updated.id ? updated : c)));
  };

  const add = () => {
    const c: Course = { id: `c${Date.now()}`, name: "", code: "", professor: "", schedule: "", color: "bg-secondary" };
    setCourses((cs) => [c, ...cs]);
    setSelected(c);
  };

  const remove = (id: string) => {
    setCourses((cs) => cs.filter((c) => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Courses</h2>
        <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Course
        </Button>
      </div>
      <div className="grid gap-3">
        {courses.map((c) => (
          <Card
            key={c.id}
            className="p-4 cursor-pointer hover:ring-1 hover:ring-ring/20 transition-all group"
            onClick={() => setSelected(c)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{c.name || "Untitled Course"}</p>
                <p className="text-xs text-muted-foreground">{c.code} · {c.professor} · {c.schedule}</p>
              </div>
              <Button
                variant="ghost" size="icon"
                onClick={(e) => { e.stopPropagation(); remove(c.id); }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <ItemModal open={!!selected} onClose={() => setSelected(null)} title="Course Details" item={selected} fields={fields} onUpdate={update} />
    </div>
  );
};

export default CoursesModule;
