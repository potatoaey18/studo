import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";
import { Course, StudySession, Task, Exam, KanbanTask, Expense, ResearchSource, Resource } from "./demoData";

export interface ClassSlot {
  id: string;
  courseId: string;
  day: string;
  startHour: number;
  endHour: number;
  location: string;
}

export interface Project {
  id: string;
  name: string;
  inviteCode: string;
  members: string[];
}

interface DataContextType {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  sessions: StudySession[];
  setSessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  exams: (Exam & { status: string })[];
  setExams: React.Dispatch<React.SetStateAction<(Exam & { status: string })[]>>;
  kanbanTasks: KanbanTask[];
  setKanbanTasks: React.Dispatch<React.SetStateAction<KanbanTask[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  researchSources: ResearchSource[];
  setResearchSources: React.Dispatch<React.SetStateAction<ResearchSource[]>>;
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
  classSlots: ClassSlot[];
  setClassSlots: React.Dispatch<React.SetStateAction<ClassSlot[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  getCourse: (id: string) => Course | undefined;
  getCourseOptions: () => { id: string; label: string }[];
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

const mapCourse   = (r: any): Course        => ({ id: r.id, name: r.name, code: r.code, professor: r.professor, schedule: r.schedule, color: r.color });
const mapSession  = (r: any): StudySession  => ({ id: r.id, courseId: r.course_id, date: r.date, hours: r.hours, topic: r.topic });
const mapTask     = (r: any): Task          => ({ id: r.id, title: r.title, courseId: r.course_id, dueDate: r.due_date, completed: r.completed, priority: r.priority, type: r.type });
const mapExam     = (r: any)                => ({ id: r.id, subject: r.subject, date: r.date, location: r.location, notes: r.notes, status: r.status ?? "upcoming" });
const mapKanban   = (r: any): KanbanTask    => ({ id: r.id, title: r.title, description: r.description, assignee: r.assignee, dueDate: r.due_date, status: r.status, project: r.project });
const mapExpense  = (r: any): Expense       => ({ id: r.id, description: r.description, amount: r.amount, category: r.category, date: r.date });
const mapResearch = (r: any): ResearchSource => ({ id: r.id, title: r.title, author: r.author, type: r.type, url: r.url, notes: r.notes });
const mapResource = (r: any): Resource      => ({ id: r.id, title: r.title, type: r.type, url: r.url, course: r.course, notes: r.notes });
const mapSlot     = (r: any): ClassSlot     => ({ id: r.id, courseId: r.course_id, day: r.day, startHour: r.start_hour, endHour: r.end_hour, location: r.location });
const mapProject  = (r: any): Project       => ({ id: r.id, name: r.name, inviteCode: r.invite_code, members: r.members ?? [] });

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses]                 = useState<Course[]>([]);
  const [sessions, setSessions]               = useState<StudySession[]>([]);
  const [tasks, setTasks]                     = useState<Task[]>([]);
  const [exams, setExams]                     = useState<(Exam & { status: string })[]>([]);
  const [kanbanTasks, setKanbanTasks]         = useState<KanbanTask[]>([]);
  const [expenses, setExpenses]               = useState<Expense[]>([]);
  const [researchSources, setResearchSources] = useState<ResearchSource[]>([]);
  const [resources, setResources]             = useState<Resource[]>([]);
  const [classSlots, setClassSlots]           = useState<ClassSlot[]>([]);
  const [projects, setProjects]               = useState<Project[]>([]);
  const [loading, setLoading]                 = useState(true);

  // Initial data load
  useEffect(() => {
    const load = async () => {
      const [c, s, t, e, k, ex, rs, re, cs, p] = await Promise.all([
        supabase.from("courses").select("*"),
        supabase.from("study_sessions").select("*"),
        supabase.from("tasks").select("*"),
        supabase.from("exams").select("*"),
        supabase.from("kanban_tasks").select("*"),
        supabase.from("expenses").select("*"),
        supabase.from("research_sources").select("*"),
        supabase.from("resources").select("*"),
        supabase.from("class_slots").select("*"),
        supabase.from("projects").select("*"),
      ]);

      setCourses((c.data ?? []).map(mapCourse));
      setSessions((s.data ?? []).map(mapSession));
      setTasks((t.data ?? []).map(mapTask));
      setExams((e.data ?? []).map(mapExam));
      setKanbanTasks((k.data ?? []).map(mapKanban));
      setExpenses((ex.data ?? []).map(mapExpense));
      setResearchSources((rs.data ?? []).map(mapResearch));
      setResources((re.data ?? []).map(mapResource));
      setClassSlots((cs.data ?? []).map(mapSlot));
      setProjects((p.data ?? []).map(mapProject));
      setLoading(false);
    };

    load();
  }, []);

  // Realtime kanban sync
  useEffect(() => {
    const channel = supabase
      .channel("kanban-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "kanban_tasks" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setKanbanTasks((ts) => [...ts, mapKanban(payload.new)]);
        } else if (payload.eventType === "UPDATE") {
          setKanbanTasks((ts) => ts.map((t) => t.id === payload.new.id ? mapKanban(payload.new) : t));
        } else if (payload.eventType === "DELETE") {
          setKanbanTasks((ts) => ts.filter((t) => t.id !== (payload.old as any).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const getCourse = (id: string) => courses.find((c) => c.id === id);
  const getCourseOptions = () => courses.map((c) => ({ id: c.id, label: `${c.code} – ${c.name}` }));

  return (
    <DataContext.Provider value={{
      courses, setCourses, sessions, setSessions, tasks, setTasks,
      exams, setExams, kanbanTasks, setKanbanTasks, expenses, setExpenses,
      researchSources, setResearchSources, resources, setResources,
      classSlots, setClassSlots, projects, setProjects,
      getCourse, getCourseOptions, loading,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}