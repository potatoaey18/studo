import { useState } from "react";
import { demoExams, Exam } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const EditableExams = () => {
  const [exams, setExams] = useState<Exam[]>(demoExams);

  const update = (id: string, field: keyof Exam, value: string) => {
    setExams((es) => es.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const add = () => {
    setExams((es) => [...es, { id: `e${Date.now()}`, subject: "", date: "", location: "", notes: "" }]);
  };

  const remove = (id: string) => setExams((es) => es.filter((e) => e.id !== id));

  return (
    <div className="space-y-3">
      {exams.map((e) => (
        <Card key={e.id} className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Subject" value={e.subject} onChange={(ev) => update(e.id, "subject", ev.target.value)} className="font-medium" />
            <Button variant="ghost" size="icon" onClick={() => remove(e.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" value={e.date} onChange={(ev) => update(e.id, "date", ev.target.value)} />
            <Input placeholder="Location" value={e.location} onChange={(ev) => update(e.id, "location", ev.target.value)} />
          </div>
          <Textarea placeholder="Notes" value={e.notes} onChange={(ev) => update(e.id, "notes", ev.target.value)} rows={2} />
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full">
        <Plus className="h-3.5 w-3.5" /> Add Exam
      </Button>
    </div>
  );
};

export default EditableExams;
