import { useState } from "react";
import { demoExpenses, Expense } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import DynamicSelect from "@/components/DynamicSelect";

const categories = ["Books", "Food", "Supplies", "Transport", "Subscriptions", "Other"];

const EditableExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(demoExpenses);

  const update = (id: string, field: keyof Expense, value: string | number) => {
    setExpenses((es) => es.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const add = () => {
    setExpenses((es) => [...es, { id: `x${Date.now()}`, description: "", amount: 0, category: "", date: new Date().toISOString().split("T")[0] }]);
  };

  const remove = (id: string) => setExpenses((es) => es.filter((e) => e.id !== id));
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">${total.toFixed(2)}</span></p>
      {expenses.map((e) => (
        <Card key={e.id} className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Description" value={e.description} onChange={(ev) => update(e.id, "description", ev.target.value)} className="font-medium" />
            <Button variant="ghost" size="icon" onClick={() => remove(e.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input type="number" placeholder="Amount" value={e.amount} onChange={(ev) => update(e.id, "amount", parseFloat(ev.target.value) || 0)} />
            <DynamicSelect options={categories} value={e.category} onChange={(v) => update(e.id, "category", v)} placeholder="Category" />
            <Input type="date" value={e.date} onChange={(ev) => update(e.id, "date", ev.target.value)} />
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full">
        <Plus className="h-3.5 w-3.5" /> Add Expense
      </Button>
    </div>
  );
};

export default EditableExpenses;
