import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import StudyChart from "./StudyChart";
import ExpenseChart from "./ExpenseChart";
import { demoTasks } from "@/lib/demoData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  open: boolean;
  onClose: () => void;
  type: "study" | "expense" | "tasks";
}

const TaskChart = () => {
  const completed = demoTasks.filter((t) => t.completed).length;
  const pending = demoTasks.filter((t) => !t.completed).length;
  const data = [
    { name: "Completed", count: completed },
    { name: "Pending", count: pending },
  ];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const titles = { study: "Study Hours by Subject", expense: "Expense Distribution", tasks: "Tasks Overview" };

const AnalyticsModal = ({ open, onClose, type }: Props) => (
  <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="font-display">{titles[type]}</DialogTitle>
      </DialogHeader>
      <div className="pt-4">
        {type === "study" && <StudyChart />}
        {type === "expense" && <ExpenseChart />}
        {type === "tasks" && <TaskChart />}
      </div>
    </DialogContent>
  </Dialog>
);

export default AnalyticsModal;
