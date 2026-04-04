import { useState } from "react";
import { demoTasks, demoCourses } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const TaskList = () => {
  const [tasks, setTasks] = useState(demoTasks);

  const toggleTask = (id: string) => {
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const getCourse = (id: string) => demoCourses.find((c) => c.id === id);

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const course = getCourse(task.courseId);
        return (
          <Card key={task.id} className={`p-3 flex items-center gap-3 ${task.completed ? "opacity-50" : ""}`}>
            <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.completed ? "line-through" : ""}`}>{task.title}</p>
              <p className="text-xs text-muted-foreground">{course?.code} · Due {task.dueDate}</p>
            </div>
            <Badge variant={task.priority === "high" ? "destructive" : "secondary"} className="text-[10px]">
              {task.priority}
            </Badge>
          </Card>
        );
      })}
    </div>
  );
};

export default TaskList;
