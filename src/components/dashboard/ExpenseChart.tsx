import { demoExpenses } from "@/lib/demoData";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))", "hsl(var(--ring))", "hsl(var(--border))", "hsl(var(--accent-foreground))"];

const ExpenseChart = () => {
  const categories: Record<string, number> = {};
  demoExpenses.forEach((e) => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });
  const data = Object.entries(categories).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={40} outerRadius={70} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="font-medium">PHP{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseChart;
