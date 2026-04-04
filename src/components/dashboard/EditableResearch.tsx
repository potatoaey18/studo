import { useState } from "react";
import { demoResearchSources, ResearchSource } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import DynamicSelect from "@/components/DynamicSelect";

const types = ["Journal", "Book", "Paper", "Website", "Other"];

const EditableResearch = () => {
  const [sources, setSources] = useState<ResearchSource[]>(demoResearchSources);

  const update = (id: string, field: keyof ResearchSource, value: string) => {
    setSources((ss) => ss.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const add = () => {
    setSources((ss) => [...ss, { id: `r${Date.now()}`, title: "", author: "", type: "", url: "", notes: "" }]);
  };

  const remove = (id: string) => setSources((ss) => ss.filter((s) => s.id !== id));

  return (
    <div className="space-y-3">
      {sources.map((r) => (
        <Card key={r.id} className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Title" value={r.title} onChange={(e) => update(r.id, "title", e.target.value)} className="font-medium" />
            <Button variant="ghost" size="icon" onClick={() => remove(r.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Author" value={r.author} onChange={(e) => update(r.id, "author", e.target.value)} />
            <DynamicSelect options={types} value={r.type} onChange={(v) => update(r.id, "type", v)} placeholder="Type" />
            <Input placeholder="URL" value={r.url} onChange={(e) => update(r.id, "url", e.target.value)} />
          </div>
          <Textarea placeholder="Notes" value={r.notes} onChange={(e) => update(r.id, "notes", e.target.value)} rows={2} />
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full">
        <Plus className="h-3.5 w-3.5" /> Add Source
      </Button>
    </div>
  );
};

export default EditableResearch;
