import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { KanbanTask, demoKanbanTasks } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";

const columns: { id: KanbanTask["status"]; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

const fields: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "Task title" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Details..." },
  { key: "assignee", label: "Assignee", placeholder: "Name" },
  { key: "dueDate", label: "Due Date", type: "date" },
  { key: "project", label: "Project", placeholder: "Project name" },
];

const GroupProjectsModule = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(demoKanbanTasks);
  const [selected, setSelected] = useState<KanbanTask | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as KanbanTask["status"];
    setTasks((ts) => ts.map((t) => (t.id === result.draggableId ? { ...t, status: newStatus } : t)));
  };

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
  };

  const add = () => {
    const t: KanbanTask = { id: `k${Date.now()}`, title: "", description: "", assignee: "", dueDate: "", status: "todo", project: "" };
    setTasks((ts) => [...ts, t]);
    setSelected(t);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Group Projects</h2>
        <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl p-3 min-h-[120px] transition-colors ${snapshot.isDraggingOver ? "bg-accent/70" : "bg-muted/30"}`}
                >
                  <h4 className="font-display font-semibold text-xs mb-3 text-muted-foreground uppercase tracking-wider">
                    {col.label} ({tasks.filter((t) => t.status === col.id).length})
                  </h4>
                  {tasks.filter((t) => t.status === col.id).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 mb-2 cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-ring/20 transition-shadow"
                          onClick={() => setSelected(task)}
                        >
                          <p className="text-sm font-medium">{task.title || "Untitled"}</p>
                          <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className="text-[10px]">{task.assignee}</Badge>
                            <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <ItemModal open={!!selected} onClose={() => setSelected(null)} title="Task Details" item={selected} fields={fields} onUpdate={update} />
    </div>
  );
};

export default GroupProjectsModule;
