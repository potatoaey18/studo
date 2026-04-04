import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, BarChart3, KanbanSquare, Clock, DollarSign, Search, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Clock, title: "Study Tracker", desc: "Log and visualize your study hours by subject" },
  { icon: BookOpen, title: "Course Requirements", desc: "Track assignments, papers, and deadlines" },
  { icon: Calendar, title: "Exam Countdown", desc: "Never miss an exam with countdown timers" },
  { icon: KanbanSquare, title: "Kanban Board", desc: "Manage group projects with drag-and-drop" },
  { icon: BarChart3, title: "Class Schedule", desc: "View your weekly schedule at a glance" },
  { icon: DollarSign, title: "Expense Tracker", desc: "Keep student spending under control" },
  { icon: Search, title: "Research Organizer", desc: "Collect and annotate research sources" },
  { icon: FolderOpen, title: "Resource Hub", desc: "Centralize lecture slides, links, and materials" },
];

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

      {/* Preview */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="rounded-2xl border bg-card p-8 shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 rounded-xl bg-muted p-6 h-48 flex items-end">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Dashboard</p>
                <p className="font-display font-semibold text-sm">Your academic overview at a glance</p>
              </div>
            </div>
            <div className="rounded-xl bg-accent p-6 h-48 flex items-end">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Kanban</p>
                <p className="font-display font-semibold text-sm">Drag & drop project boards</p>
              </div>
            </div>
            <div className="rounded-xl bg-accent p-6 h-32 flex items-end">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Study Tracker</p>
                <p className="font-display font-semibold text-sm">Visualize study hours</p>
              </div>
            </div>
            <div className="rounded-xl bg-muted p-6 h-32 flex items-end">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Expenses</p>
                <p className="font-display font-semibold text-sm">Track spending</p>
              </div>
            </div>
            <div className="rounded-xl bg-secondary p-6 h-32 flex items-end">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Exams</p>
                <p className="font-display font-semibold text-sm">Countdown timers</p>
              </div>
            </div>
          </div>
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
