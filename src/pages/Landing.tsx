import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, BarChart3, KanbanSquare, Clock, DollarSign, FolderOpen, Play, Pause, GripVertical, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Clock, title: "Study Tracker", desc: "Pomodoro timer with automatic session logging" },
  { icon: BookOpen, title: "Courses", desc: "Manage courses synced across all modules" },
  { icon: Calendar, title: "Class Schedule", desc: "Full-day calendar view of your classes" },
  { icon: KanbanSquare, title: "Kanban Boards", desc: "Drag-and-drop project management" },
  { icon: BarChart3, title: "Analytics", desc: "Visualize study hours and spending" },
  { icon: DollarSign, title: "Expense Tracker", desc: "Track spending with category analytics" },
  { icon: FolderOpen, title: "Resources", desc: "Organize links, notes, and documents by course" },
];

// ── Interactive Demo Components ──

const DemoTimer = () => {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setRunning(false);
          setSessions((s) => s + 1);
          return 25 * 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running]);

  const pct = ((25 * 60 - time) / (25 * 60)) * 100;

  return (
    <div className="text-center space-y-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Focus Time</p>
      <div className="relative w-24 h-24 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--primary))" strokeWidth="6"
            strokeDasharray={`${pct * 2.76} 276`} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-display text-lg font-bold tabular-nums">
            {String(Math.floor(time / 60)).padStart(2, "0")}:{String(time % 60).padStart(2, "0")}
          </p>
        </div>
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setRunning(!running)}>
          {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {running ? "Pause" : "Start"}
        </Button>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => { setTime(25 * 60); setRunning(false); }}>
          <RotateCcw className="h-3 w-3" /> Reset
        </Button>
      </div>
      {sessions > 0 && (
        <p className="text-[10px] text-muted-foreground">{sessions} session{sessions > 1 ? "s" : ""} completed</p>
      )}
    </div>
  );
};

type KanbanCol = { label: string; tasks: string[] };

const DemoKanban = () => {
  const [cols, setCols] = useState<KanbanCol[]>([
    { label: "To Do", tasks: ["Design wireframes", "Write API docs", "User research"] },
    { label: "In Progress", tasks: ["Database schema"] },
    { label: "Done", tasks: ["Project setup"] },
  ]);
  const [dragging, setDragging] = useState<{ col: number; task: number } | null>(null);

  const moveTask = useCallback((fromCol: number, taskIdx: number, toCol: number) => {
    setCols((prev) => {
      const next = prev.map((c) => ({ ...c, tasks: [...c.tasks] }));
      const [task] = next[fromCol].tasks.splice(taskIdx, 1);
      next[toCol].tasks.push(task);
      return next;
    });
  }, []);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {cols.map((col, ci) => (
          <div key={col.label}
            className="rounded-lg bg-muted/30 p-2 min-h-[80px] transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragging && dragging.col !== ci) { moveTask(dragging.col, dragging.task, ci); setDragging(null); } }}
          >
            <p className="text-[9px] font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1">
              {col.label} <span className="text-[8px] opacity-60">({col.tasks.length})</span>
            </p>
            {col.tasks.map((t, ti) => (
              <div key={t} draggable
                onDragStart={() => setDragging({ col: ci, task: ti })}
                onDragEnd={() => setDragging(null)}
                className="bg-background rounded-md p-2 mb-1 flex items-center gap-1.5 text-[10px] border cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-ring/20 transition-all"
              >
                <GripVertical className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                {col.label === "Done" && <CheckCircle2 className="h-2.5 w-2.5 text-primary shrink-0" />}
                {t}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-[9px] text-muted-foreground text-center italic">Drag tasks between columns to try it out</p>
    </div>
  );
};

const DemoSchedule = () => {
  const slots = [
    { time: "9 AM", course: "CS201", name: "Data Structures", days: [0, 2, 4], color: "bg-primary/15 border-primary/30" },
    { time: "10 AM", course: "MATH202", name: "Calculus II", days: [1, 3], color: "bg-accent border-accent-foreground/10" },
    { time: "1 PM", course: "ENG105", name: "Technical Writing", days: [0, 2, 4], color: "bg-muted border-border" },
  ];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[40px_repeat(5,1fr)] gap-px text-[8px] text-muted-foreground">
        <div />
        {dayLabels.map((d) => <div key={d} className="text-center font-semibold uppercase">{d}</div>)}
      </div>
      {slots.map((s) => (
        <div key={s.course} className="grid grid-cols-[40px_repeat(5,1fr)] gap-px">
          <div className="text-[8px] text-muted-foreground text-right pr-1">{s.time}</div>
          {dayLabels.map((_, i) => (
            <div key={i}
              className={`h-7 rounded text-[7px] flex items-center justify-center border transition-all cursor-default ${s.days.includes(i) ? `${s.color} ${hovered === s.course ? "scale-105 shadow-sm" : ""}` : "border-transparent"}`}
              onMouseEnter={() => s.days.includes(i) && setHovered(s.course)}
              onMouseLeave={() => setHovered(null)}
            >
              {s.days.includes(i) ? (
                <span className="truncate px-0.5">{hovered === s.course ? s.name : s.course}</span>
              ) : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const DemoAnalytics = () => {
  const [showDetailed, setShowDetailed] = useState(false);
  const data = [
    { label: "CS201", pct: 75, hours: 7.5 },
    { label: "MATH202", pct: 50, hours: 5.0 },
    { label: "ENG105", pct: 30, hours: 3.0 },
    { label: "PHY101", pct: 60, hours: 6.0 },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground font-semibold uppercase">
          {showDetailed ? "Weekly Breakdown" : "Study Hours by Course"}
        </p>
        <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1.5" onClick={() => setShowDetailed(!showDetailed)}>
          {showDetailed ? "Summary" : "Details"}
        </Button>
      </div>
      {showDetailed ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {data.map((d) => (
            <div key={d.label} className="text-center rounded-lg bg-muted/40 p-2">
              <p className="text-[8px] text-muted-foreground">{d.label}</p>
              <p className="font-display text-sm font-bold">{d.hours}h</p>
              <p className="text-[8px] text-primary">{d.pct}%</p>
            </div>
          ))}
        </div>
      ) : (
        data.map((d) => (
          <div key={d.label} className="space-y-1">
            <div className="flex justify-between text-[9px]">
              <span>{d.label}</span>
              <span className="text-muted-foreground">{d.hours}h</span>
            </div>
            <Progress value={d.pct} className="h-1.5" />
          </div>
        ))
      )}
    </div>
  );
};


// ── Demo Tab Navigation ──

const demoTabs = ["Dashboard", "Study Tracker", "Kanban", "Schedule"] as const;
type DemoTab = typeof demoTabs[number];

const DemoContent = ({ tab }: { tab: DemoTab }) => {
  switch (tab) {
    case "Dashboard":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Pomodoro Timer</h4>
            <DemoTimer />
          </Card>
          <Card className="p-4">
            <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Analytics</h4>
            <DemoAnalytics />
          </Card>
        </div>
      );
    case "Study Tracker":
      return (
        <Card className="p-4">
          <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Focus Session</h4>
          <DemoTimer />
        </Card>
      );
    case "Kanban":
      return (
        <Card className="p-4">
          <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Project Board</h4>
          <DemoKanban />
        </Card>
      );
    case "Schedule":
      return (
        <Card className="p-4">
          <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Weekly Schedule</h4>
          <DemoSchedule />
        </Card>
      );
  }
};

const Landing = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [activeTab, setActiveTab] = useState<DemoTab>("Dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <h1 className="font-display text-xl font-bold tracking-tight">Nootzs</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={onGetStarted}>Sign In</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
            Student Productivity
          </span>
        </motion.div>
        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible" className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
          Simple productivity<br />for students.
        </motion.h1>
        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible" className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Manage courses, tasks, exams, and projects — all in one calm, minimal workspace designed for the way students actually work.
        </motion.p>
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="mt-8">
          <Button size="lg" onClick={onGetStarted} className="gap-2 px-8">
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="font-display text-3xl font-bold mb-6">Built for clarity.</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unlike many productivity platforms that overwhelm students with complex features,
            Nootzs focuses on clarity, simplicity, and essential tools that students actually use.
            No cluttered dashboards, no steep learning curves — just a calm space to manage your academic life.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl font-bold text-center mb-12">
          Everything you need, nothing you don't.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {features.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="p-5 rounded-xl border bg-card hover:bg-accent/50 transition-colors">
              <f.icon className="h-5 w-5 text-muted-foreground mb-3" />
              <h3 className="font-display font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="font-display text-3xl font-bold text-center mb-3">Try it out.</h2>
          <p className="text-center text-muted-foreground text-sm mb-10">An interactive preview — drag tasks, start the timer, explore modules.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row min-h-[300px]">
            {/* Mini sidebar */}
            <div className="w-44 border-r bg-muted/20 p-4 hidden md:block">
              <p className="font-display font-bold text-sm mb-4">Nootzs</p>
              <div className="space-y-0.5">
                {demoTabs.map((tab) => (
                  <button key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors ${activeTab === tab ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile tabs */}
            <div className="md:hidden flex border-b w-full overflow-x-auto">
              {demoTabs.map((tab) => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 flex-1 text-[10px] py-2 border-b-2 transition-colors ${activeTab === tab ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Demo content */}
            <div className="flex-1 p-3 sm:p-6">
              <DemoContent tab={activeTab} />
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-6">
          <Button size="lg" onClick={onGetStarted} className="gap-2 px-8">
            Start Using Nootzs <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display font-bold text-sm">Nootzs</p>
          <p className="text-xs text-muted-foreground">© 2026 Nootzs. Simple productivity for students.</p>
          {/* <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground transition-colors">Features</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">About</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Contact</span>
          </div> */}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
