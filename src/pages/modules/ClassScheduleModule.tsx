import { useState } from "react";
import { useData, ClassSlot } from "@/lib/dataContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";
import DynamicSelect from "@/components/DynamicSelect";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const hours = Array.from({ length: 24 }, (_, i) => i); // 0–23

const fields: FieldConfig[] = [
  { key: "day", label: "Day", type: "select", options: days },
  { key: "startHour", label: "Start Hour", type: "number", placeholder: "e.g. 9" },
  { key: "endHour", label: "End Hour", type: "number", placeholder: "e.g. 10" },
  { key: "location", label: "Location", placeholder: "e.g. Room 301" },
];

const formatHour = (h: number) => {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
};

const ClassScheduleModule = () => {
  const { classSlots, setClassSlots, courses, getCourse } = useData();
  const [selected, setSelected] = useState<ClassSlot | null>(null);

  const update = (key: string, value: any) => {
    if (!selected) return;
    const v = (key === "startHour" || key === "endHour") ? parseInt(value) || 0 : value;
    const updated = { ...selected, [key]: v };
    setSelected(updated);
    setClassSlots((ss) => ss.map((s) => (s.id === updated.id ? updated : s)));
  };

  const add = () => {
    const s: ClassSlot = {
      id: `cs-${Date.now()}`,
      courseId: courses[0]?.id || "",
      day: "Monday",
      startHour: 9,
      endHour: 10,
      location: "",
    };
    setClassSlots((ss) => [s, ...ss]);
    setSelected(s);
  };

  const remove = (id: string) => {
    setClassSlots((ss) => ss.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Class Schedule</h2>
        <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Class
        </Button>
      </div>

      {/* Time-based grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-border rounded-t-lg overflow-hidden">
            <div className="bg-background p-2" />
            {days.map((d) => (
              <div key={d} className="bg-muted/30 p-2 text-center">
                <span className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider">{d.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Time rows */}
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] gap-px bg-border">
              <div className="bg-background p-2 flex items-start justify-end pr-3">
                <span className="text-[10px] text-muted-foreground">{formatHour(hour)}</span>
              </div>
              {days.map((day) => {
                const slotsHere = classSlots.filter(
                  (s) => s.day === day && s.startHour <= hour && s.endHour > hour
                );
                return (
                  <div key={day} className="bg-background min-h-[40px] relative p-0.5">
                    {slotsHere.map((slot) => {
                      const course = getCourse(slot.courseId);
                      const isStart = slot.startHour === hour;
                      if (!isStart) return null;
                      const span = slot.endHour - slot.startHour;
                      return (
                        <div
                          key={slot.id}
                          className="absolute inset-x-0.5 rounded-md bg-accent/80 border border-border p-1.5 cursor-pointer hover:bg-accent transition-colors z-10 group"
                          style={{ height: `${span * 40 - 4}px`, top: 2 }}
                          onClick={() => setSelected(slot)}
                        >
                          <p className="text-[10px] font-medium truncate">{course?.code || "—"}</p>
                          <p className="text-[9px] text-muted-foreground truncate">{course?.name}</p>
                          {slot.location && <p className="text-[9px] text-muted-foreground">{slot.location}</p>}
                          <Button
                            variant="ghost" size="icon"
                            onClick={(e) => { e.stopPropagation(); remove(slot.id); }}
                            className="absolute top-0.5 right-0.5 h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                          >
                            <Trash2 className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <ItemModal
          open={!!selected}
          onClose={() => setSelected(null)}
          title="Class Details"
          item={selected}
          fields={fields}
          onUpdate={update}
          extraContent={
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Course</label>
              <DynamicSelect
                options={courses.map((c) => c.code)}
                value={getCourse(selected.courseId)?.code || ""}
                onChange={(v) => {
                  const c = courses.find((c) => c.code === v);
                  if (c) update("courseId", c.id);
                }}
                placeholder="Select course"
              />
            </div>
          }
        />
      )}
    </div>
  );
};

export default ClassScheduleModule;
