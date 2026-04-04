import { useState, useEffect, useRef } from "react";
import { useData } from "@/lib/dataContext";
import { StudySession } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Save } from "lucide-react";
import DynamicSelect from "@/components/DynamicSelect";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const POMODORO_WORK = 25 * 60;
const POMODORO_BREAK = 5 * 60;

const StudyTrackerModule = () => {
  const { sessions, setSessions, courses, getCourse } = useData();

  // Pomodoro state
  const [timeLeft, setTimeLeft] = useState(POMODORO_WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || "");
  const [topic, setTopic] = useState("");
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
        if (!isBreak) {
          setElapsed((e) => e + 1);
        }
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak]);

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(POMODORO_WORK);
    setElapsed(0);
  };

  const saveSession = () => {
    if (elapsed < 60) return; // at least 1 minute
    const hours = parseFloat((elapsed / 3600).toFixed(2));
    const now = new Date();
    const s: StudySession = {
      id: `s${Date.now()}`,
      courseId: selectedCourseId,
      date: now.toISOString().split("T")[0],
      hours,
      topic: topic || `Study session – ${getCourse(selectedCourseId)?.code || "General"}`,
    };
    setSessions((ss) => [s, ...ss]);
    reset();
    setTopic("");
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const elapsedMins = Math.floor(elapsed / 60);

  const totalHours = sessions.reduce((s, ss) => s + ss.hours, 0);

  // Weekly analytics: group by course
  const courseHours = courses.map((c) => ({
    name: c.code,
    hours: parseFloat(sessions.filter((s) => s.courseId === c.id).reduce((a, s) => a + s.hours, 0).toFixed(1)),
  })).filter((c) => c.hours > 0);

  // Sort sessions descending
  const sortedSessions = [...sessions].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return parseInt(b.id.replace(/\D/g, "")) - parseInt(a.id.replace(/\D/g, ""));
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-semibold">Study Tracker</h2>

      {/* Pomodoro Timer */}
      <Card className="p-6">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {isBreak ? "Break Time" : "Focus Time"}
          </p>
          <p className="font-display text-5xl font-bold tabular-nums">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
          {elapsed > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{elapsedMins}m focused</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Course</Label>
            <DynamicSelect
              options={courses.map((c) => c.code)}
              value={courses.find((c) => c.id === selectedCourseId)?.code || ""}
              onChange={(v) => {
                const c = courses.find((c) => c.code === v);
                if (c) setSelectedCourseId(c.id);
              }}
              placeholder="Select course"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Topic (optional)</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What are you studying?" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => setIsRunning(!isRunning)} className="gap-1.5">
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          {elapsed >= 60 && (
            <Button size="sm" onClick={saveSession} className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Save Session
            </Button>
          )}
        </div>
      </Card>

      {/* Analytics */}
      {courseHours.length > 0 && (
        <Card className="p-5">
          <h3 className="font-display font-semibold text-sm mb-3">Hours by Course</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={courseHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="hours" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Session Logs */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-sm">Session Logs</h3>
          <p className="text-xs text-muted-foreground">Total: {totalHours.toFixed(1)}h across {sessions.length} sessions</p>
        </div>
      </div>

      <div className="grid gap-2">
        {sortedSessions.map((s) => (
          <Card key={s.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{s.topic || "Untitled Session"}</p>
              <p className="text-xs text-muted-foreground">{getCourse(s.courseId)?.code} · {s.date}</p>
            </div>
            <Badge variant="secondary" className="text-xs">{s.hours}h</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudyTrackerModule;
