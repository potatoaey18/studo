import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useData } from "@/lib/dataContext";
import { Task } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";
import DynamicSelect from "@/components/DynamicSelect";

const columns: { id: string; label: string; filter: (t: Task) => boolean }[] = [
  { id: "todo", label: "To Do", filter: (t) => !t.completed },
  { id: "done", label: "Completed", filter: (t) => t.completed },
];

const priorities = ["low", "medium", "high"];
const types = ["Assignment", "Homework", "Paper", "Lab", "Study", "Review", "Other"];

const fields: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "Task title" },
  { key: "dueDate", label: "Due Date", type: "date" },
  { key: "priority", label: "Priority", type: "select", options: priorities },
  { key: "type", label: "Type", type: "select", options: types },
];

const RequirementsModule = () => {
  const { tasks, setTasks, courses, getCourse } = useData();
  const [selected, setSelected] = useState<Task | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const filteredTasks = courseFilter === "all" ? tasks : tasks.filter((t) => t.courseId === courseFilter);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const completed = result.destination.droppableId === "done";
    setTasks((ts) => ts.map((t) => (t.id === result.draggableId ? { ...t, completed } : t)));
  };

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
  };

  const add = () => {
    const t: Task = { id: `t${Date.now()}`, title: "", courseId: courseFilter !== "all" ? courseFilter : courses[0]?.id || "", dueDate: "", completed: false, priority: "medium", type: "Assignment" };
    setTasks((ts) => [t, ...ts]);
    setSelected(t);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Requirements</h2>
        <div className="flex items-center gap-2">
          <DynamicSelect
            options={["All Courses", ...courses.map((c) => c.code)]}
            value={courseFilter === "all" ? "All Courses" : courses.find((c) => c.id === courseFilter)?.code || "All Courses"}
            onChange={(v) => {
              if (v === "All Courses") setCourseFilter("all");
              else { const c = courses.find((c) => c.code === v); if (c) setCourseFilter(c.id); }
            }}
            placeholder="Filter"
          />
          <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Task
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(col.filter).sort((a, b) => b.id.localeCompare(a.id));
            return (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl p-3 min-h-[120px] transition-colors ${snapshot.isDraggingOver ? "bg-accent/70" : "bg-muted/30"}`}
                  >
                    <h4 className="font-display font-semibold text-xs mb-3 text-muted-foreground uppercase tracking-wider">
                      {col.label} ({colTasks.length})
                    </h4>
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-2 cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-ring/20 transition-shadow ${task.completed ? "opacity-60" : ""}`}
                            onClick={() => setSelected(task)}
                          >
                            <p className={`text-sm font-medium ${task.completed ? "line-through" : ""}`}>{task.title || "Untitled"}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] text-muted-foreground">{getCourse(task.courseId)?.code} · {task.dueDate}</span>
                              <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-[10px]">{task.priority}</Badge>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <ItemModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Requirement Details"
        item={selected}
        fields={fields}
        onUpdate={update}
        extraContent={selected ? (
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Course</label>
            <DynamicSelect
              options={courses.map((c) => c.code)}
              value={getCourse(selected.courseId)?.code || ""}
              onChange={(v) => { const c = courses.find((c) => c.code === v); if (c) update("courseId", c.id); }}
              placeholder="Select course"
            />
          </div>
        ) : undefined}
      />
    </div>
  );
};

export default RequirementsModule;
