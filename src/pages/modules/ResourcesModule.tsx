import { useState } from "react";
import { useData } from "@/lib/dataContext";
import { Resource } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";
import DynamicSelect from "@/components/DynamicSelect";

const types = ["PDF", "Video", "Website", "Interactive", "Other"];

const ResourcesModule = () => {
  const { resources, setResources, courses } = useData();
  const [selected, setSelected] = useState<Resource | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const fields: FieldConfig[] = [
    { key: "title", label: "Title", placeholder: "Resource title" },
    { key: "type", label: "Type", type: "select", options: types },
    { key: "url", label: "URL", placeholder: "https://..." },
    { key: "course", label: "Course", type: "select", options: courses.map((c) => c.name) },
  ];

  const filtered = courseFilter === "all" ? resources : resources.filter((r) => r.course === courses.find((c) => c.id === courseFilter)?.name);

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setResources((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
  };

  const add = () => {
    const r: Resource = { id: `re${Date.now()}`, title: "", type: "", url: "", course: "" };
    setResources((rs) => [r, ...rs]);
    setSelected(r);
  };

  const remove = (id: string) => {
    setResources((rs) => rs.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Resource Hub</h2>
        <div className="flex items-center gap-2">
          <DynamicSelect
            options={["All Courses", ...courses.map((c) => c.code)]}
            value={courseFilter === "all" ? "All Courses" : courses.find((c) => c.id === courseFilter)?.code || "All Courses"}
            onChange={(v) => {
              if (v === "All Courses") setCourseFilter("all");
              else { const c = courses.find((c) => c.code === v); if (c) setCourseFilter(c.id); }
            }}
            placeholder="Filter"
          />
          <Button variant="outline" size="sm" onClick={add} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Resource
          </Button>
        </div>
      </div>
      <div className="grid gap-2">
        {[...filtered].reverse().map((r) => (
          <Card
            key={r.id}
            className="p-3 cursor-pointer hover:ring-1 hover:ring-ring/20 transition-all group flex items-center justify-between"
            onClick={() => setSelected(r)}
          >
            <div>
              <p className="text-sm font-medium flex items-center gap-1.5">
                {r.title || "Untitled"} <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </p>
              <p className="text-xs text-muted-foreground">{r.course}</p>
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
      <ItemModal open={!!selected} onClose={() => setSelected(null)} title="Resource Details" item={selected} fields={fields} onUpdate={update} />
    </div>
  );
};

export default ResourcesModule;
