import { useState } from "react";
import { demoTasks, demoCourses, Task } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import DynamicSelect from "@/components/DynamicSelect";

const priorities = ["low", "medium", "high"];
const types = ["Assignment", "Homework", "Paper", "Lab", "Study", "Review", "Other"];

const EditableTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(demoTasks);

  const update = (id: string, field: keyof Task, value: string | boolean) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const add = () => {
    setTasks((ts) => [...ts, { id: `t${Date.now()}`, title: "", courseId: "c1", dueDate: "", completed: false, priority: "medium", type: "Assignment" }]);
  };

  const remove = (id: string) => setTasks((ts) => ts.filter((t) => t.id !== id));
  const getCourse = (id: string) => demoCourses.find((c) => c.id === id);

  return (
    <div className="space-y-3">
      {tasks.map((t) => (
        <Card key={t.id} className={`p-4 space-y-2 ${t.completed ? "opacity-60" : ""}`}>
          <div className="flex items-center gap-2">
            <Checkbox checked={t.completed} onCheckedChange={(v) => update(t.id, "completed", !!v)} />
            <Input placeholder="Task title" value={t.title} onChange={(e) => update(t.id, "title", e.target.value)} className={`font-medium ${t.completed ? "line-through" : ""}`} />
            <Badge variant={t.priority === "high" ? "destructive" : "secondary"} className="text-[10px] shrink-0">{t.priority}</Badge>
            <Button variant="ghost" size="icon" onClick={() => remove(t.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input type="date" value={t.dueDate} onChange={(e) => update(t.id, "dueDate", e.target.value)} />
            <DynamicSelect options={priorities} value={t.priority} onChange={(v) => update(t.id, "priority", v)} placeholder="Priority" />
            <DynamicSelect options={types} value={t.type} onChange={(v) => update(t.id, "type", v)} placeholder="Type" />
          </div>
          <p className="text-xs text-muted-foreground">{getCourse(t.courseId)?.code}</p>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full">
        <Plus className="h-3.5 w-3.5" /> Add Task
      </Button>
    </div>
  );
};

export default EditableTasks;
