import { createContext, useContext, useState, ReactNode } from "react";
import {
  Course, demoCourses,
  StudySession, demoStudySessions,
  Task, demoTasks,
  Exam, demoExams,
  KanbanTask, demoKanbanTasks,
  Expense, demoExpenses,
  ResearchSource, demoResearchSources,
  Resource, demoResources,
} from "./demoData";

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

function parseScheduleToSlots(courses: Course[]): ClassSlot[] {
  const slots: ClassSlot[] = [];
  courses.forEach((c) => {
    const parts = c.schedule.split(" ");
    const dayCode = parts[0];
    const timeStr = parts.slice(1).join(" ");
    const hour = parseTimeToHour(timeStr);
    const days: string[] = [];
    if (dayCode === "TTh") { days.push("Tuesday", "Thursday"); }
    else if (dayCode === "MWF") { days.push("Monday", "Wednesday", "Friday"); }
    else {
      if (dayCode.includes("M")) days.push("Monday");
      if (dayCode.includes("W")) days.push("Wednesday");
      if (dayCode.includes("F")) days.push("Friday");
      if (dayCode.includes("T")) days.push("Tuesday");
    }
    days.forEach((d) => {
      slots.push({ id: `cs-${c.id}-${d}`, courseId: c.id, day: d, startHour: hour, endHour: hour + 1, location: "" });
    });
  });
  return slots;
}

function parseTimeToHour(t: string): number {
  const match = t.match(/(\d+):?(\d*)\s*(AM|PM)?/i);
  if (!match) return 9;
  let h = parseInt(match[1]);
  if (match[3]?.toUpperCase() === "PM" && h !== 12) h += 12;
  if (match[3]?.toUpperCase() === "AM" && h === 12) h = 0;
  return h;
}

const defaultProjects: Project[] = [
  { id: "p1", name: "Mobile App", inviteCode: "STUDO-MA-2026", members: ["Alex", "Jordan", "Sam"] },
  { id: "p2", name: "Research Project", inviteCode: "STUDO-RP-2026", members: ["Jordan", "Sam"] },
];

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
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(demoCourses);
  const [sessions, setSessions] = useState<StudySession[]>(demoStudySessions);
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [exams, setExams] = useState<(Exam & { status: string })[]>(
    demoExams.map((e) => ({ ...e, status: "upcoming" }))
  );
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(demoKanbanTasks);
  const [expenses, setExpenses] = useState<Expense[]>(demoExpenses);
  const [researchSources, setResearchSources] = useState<ResearchSource[]>(demoResearchSources);
  const [resources, setResources] = useState<Resource[]>(demoResources);
  const [classSlots, setClassSlots] = useState<ClassSlot[]>(parseScheduleToSlots(demoCourses));
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  const getCourse = (id: string) => courses.find((c) => c.id === id);
  const getCourseOptions = () => courses.map((c) => ({ id: c.id, label: `${c.code} – ${c.name}` }));

  return (
    <DataContext.Provider value={{
      courses, setCourses, sessions, setSessions, tasks, setTasks,
      exams, setExams, kanbanTasks, setKanbanTasks, expenses, setExpenses,
      researchSources, setResearchSources, resources, setResources,
      classSlots, setClassSlots, projects, setProjects,
      getCourse, getCourseOptions,
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
