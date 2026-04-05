import { useState } from "react";
import { demoExpenses, Expense } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import DynamicSelect from "@/components/DynamicSelect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const categories = ["Books", "Food", "Supplies", "Transport", "Subscriptions"];

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>(demoExpenses);
  const [adding, setAdding] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCat, setNewCat] = useState("");

  const addExpense = () => {
    if (!newDesc || !newAmount || !newCat) return;
    setExpenses((es) => [...es, {
      id: `x${Date.now()}`, description: newDesc, amount: parseFloat(newAmount),
      category: newCat, date: new Date().toISOString().split("T")[0],
    }]);
    setNewDesc(""); setNewAmount(""); setNewCat(""); setAdding(false);
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">PHP{total.toFixed(2)}</span></p>
        <Button variant="outline" size="sm" onClick={() => setAdding(!adding)} className="gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      {adding && (
        <Card className="p-3 space-y-2 animate-fade-in">
          <Input placeholder="Description" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <Input placeholder="Amount" type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
          <DynamicSelect options={categories} value={newCat} onChange={setNewCat} placeholder="Category" />
          <Button size="sm" onClick={addExpense}>Save</Button>
        </Card>
      )}
      {expenses.map((e) => (
        <Card key={e.id} className="p-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{e.description}</p>
            <p className="text-xs text-muted-foreground">{e.category} · {e.date}</p>
          </div>
          <p className="font-display font-semibold text-sm">PHP{e.amount.toFixed(2)}</p>
        </Card>
      ))}
    </div>
  );
};

export default ExpenseList;
