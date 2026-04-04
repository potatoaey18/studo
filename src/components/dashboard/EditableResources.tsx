import { useState } from "react";
import { demoResources, Resource } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import DynamicSelect from "@/components/DynamicSelect";

const types = ["PDF", "Video", "Website", "Interactive", "Other"];

const EditableResources = () => {
  const [resources, setResources] = useState<Resource[]>(demoResources);

  const update = (id: string, field: keyof Resource, value: string) => {
    setResources((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const add = () => {
    setResources((rs) => [...rs, { id: `re${Date.now()}`, title: "", type: "", url: "", course: "" }]);
  };

  const remove = (id: string) => setResources((rs) => rs.filter((r) => r.id !== id));

  return (
    <div className="space-y-3">
      {resources.map((r) => (
        <Card key={r.id} className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Title" value={r.title} onChange={(e) => update(r.id, "title", e.target.value)} className="font-medium" />
            <Button variant="ghost" size="icon" onClick={() => remove(r.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <DynamicSelect options={types} value={r.type} onChange={(v) => update(r.id, "type", v)} placeholder="Type" />
            <Input placeholder="URL" value={r.url} onChange={(e) => update(r.id, "url", e.target.value)} />
            <Input placeholder="Course" value={r.course} onChange={(e) => update(r.id, "course", e.target.value)} />
          </div>
        </Card>
      ))}
      <Button variant="outline" size="sm" onClick={add} className="gap-1.5 w-full">
        <Plus className="h-3.5 w-3.5" /> Add Resource
      </Button>
    </div>
  );
};

export default EditableResources;
