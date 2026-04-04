import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useData } from "@/lib/dataContext";

interface Props {
  open: boolean;
  onClose: () => void;
  type: "study" | "expense" | "tasks";
}

const COLORS = [
  "hsl(var(--foreground))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--accent-foreground))",
  "hsl(var(--primary))",
];

const AnalyticsModal = ({ open, onClose, type }: Props) => {
  const { sessions, expenses, tasks, courses } = useData();

  const studyData = courses.map((c) => ({
    name: c.code,
    hours: parseFloat(sessions.filter((s) => s.courseId === c.id).reduce((a, s) => a + s.hours, 0).toFixed(1)),
  })).filter((d) => d.hours > 0);

  const expenseData = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));

  const taskData = [
    { name: "Completed", value: tasks.filter((t) => t.completed).length },
    { name: "Pending", value: tasks.filter((t) => !t.completed).length },
  ];

  const tooltipStyle = {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {type === "study" ? "Study Hours" : type === "expense" ? "Expense Distribution" : "Task Progress"}
          </DialogTitle>
          <DialogDescription>Analytics overview</DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          {type === "study" && (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="hours" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {type === "expense" && (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {expenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {type === "tasks" && (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={taskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {taskData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsModal;
