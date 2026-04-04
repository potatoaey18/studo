import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { demoExams, Exam } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";

type ExamWithStatus = Exam & { status: "upcoming" | "studying" | "done" };

const columns: { id: ExamWithStatus["status"]; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "studying", label: "Studying" },
  { id: "done", label: "Done" },
];

const fields: FieldConfig[] = [
  { key: "subject", label: "Subject", placeholder: "e.g. Data Structures" },
  { key: "date", label: "Date", type: "date" },
  { key: "location", label: "Location", placeholder: "e.g. Room 301" },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Study notes..." },
];

const ExamsModule = () => {
  const [exams, setExams] = useState<ExamWithStatus[]>(
    demoExams.map((e) => ({ ...e, status: "upcoming" as const }))
  );
  const [selected, setSelected] = useState<ExamWithStatus | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const status = result.destination.droppableId as ExamWithStatus["status"];
    setExams((es) => es.map((e) => (e.id === result.draggableId ? { ...e, status } : e)));
  };

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setExams((es) => es.map((e) => (e.id === updated.id ? updated : e)));
  };

  const add = () => {
    const e: ExamWithStatus = { id: `e${Date.now()}`, subject: "", date: "", location: "", notes: "", status: "upcoming" };
    setExams((es) => [...es, e]);
    setSelected(e);
  };

  const now = new Date();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Exams</h2>
        <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Exam
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
                    {col.label} ({exams.filter((e) => e.status === col.id).length})
                  </h4>
                  {exams.filter((e) => e.status === col.id).map((exam, index) => {
                    const examDate = new Date(exam.date);
                    const diff = Math.max(0, Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                    return (
                      <Draggable key={exam.id} draggableId={exam.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 mb-2 cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-ring/20 transition-shadow"
                            onClick={() => setSelected(exam)}
                          >
                            <p className="text-sm font-medium">{exam.subject || "Untitled"}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] text-muted-foreground">{exam.location}</span>
                              <span className="font-display text-xs font-bold">{diff}d</span>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <ItemModal open={!!selected} onClose={() => setSelected(null)} title="Exam Details" item={selected} fields={fields} onUpdate={update} />
    </div>
  );
};

export default ExamsModule;
