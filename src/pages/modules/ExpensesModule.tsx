import { useState } from "react";
import { demoExpenses, Expense } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";

const categories = ["Books", "Food", "Supplies", "Transport", "Subscriptions", "Other"];

const fields: FieldConfig[] = [
  { key: "description", label: "Description", placeholder: "What was it for?" },
  { key: "amount", label: "Amount ($)", type: "number", placeholder: "0" },
  { key: "category", label: "Category", type: "select", options: categories },
  { key: "date", label: "Date", type: "date" },
];

const ExpensesModule = () => {
  const [expenses, setExpenses] = useState<Expense[]>(demoExpenses);
  const [selected, setSelected] = useState<Expense | null>(null);

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setExpenses((es) => es.map((e) => (e.id === updated.id ? updated : e)));
  };

  const add = () => {
    const e: Expense = { id: `x${Date.now()}`, description: "", amount: 0, category: "", date: new Date().toISOString().split("T")[0] };
    setExpenses((es) => [...es, e]);
    setSelected(e);
  };

  const remove = (id: string) => {
    setExpenses((es) => es.filter((e) => e.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

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
      <div className="grid gap-2">
        {expenses.map((e) => (
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
