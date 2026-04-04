import { demoCourses } from "@/lib/demoData";
import { Card } from "@/components/ui/card";

const CourseList = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {demoCourses.map((c) => (
      <Card key={c.id} className="p-4">
        <p className="font-display font-semibold text-sm">{c.name}</p>
        <p className="text-xs text-muted-foreground">{c.code} · {c.professor}</p>
        <p className="text-xs text-muted-foreground mt-1">{c.schedule}</p>
      </Card>
    ))}
  </div>
);

export default CourseList;
