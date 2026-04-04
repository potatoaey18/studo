import { useState, useEffect, useRef } from "react";
import { demoStudySessions, demoCourses, StudySession } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, RotateCcw } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";

const fields: FieldConfig[] = [
  { key: "topic", label: "Topic", placeholder: "What did you study?" },
  { key: "date", label: "Date", type: "date" },
  { key: "hours", label: "Hours", type: "number", placeholder: "0" },
];

const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;

const StudyTrackerModule = () => {
  const [sessions, setSessions] = useState<StudySession[]>(demoStudySessions);
  const [selected, setSelected] = useState<StudySession | null>(null);

  // Pomodoro state
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsRunning(false);
            if (!isBreak) {
              setIsBreak(true);
              return POMODORO_BREAK;
            } else {
              setIsBreak(false);
              return POMODORO_WORK;
            }
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak]);

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(POMODORO_WORK);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setSessions((ss) => ss.map((s) => (s.id === updated.id ? updated : s)));
  };

  const add = () => {
    const s: StudySession = { id: `s${Date.now()}`, courseId: "c1", date: new Date().toISOString().split("T")[0], hours: 0, topic: "" };
    setSessions((ss) => [...ss, s]);
    setSelected(s);
  };

  const getCourse = (id: string) => demoCourses.find((c) => c.id === id);
  const totalHours = sessions.reduce((s, ss) => s + ss.hours, 0);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">Study Tracker</h2>

      {/* Pomodoro Timer */}
      <Card className="p-6 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          {isBreak ? "Break Time" : "Focus Time"}
        </p>
        <p className="font-display text-5xl font-bold tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setIsRunning(!isRunning)} className="gap-1.5">
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </Card>

      {/* Session Logs */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-sm">Session Logs</h3>
          <p className="text-xs text-muted-foreground">Total: {totalHours.toFixed(1)}h</p>
        </div>
        <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Log Session
        </Button>
      </div>

      <div className="grid gap-2">
        {sessions.map((s) => (
          <Card
            key={s.id}
            className="p-3 cursor-pointer hover:ring-1 hover:ring-ring/20 transition-all flex items-center justify-between"
            onClick={() => setSelected(s)}
          >
            <div>
              <p className="text-sm font-medium">{s.topic || "Untitled Session"}</p>
              <p className="text-xs text-muted-foreground">{getCourse(s.courseId)?.code} · {s.date}</p>
            </div>
            <Badge variant="secondary" className="text-xs">{s.hours}h</Badge>
          </Card>
        ))}
      </div>

      <ItemModal open={!!selected} onClose={() => setSelected(null)} title="Session Details" item={selected} fields={fields} onUpdate={update} />
    </div>
  );
};

export default StudyTrackerModule;
