import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const faqs = [
  {
    q: "Is Nootzs free to use?",
    a: "Yes — Nootzs is free. If that changes in the future, existing users will always be notified well in advance.",
  },
  {
    q: "Can I request a feature?",
    a: "Absolutely. The roadmap is driven entirely by what students find useful. Use the contact form and tell us what you need.",
  },
  {
    q: "Will you add [feature X]?",
    a: "Maybe! Features get added based on how many students actually need them, and removed when they stop being useful. Nothing is permanent.",
  },
  {
    q: "Is my data private?",
    a: "Your data belongs to you. We don't sell it, share it, or use it for advertising. It's used only to make Nootzs work.",
  },
  {
    q: "I found a bug. Where do I report it?",
    a: "Use the contact form below and include as much detail as you can — what you were doing, what happened, and what you expected. It helps a lot.",
  },
];

const Contact = ({ onBack }: { onBack: () => void }) => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "bba86084-99cb-4c19-944c-488d82caa874",
        ...form,
      }),
    });
    setLoading(false);
    setSent(true);
  };

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
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.span
          initial="hidden" animate="visible" variants={fadeUp} custom={0}
          className="inline-block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4"
        >
          Contact
        </motion.span>
        <motion.h1
          initial="hidden" animate="visible" variants={fadeUp} custom={1}
          className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]"
        >
          Say hello.
        </motion.h1>
        <motion.p
          initial="hidden" animate="visible" variants={fadeUp} custom={2}
          className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto"
        >
          Got feedback, a bug report, a feature idea, or just want to reach out? We read everything.
        </motion.p>
      </section>

      {/* Contact grid */}
      <section className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left — social + email */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="space-y-4"
        >
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Reach us at</h2>

          <a href="mailto:agathamayesguerra@gmail.com"
            className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors group"
          >
            <Mail className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <div>
              <p className="text-xs font-medium">Email</p>
              <p className="text-xs text-muted-foreground">agathamayesguerra@gmail.com</p>
            </div>
          </a>

          <p className="text-[11px] text-muted-foreground pt-2 leading-relaxed">
            Typically responds within 1–2 days. Feature requests and feedback go directly to the roadmap.
          </p>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="md:col-span-2"
        >
          <Card className="p-6">
            {sent ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Send className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-display font-bold text-lg">Message sent!</h3>
                <p className="text-sm text-muted-foreground">Thanks for reaching out. We'll get back to you soon.</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                  Send another
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Send a message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
                  >
                    <option value="">Select a topic…</option>
                    <option value="feedback">General Feedback</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What's on your mind?"
                    rows={5}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring transition resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!form.name || !form.email || !form.message || loading}
                  className="w-full gap-2"
                >
                  {loading ? "Sending…" : <> Send Message <Send className="h-3.5 w-3.5" /></>}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="font-display text-3xl font-bold text-center mb-10"
        >
          Common questions.
        </motion.h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="rounded-xl border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-accent/50 transition-colors"
              >
                {faq.q}
                {openFaq === i
                  ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t pt-3">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
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

export default Contact;