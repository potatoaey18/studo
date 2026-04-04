import { demoStudySessions, demoCourses } from "@/lib/demoData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StudyChart = () => {
  const courseHours = demoCourses.map((c) => ({
    name: c.code,
    hours: demoStudySessions.filter((s) => s.courseId === c.id).reduce((sum, s) => sum + s.hours, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={courseHours}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
        <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StudyChart;
