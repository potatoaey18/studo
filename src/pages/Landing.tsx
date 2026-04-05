import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, BarChart3, KanbanSquare, Clock, DollarSign, FolderOpen, Play, Pause, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Interactive demo components
const DemoTimer = () => {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(25 * 60);

  return (
    <div className="text-center space-y-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Focus Time</p>
      <p className="font-display text-3xl font-bold tabular-nums">
        {String(Math.floor(time / 60)).padStart(2, "0")}:{String(time % 60).padStart(2, "0")}
      </p>
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setRunning(!running)}>
          {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {running ? "Pause" : "Start"}
        </Button>
      </div>
    </div>
  );
};

const DemoKanban = () => {
  const cols = [
    { label: "To Do", tasks: ["Design wireframes", "Write API docs"] },
    { label: "In Progress", tasks: ["Database schema"] },
    { label: "Done", tasks: ["Project setup"] },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {cols.map((col) => (
        <div key={col.label} className="rounded-lg bg-muted/30 p-2">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase mb-2">{col.label}</p>
          {col.tasks.map((t) => (
            <div key={t} className="bg-background rounded-md p-2 mb-1 flex items-center gap-1.5 text-[10px] border">
              <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
              {t}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const DemoSchedule = () => {
  const slots = [
    { time: "9 AM", course: "CS201", name: "Data Structures", days: [0, 2, 4] },
    { time: "10 AM", course: "MATH202", name: "Calculus II", days: [1, 3] },
    { time: "1 PM", course: "ENG105", name: "Technical Writing", days: [0, 2, 4] },
  ];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
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
            <div key={i} className={`h-6 rounded text-[7px] flex items-center justify-center ${s.days.includes(i) ? "bg-accent/80 border border-border" : ""}`}>
              {s.days.includes(i) ? s.course : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const DemoAnalytics = () => {
  const data = [
    { label: "CS201", pct: 75 },
    { label: "MATH202", pct: 50 },
    { label: "ENG105", pct: 30 },
    { label: "PHY101", pct: 60 },
  ];
  return (
    <div className="space-y-2">
      <p className="text-[10px] text-muted-foreground font-semibold uppercase">Study Hours by Course</p>
      {data.map((d) => (
        <div key={d.label} className="space-y-1">
          <div className="flex justify-between text-[9px]">
            <span>{d.label}</span>
            <span className="text-muted-foreground">{(d.pct / 10).toFixed(1)}h</span>
          </div>
          <Progress value={d.pct} className="h-1.5" />
        </div>
      ))}
    </div>
  );
};

const Landing = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <h1 className="font-display text-xl font-bold tracking-tight">Studo</h1>
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

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2 variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-3xl font-bold text-center mb-12">
          Everything you need, nothing you don't.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="font-display text-3xl font-bold text-center mb-3">Try it out.</h2>
          <p className="text-center text-muted-foreground text-sm mb-10">An interactive preview of Studo's key features.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="rounded-2xl border bg-card shadow-sm overflow-hidden">
          {/* Mock sidebar + content */}
          <div className="flex min-h-[400px]">
            {/* Mini sidebar */}
            <div className="w-44 border-r bg-muted/20 p-4 hidden md:block">
              <p className="font-display font-bold text-sm mb-4">Studo</p>
              <div className="space-y-1">
                {["Dashboard", "Study Tracker", "Courses", "Schedule", "Projects", "Expenses", "Resources"].map((item) => (
                  <div key={item} className="text-xs py-1.5 px-2 rounded-md text-muted-foreground hover:bg-accent/50 cursor-default">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Demo content grid */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Pomodoro Timer</h4>
                <DemoTimer />
              </Card>

              <Card className="p-4">
                <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Analytics</h4>
                <DemoAnalytics />
              </Card>

              <Card className="p-4">
                <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Kanban Board</h4>
                <DemoKanban />
              </Card>

              <Card className="p-4">
                <h4 className="font-display text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Class Schedule</h4>
                <DemoSchedule />
              </Card>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-6">
          <Button size="lg" onClick={onGetStarted} className="gap-2 px-8">
            Start Using Studo <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="font-display text-3xl font-bold mb-6">Built for clarity.</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unlike many productivity platforms that overwhelm students with complex features,
            Studo focuses on clarity, simplicity, and essential tools that students actually use.
            No cluttered dashboards, no steep learning curves — just a calm space to manage your academic life.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display font-bold text-sm">Studo</p>
          <p className="text-xs text-muted-foreground">© 2026 Studo. Simple productivity for students.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground transition-colors">Features</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">About</span>
            <span className="cursor-pointer hover:text-foreground transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
