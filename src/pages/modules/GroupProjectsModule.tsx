import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useData, Project } from "@/lib/dataContext";
import { KanbanTask } from "@/lib/demoData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Copy, Trash2, Users, ChevronDown, ChevronRight, Link } from "lucide-react";
import ItemModal, { FieldConfig } from "@/components/dashboard/ItemModal";
import { toast } from "sonner";

const columns: { id: KanbanTask["status"]; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

const fields: FieldConfig[] = [
  { key: "title", label: "Title", placeholder: "Task title" },
  { key: "description", label: "Description", type: "textarea", placeholder: "Details..." },
  { key: "assignee", label: "Assignee", placeholder: "Name" },
  { key: "dueDate", label: "Due Date", type: "date" },
];

function generateToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const GroupProjectsModule = () => {
  const { kanbanTasks, setKanbanTasks, projects, setProjects } = useData();
  const [selected, setSelected] = useState<KanbanTask | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || "");
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const projectTasks = kanbanTasks.filter((t) => t.project === activeProject?.name);

  const getInviteUrl = (token: string) => `https://studo.app/project/invite/${token}`;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as KanbanTask["status"];
    setKanbanTasks((ts) => ts.map((t) => (t.id === result.draggableId ? { ...t, status: newStatus } : t)));
  };

  const update = (key: string, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [key]: value };
    setSelected(updated);
    setKanbanTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
  };

  const addTask = () => {
    if (!activeProject) return;
    const t: KanbanTask = {
      id: `k${Date.now()}`, title: "", description: "", assignee: "",
      dueDate: "", status: "todo", project: activeProject.name,
    };
    setKanbanTasks((ts) => [t, ...ts]);
    setSelected(t);
  };

  const addProject = () => {
    if (!newProjectName.trim()) return;
    const p: Project = {
      id: `p${Date.now()}`,
      name: newProjectName.trim(),
      inviteCode: generateToken(),
      members: ["You"],
    };
    setProjects((ps) => [p, ...ps]);
    setActiveProjectId(p.id);
    setNewProjectName("");
  };

  const removeProject = (id: string) => {
    const p = projects.find((pr) => pr.id === id);
    if (p) setKanbanTasks((ts) => ts.filter((t) => t.project !== p.name));
    setProjects((ps) => ps.filter((pr) => pr.id !== id));
    if (activeProjectId === id) setActiveProjectId(projects.find((pr) => pr.id !== id)?.id || "");
  };

  const copyInviteLink = (code: string) => {
    navigator.clipboard.writeText(getInviteUrl(code));
    toast.success("Invite link copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Group Projects</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowProjectPanel(!showProjectPanel)} className="gap-1.5">
            {showProjectPanel ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            Projects ({projects.length})
          </Button>
          <Button variant="outline" size="sm" onClick={addTask} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Task
          </Button>
        </div>
      </div>

      {showProjectPanel && (
        <Card className="p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="New project name"
              onKeyDown={(e) => e.key === "Enter" && addProject()}
              className="flex-1"
            />
            <Button size="sm" onClick={addProject}>Create</Button>
          </div>
          <div className="grid gap-2">
            {projects.map((p) => (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors group ${
                  activeProjectId === p.id ? "bg-accent" : "hover:bg-muted/50"
                }`}
                onClick={() => setActiveProjectId(p.id)}
              >
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> {p.members.join(", ")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost" size="icon"
                    onClick={(e) => { e.stopPropagation(); copyInviteLink(p.inviteCode); }}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    title="Copy invite link"
                  >
                    <Link className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    onClick={(e) => { e.stopPropagation(); removeProject(p.id); }}
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeProject && (
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="secondary" className="text-xs">{activeProject.name}</Badge>
          <button
            onClick={() => copyInviteLink(activeProject.inviteCode)}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Link className="h-3 w-3" />
            {getInviteUrl(activeProject.inviteCode).slice(0, 50)}…
          </button>
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyInviteLink(activeProject.inviteCode)}>
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Kanban */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const colTasks = projectTasks.filter((t) => t.status === col.id);
            return (
              <Droppable key={col.id} droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl p-3 min-h-[120px] transition-colors ${snapshot.isDraggingOver ? "bg-accent/70" : "bg-muted/30"}`}
                  >
                    <h4 className="font-display font-semibold text-xs mb-3 text-muted-foreground uppercase tracking-wider">
                      {col.label} ({colTasks.length})
                    </h4>
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 mb-2 cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-ring/20 transition-shadow"
                            onClick={() => setSelected(task)}
                          >
                            <p className="text-sm font-medium">{task.title || "Untitled"}</p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="secondary" className="text-[10px]">{task.assignee || "Unassigned"}</Badge>
                              <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <ItemModal open={!!selected} onClose={() => setSelected(null)} title="Task Details" item={selected} fields={fields} onUpdate={update} />
    </div>
  );
};

export default GroupProjectsModule;
