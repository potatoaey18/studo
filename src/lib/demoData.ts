export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  schedule: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  courseId: string;
  dueDate: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  type: string;
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  location: string;
  notes: string;
}

export interface StudySession {
  id: string;
  courseId: string;
  date: string;
  hours: number;
  topic: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: "todo" | "in-progress" | "completed";
  project: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface ResearchSource {
  id: string;
  title: string;
  author: string;
  type: string;
  url: string;
  notes: string;
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  course: string;
  notes?: string;
}

export const demoCourses: Course[] = [
  { id: "c1", name: "Data Structures", code: "CS201", professor: "Dr. Kim", schedule: "MWF 9:00 AM", color: "bg-secondary" },
  { id: "c2", name: "Calculus II", code: "MATH202", professor: "Dr. Patel", schedule: "TTh 10:30 AM", color: "bg-accent" },
  { id: "c3", name: "Technical Writing", code: "ENG105", professor: "Prof. Santos", schedule: "MWF 1:00 PM", color: "bg-muted" },
  { id: "c4", name: "Physics I", code: "PHY101", professor: "Dr. Rivera", schedule: "TTh 2:00 PM", color: "bg-secondary" },
];

export const demoTasks: Task[] = [
  { id: "t1", title: "Binary Tree Implementation", courseId: "c1", dueDate: "2026-04-10", completed: false, priority: "high", type: "Assignment" },
  { id: "t2", title: "Integration Problem Set", courseId: "c2", dueDate: "2026-04-08", completed: false, priority: "medium", type: "Homework" },
  { id: "t3", title: "Research Paper Draft", courseId: "c3", dueDate: "2026-04-15", completed: false, priority: "high", type: "Paper" },
  { id: "t4", title: "Lab Report: Kinematics", courseId: "c4", dueDate: "2026-04-12", completed: true, priority: "medium", type: "Lab" },
  { id: "t5", title: "Hash Table Quiz Prep", courseId: "c1", dueDate: "2026-04-06", completed: true, priority: "low", type: "Study" },
  { id: "t6", title: "Series Convergence Review", courseId: "c2", dueDate: "2026-04-20", completed: false, priority: "low", type: "Review" },
];

export const demoExams: Exam[] = [
  { id: "e1", subject: "Data Structures", date: "2026-04-18", location: "Room 301", notes: "Covers trees, graphs, hashing" },
  { id: "e2", subject: "Calculus II", date: "2026-04-22", location: "Auditorium B", notes: "Integration techniques, series" },
  { id: "e3", subject: "Physics I", date: "2026-04-25", location: "Lab 105", notes: "Mechanics, kinematics, dynamics" },
];

export const demoStudySessions: StudySession[] = [
  { id: "s1", courseId: "c1", date: "2026-04-01", hours: 2.5, topic: "Binary Trees" },
  { id: "s2", courseId: "c2", date: "2026-04-01", hours: 1.5, topic: "Taylor Series" },
  { id: "s3", courseId: "c1", date: "2026-04-02", hours: 3, topic: "Graph Traversal" },
  { id: "s4", courseId: "c3", date: "2026-04-02", hours: 1, topic: "Citation Styles" },
  { id: "s5", courseId: "c4", date: "2026-04-03", hours: 2, topic: "Newton's Laws" },
  { id: "s6", courseId: "c2", date: "2026-04-03", hours: 2, topic: "Integration by Parts" },
  { id: "s7", courseId: "c1", date: "2026-04-04", hours: 1.5, topic: "Hash Tables" },
];

export const demoKanbanTasks: KanbanTask[] = [
  { id: "k1", title: "Design wireframes", description: "Create low-fidelity wireframes for the app", assignee: "Alex", dueDate: "2026-04-08", status: "completed", project: "Mobile App" },
  { id: "k2", title: "Set up database schema", description: "Design and implement the database tables", assignee: "Jordan", dueDate: "2026-04-10", status: "in-progress", project: "Mobile App" },
  { id: "k3", title: "Implement auth flow", description: "Add login and registration screens", assignee: "Sam", dueDate: "2026-04-12", status: "todo", project: "Mobile App" },
  { id: "k4", title: "Write API endpoints", description: "Create REST endpoints for CRUD operations", assignee: "Alex", dueDate: "2026-04-14", status: "todo", project: "Mobile App" },
  { id: "k5", title: "Literature review", description: "Review 10 related papers", assignee: "Jordan", dueDate: "2026-04-09", status: "in-progress", project: "Research Project" },
  { id: "k6", title: "Data collection", description: "Gather survey responses from participants", assignee: "Sam", dueDate: "2026-04-16", status: "todo", project: "Research Project" },
];

export const demoExpenses: Expense[] = [
  { id: "x1", description: "Textbook: Data Structures", amount: 85, category: "Books", date: "2026-03-15" },
  { id: "x2", description: "Coffee & snacks", amount: 12.5, category: "Food", date: "2026-04-01" },
  { id: "x3", description: "Printer paper", amount: 8, category: "Supplies", date: "2026-04-02" },
  { id: "x4", description: "Bus pass (April)", amount: 45, category: "Transport", date: "2026-04-01" },
  { id: "x5", description: "Online course subscription", amount: 15, category: "Subscriptions", date: "2026-04-03" },
  { id: "x6", description: "Lab equipment", amount: 32, category: "Supplies", date: "2026-03-28" },
];

export const demoResearchSources: ResearchSource[] = [
  { id: "r1", title: "Efficient Graph Algorithms", author: "Lee, M.", type: "Journal", url: "https://example.com/graph", notes: "Key algorithms for project" },
  { id: "r2", title: "Modern Data Structures", author: "Chen, W.", type: "Book", url: "https://example.com/ds", notes: "Reference for hash tables chapter" },
  { id: "r3", title: "Student Productivity Study", author: "Garcia, A.", type: "Paper", url: "https://example.com/prod", notes: "Background for research paper" },
];

export const demoResources: Resource[] = [
  { id: "re1", title: "CS201 Lecture Slides", type: "PDF", url: "#", course: "Data Structures" },
  { id: "re2", title: "Khan Academy: Integration", type: "Video", url: "#", course: "Calculus II" },
  { id: "re3", title: "Purdue OWL Citation Guide", type: "Website", url: "#", course: "Technical Writing" },
  { id: "re4", title: "Physics Simulations", type: "Interactive", url: "#", course: "Physics I" },
];

export const demoNotifications = [
  { id: "n1", title: "Exam in 14 days", message: "Data Structures exam on April 18", time: "2 hours ago", read: false },
  { id: "n2", title: "Task due soon", message: "Integration Problem Set due April 8", time: "5 hours ago", read: false },
  { id: "n3", title: "Study reminder", message: "You planned to study Graph Traversal today", time: "1 day ago", read: true },
];
