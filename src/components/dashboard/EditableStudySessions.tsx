import { useState } from "react";
import { demoStudySessions, demoCourses, StudySession } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import DynamicSelect from "@/components/DynamicSelect";

const EditableStudySessions = () => {
  const [sessions, setSessions] = useState<StudySession[]>(demoStudySessions);

  const update = (id: string, field: keyof StudySession, value: string | number) => {
    setSessions((ss) => ss.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const add = () => {
    setSessions((ss) => [...ss, { id: `s${Date.now()}`, courseId: "c1", date: "", hours: 0, topic: "" }]);
  };

  const remove = (id: string) => setSessions((ss) => ss.filter((s) => s.id !== id));

  return (
    <div className="space-y-3">
      {sessions.map((s) => (
        <Card key={s.id} className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Topic" value={s.topic} onChange={(e) => update(s.id, "topic", e.target.value)} className="font-medium" />
            <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <DynamicSelect
              options={demoCourses.map((c) => c.code)}
              value={demoCourses.find((c) => c.id === s.courseId)?.code || ""}
              onChange={(v) => {
                const course = demoCourses.find((c) => c.code === v);
                if (course) update(s.id, "courseId", course.id);
              }}
              placeholder="Course"
            />
            <Input type="date" value={s.date} onChange={(e) => update(s.id, "date", e.target.value)} />
            <Input type="number" placeholder="Hours" value={s.hours} onChange={(e) => update(s.id, "hours", parseFloat(e.target.value) || 0)} />
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full">
        <Plus className="h-3.5 w-3.5" /> Add Session
      </Button>
    </div>
  );
};

export default EditableStudySessions;
