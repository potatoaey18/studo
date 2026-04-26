import { motion } from "framer-motion";
import { ArrowLeft, Target, RefreshCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const values = [
  {
    icon: Target,
    title: "Minimal by design.",
    desc: "Every feature earns its place. If it doesn't directly help you study or manage your academic life, it doesn't make it in.",
  },
  {
    icon: BookOpen,
    title: "Built for students, by a student.",
    desc: "Nootzs came from real frustration with tools that were either too complex or too shallow. The goal was something in between — calm, focused, effective.",
  },
  {
    icon: RefreshCcw,
    title: "Shaped by feedback.",
    desc: "The roadmap isn't fixed. Features get added, removed, or changed based on what students actually find useful. Nothing stays just because it's there.",
  },
];

const roadmap = [
  { status: "live", label: "Study Tracker (Pomodoro)", },
  { status: "live", label: "Course Management" },
  { status: "live", label: "Kanban Boards" },
  { status: "live", label: "Class Schedule" },
  { status: "live", label: "Analytics" },
  { status: "live", label: "Expense Tracker" },
  { status: "live", label: "Resource Library" },
  { status: "planned", label: "Mobile App" },
  { status: "planned", label: "Calendar Integration" },
  { status: "feedback", label: "Features based on your input →" },
];

const About = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <h1 className="font-display text-xl font-bold tracking-tight">Nootzs</h1>
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.span
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4"
        >
          About
        </motion.span>
        <motion.h1
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]"
        >
          Studying should be simple.
        </motion.h1>
        <motion.p
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
          className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
        >
          Nootzs started as a personal project to replace the pile of apps, spreadsheets, and sticky notes
          that were supposed to help — but mostly got in the way.
        </motion.p>
      </section>

      {/* Story */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="rounded-2xl border bg-card p-8 space-y-4"
        >
          <h2 className="font-display text-2xl font-bold">The story.</h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            I built Nootzs because I couldn't find a single tool that did everything I needed without overwhelming me.
            I kept bouncing between apps and losing focus in the process.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm">
            So I built one thing that handles courses, tasks, schedules, and focus sessions — with nothing extra.
            The goal isn't to be the most powerful productivity tool. It's to be the most <em>useful</em> one for students.
          </p>
          <div className="pt-4 border-t">
            <p className="text-sm font-semibold font-display">Agatha Esguerra</p>
            <p className="text-xs text-muted-foreground">Founder, Nootzs</p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="font-display text-3xl font-bold text-center mb-10"
        >
          What we stand for.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="p-6 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
            >
              <v.icon className="h-5 w-5 text-muted-foreground mb-3" />
              <h3 className="font-display font-semibold text-sm mb-2">{v.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl font-bold mb-3">Where we're headed.</h2>
          <p className="text-muted-foreground text-sm">
            The roadmap is driven by what students actually need. Features get added — and removed — based on real feedback.
          </p>
        </motion.div>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="rounded-2xl border bg-card p-6 space-y-2"
        >
          {roadmap.map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                item.status === "live"
                  ? "bg-primary"
                  : item.status === "planned"
                  ? "bg-muted-foreground/40"
                  : "bg-muted-foreground/20 border border-dashed border-muted-foreground/40"
              }`} />
              <span className={`text-sm ${item.status === "live" ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
              {item.status === "live" && (
                <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-primary/70">Live</span>
              )}
              {item.status === "planned" && (
                <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Soon</span>
              )}
            </div>
          ))}
        </motion.div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Have an idea? <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors" onClick={onBack}>Let us know →</span>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display font-bold text-sm">Nootzs</p>
          <p className="text-xs text-muted-foreground">© 2026 Nootzs. Simple productivity for students.</p>
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

export default About;