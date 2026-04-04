import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { KanbanTask, demoKanbanTasks } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const columns: { id: KanbanTask["status"]; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>(demoKanbanTasks);
  const [selected, setSelected] = useState<KanbanTask | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as KanbanTask["status"];
    setTasks((ts) =>
      ts.map((t) => (t.id === result.draggableId ? { ...t, status: newStatus } : t))
    );
  };

  const updateSelected = (field: keyof KanbanTask, value: string) => {
    if (!selected) return;
    const updated = { ...selected, [field]: value };
    setSelected(updated);
    setTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl p-3 min-h-[200px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-accent/70" : "bg-muted/50"
                  }`}
                >
                  <h4 className="font-display font-semibold text-xs mb-3 text-muted-foreground uppercase tracking-wider">
                    {col.label} ({tasks.filter((t) => t.status === col.id).length})
                  </h4>
                  {tasks
                    .filter((t) => t.status === col.id)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 mb-2 cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-ring/20 transition-shadow"
                            onClick={() => setSelected(task)}
                          >
                            <p className="text-sm font-medium">{task.title}</p>
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

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Task Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs text-muted-foreground">Title</label>
                <Input value={selected.title} onChange={(e) => updateSelected("title", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <Textarea value={selected.description} onChange={(e) => updateSelected("description", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Assignee</label>
                  <Input value={selected.assignee} onChange={(e) => updateSelected("assignee", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Due Date</label>
                  <Input type="date" value={selected.dueDate} onChange={(e) => updateSelected("dueDate", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Project</label>
                <Input value={selected.project} onChange={(e) => updateSelected("project", e.target.value)} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KanbanBoard;
