import { useState } from "react";
import { demoResearchSources, ResearchSource } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";

const types = ["Journal", "Book", "Paper", "Website", "Other"];

const fields: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "Source title" },
  { key: "author", label: "Author", placeholder: "Author name" },
  { key: "type", label: "Type", type: "select", options: types },
  { key: "url", label: "URL", placeholder: "https://..." },
  { key: "notes", label: "Notes", type: "textarea", placeholder: "Your notes..." },
];

const ResearchModule = () => {
  const [sources, setSources] = useState<ResearchSource[]>(demoResearchSources);
  const [selected, setSelected] = useState<ResearchSource | null>(null);

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setSources((ss) => ss.map((s) => (s.id === updated.id ? updated : s)));
  };

  const add = () => {
    const s: ResearchSource = { id: `r${Date.now()}`, title: "", author: "", type: "", url: "", notes: "" };
    setSources((ss) => [...ss, s]);
    setSelected(s);
  };

  const remove = (id: string) => {
    setSources((ss) => ss.filter((s) => s.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Research Organizer</h2>
        <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Source
        </Button>
      </div>
      <div className="grid gap-2">
        {sources.map((r) => (
          <Card
            key={r.id}
            className="p-3 cursor-pointer hover:ring-1 hover:ring-ring/20 transition-all group flex items-center justify-between"
            onClick={() => setSelected(r)}
          >
            <div>
              <p className="text-sm font-medium">{r.title || "Untitled"}</p>
              <p className="text-xs text-muted-foreground">{r.author}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
              <Button
                variant="ghost" size="icon"
                onClick={(ev) => { ev.stopPropagation(); remove(r.id); }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity h-7 w-7"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <ItemModal open={!!selected} onClose={() => setSelected(null)} title="Source Details" item={selected} fields={fields} onUpdate={update} />
    </div>
  );
};

export default ResearchModule;
