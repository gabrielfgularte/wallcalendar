export type Postit = {
  id: string;
  title: string;
  description?: string;
  time?: string; // "14:00"
};

export type StickyCalendarData = Record<string, Postit[]>; // YYYY-MM-DD -> Postit[]

export type Todo = {
  id: string;
  title: string;
  description?: string;
  dateKey?: string; // YYYY-MM-DD (opcional)
  time?: string; // "14:00" (opcional)
  completedAt?: string; // ISO string
};

export type TodosData = Record<string, Todo>; // id -> Todo
