import { useState } from "react";
import { useData } from "@/lib/dataContext";
import { Expense } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const categories = ["Books", "Food", "Supplies", "Transport", "Subscriptions", "Other"];

const COLORS = [
  "hsl(var(--foreground))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--accent-foreground))",
  "hsl(var(--secondary-foreground))",
  "hsl(var(--primary))",
  "hsl(var(--destructive))",
];

const fields: FieldConfig[] = [
  { key: "description", label: "Description", placeholder: "What was it for?" },
  { key: "amount", label: "Amount ($)", type: "number", placeholder: "0" },
  { key: "category", label: "Category", type: "select", options: categories },
  { key: "date", label: "Date", type: "date" },
];

const ExpensesModule = () => {
  const { expenses, setExpenses } = useData();
  const [selected, setSelected] = useState<Expense | null>(null);

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setExpenses((es) => es.map((e) => (e.id === updated.id ? updated : e)));
  };

  const add = () => {
    const e: Expense = { id: `x${Date.now()}`, description: "", amount: 0, category: "", date: new Date().toISOString().split("T")[0] };
    setExpenses((es) => [e, ...es]);
    setSelected(e);
  };

  const remove = (id: string) => {
    setExpenses((es) => es.filter((e) => e.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  // Category distribution
  const categoryData = categories
    .map((cat) => ({
      name: cat,
      value: parseFloat(expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0).toFixed(2)),
    }))
    .filter((d) => d.value > 0);

  // Monthly trends
  const monthMap = new Map<string, number>();
  expenses.forEach((e) => {
    const month = e.date.slice(0, 7); // YYYY-MM
    monthMap.set(month, (monthMap.get(month) || 0) + e.amount);
  });
  const monthlyData = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount: parseFloat(amount.toFixed(2)) }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Expense Tracker</h2>
          <p className="text-xs text-muted-foreground">Total: ${total.toFixed(2)}</p>
        </div>
        <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Expense
        </Button>
      </div>

      {/* Analytics */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryData.length > 0 && (
            <Card className="p-5">
              <h3 className="font-display font-semibold text-sm mb-3">By Category</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `$${v.toFixed(2)}`}
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          )}
          {monthlyData.length > 0 && (
            <Card className="p-5">
              <h3 className="font-display font-semibold text-sm mb-3">Monthly Spending</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    formatter={(v: number) => `$${v.toFixed(2)}`}
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </div>
      )}

      <div className="grid gap-2">
        {sorted.map((e) => (
          <Card
            key={e.id}
            className="p-3 cursor-pointer hover:ring-1 hover:ring-ring/20 transition-all group flex items-center justify-between"
            onClick={() => setSelected(e)}
          >
            <div>
              <p className="text-sm font-medium">{e.description || "Untitled"}</p>
              <p className="text-xs text-muted-foreground">{e.category} · {e.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold">${e.amount.toFixed(2)}</span>
              <Button
                variant="ghost" size="icon"
                onClick={(ev) => { ev.stopPropagation(); remove(e.id); }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity h-7 w-7"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <ItemModal open={!!selected} onClose={() => setSelected(null)} title="Expense Details" item={selected} fields={fields} onUpdate={update} />
    </div>
  );
};

export default ExpensesModule;
