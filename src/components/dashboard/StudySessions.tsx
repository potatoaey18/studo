import { demoStudySessions, demoCourses } from "@/lib/demoData";
import { Card } from "@/components/ui/card";

const StudySessions = () => {
  const getCourse = (id: string) => demoCourses.find((c) => c.id === id);
  const totalHours = demoStudySessions.reduce((s, ss) => s + ss.hours, 0);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">{totalHours}h</span></p>
      {demoStudySessions.map((s) => {
        const course = getCourse(s.courseId);
        return (
          <Card key={s.id} className="p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{s.topic}</p>
              <p className="text-xs text-muted-foreground">{course?.code} · {s.date}</p>
            </div>
            <p className="font-display font-semibold text-sm">{s.hours}h</p>
          </Card>
        );
      })}
    </div>
  );
};

export default StudySessions;
