import { demoCourses } from "@/lib/demoData";
import { Card } from "@/components/ui/card";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const scheduleMap: Record<string, { day: string; time: string }[]> = {};
demoCourses.forEach((c) => {
  const parts = c.schedule.split(" ");
  const dayCode = parts[0];
  const time = parts.slice(1).join(" ");
  const dayList: string[] = [];
  if (dayCode.includes("M")) dayList.push("Monday");
  if (dayCode.includes("T") && dayCode.includes("Th")) {
    dayList.push("Thursday");
    if (dayCode.replace("Th", "").includes("T")) dayList.push("Tuesday");
  } else if (dayCode.includes("T")) {
    dayList.push("Tuesday");
  }
  if (dayCode.includes("W")) dayList.push("Wednesday");
  if (dayCode.includes("F")) dayList.push("Friday");
  // Handle TTh pattern
  if (dayCode === "TTh") {
    scheduleMap[c.id] = [{ day: "Tuesday", time }, { day: "Thursday", time }];
  } else {
    scheduleMap[c.id] = dayList.map((d) => ({ day: d, time }));
  }
});

const ClassScheduleModule = () => {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-semibold">Class Schedule</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {days.map((day) => (
          <div key={day}>
            <h4 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{day}</h4>
            <div className="space-y-2">
              {demoCourses
                .filter((c) => scheduleMap[c.id]?.some((s) => s.day === day))
                .map((c) => {
                  const slot = scheduleMap[c.id]?.find((s) => s.day === day);
                  return (
                    <Card key={c.id} className="p-3">
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground">{c.code} · {slot?.time}</p>
                      <p className="text-[10px] text-muted-foreground">{c.professor}</p>
                    </Card>
                  );
                })}
              {!demoCourses.some((c) => scheduleMap[c.id]?.some((s) => s.day === day)) && (
                <p className="text-xs text-muted-foreground/50 italic">No classes</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassScheduleModule;
