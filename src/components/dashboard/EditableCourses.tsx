import { useState } from "react";
import { demoCourses, Course } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const EditableCourses = () => {
  const [courses, setCourses] = useState<Course[]>(demoCourses);

  const update = (id: string, field: keyof Course, value: string) => {
    setCourses((cs) => cs.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const add = () => {
    setCourses((cs) => [...cs, { id: `c${Date.now()}`, name: "", code: "", professor: "", schedule: "", color: "bg-secondary" }]);
  };

  const remove = (id: string) => setCourses((cs) => cs.filter((c) => c.id !== id));

  return (
    <div className="space-y-3">
      {courses.map((c) => (
        <Card key={c.id} className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Course name" value={c.name} onChange={(e) => update(c.id, "name", e.target.value)} className="font-medium" />
            <Button variant="ghost" size="icon" onClick={() => remove(c.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Code" value={c.code} onChange={(e) => update(c.id, "code", e.target.value)} />
            <Input placeholder="Professor" value={c.professor} onChange={(e) => update(c.id, "professor", e.target.value)} />
            <Input placeholder="Schedule" value={c.schedule} onChange={(e) => update(c.id, "schedule", e.target.value)} />
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full">
        <Plus className="h-3.5 w-3.5" /> Add Course
      </Button>
    </div>
  );
};

export default EditableCourses;
