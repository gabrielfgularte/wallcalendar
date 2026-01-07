import { useEffect, useMemo, useState } from "react";
import CalendarGrid from "./components/CalendarGrid";
import SidebarPostits from "./components/SidebarPostits";
import ThemeToggle from "./components/ThemeToggle";
import TodosPage from "./components/TodosPage";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import type { Postit, StickyCalendarData, Todo, TodosData } from "./types";
import { formatDateKey, monthNames, sortByTime } from "./utils/date";
import { newId } from "./utils/id";

const STORAGE_KEY = "stickyCalendarData";
const TODOS_STORAGE_KEY = "stickyCalendarTodos";
const THEME_STORAGE_KEY = "stickyCalendarTheme";

type ThemeMode = "system" | "light" | "dark";
type Area = "calendar" | "todos";

type PostitDraft = {
	editingId: string;
	title: string;
	time: string;
	desc: string;
};

type TodoDraft = {
	editingId: string;
	title: string;
	dateKey: string;
	time: string;
};

export default function App() {
	const today = useMemo(() => new Date(), []);

	// Theme
	const [themeMode, setThemeMode] = useLocalStorageState<ThemeMode>(
		THEME_STORAGE_KEY,
		"system",
	);

	useEffect(() => {
		const root = document.documentElement;

		if (themeMode === "system") {
			root.classList.remove("dark");
			root.removeAttribute("data-theme");
			return;
		}

		// Tailwind dark mode by class
		if (themeMode === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
	}, [themeMode]);

	// Area
	const [area, setArea] = useState<Area>("calendar");

	// Post-its
	const [data, setData] = useLocalStorageState<StickyCalendarData>(
		STORAGE_KEY,
		{},
	);
	const [currentYear, setCurrentYear] = useState(() => today.getFullYear());
	const [currentMonth, setCurrentMonth] = useState(() => today.getMonth());
	const [selectedDateKey, setSelectedDateKey] = useState(() =>
		formatDateKey(today),
	);

	const [draft, setDraft] = useState<PostitDraft>({
		editingId: "",
		title: "",
		time: "",
		desc: "",
	});

	const selectedItems = useMemo(() => {
		const list = data[selectedDateKey] || [];
		return list.slice().sort(sortByTime);
	}, [data, selectedDateKey]);

	const isEditing = Boolean(draft.editingId);
	const isDirty =
		!isEditing &&
		(draft.title.trim() !== "" ||
			draft.time.trim() !== "" ||
			draft.desc.trim() !== "");

	function clearForm() {
		setDraft({ editingId: "", title: "", time: "", desc: "" });
	}

	function goPrevMonth() {
		setCurrentMonth((m) => {
			if (m === 0) {
				setCurrentYear((y) => y - 1);
				return 11;
			}
			return m - 1;
		});
	}

	function goNextMonth() {
		setCurrentMonth((m) => {
			if (m === 11) {
				setCurrentYear((y) => y + 1);
				return 0;
			}
			return m + 1;
		});
	}

	function goToday() {
		const now = new Date();
		setCurrentYear(now.getFullYear());
		setCurrentMonth(now.getMonth());
		setSelectedDateKey(formatDateKey(now));
		clearForm();
	}

	function selectDay(key: string) {
		setSelectedDateKey(key);
		clearForm();
	}

	function savePostit() {
		const title = draft.title.trim();
		const time = draft.time.trim();
		const desc = draft.desc.trim();

		if (!title) {
			alert("O título é obrigatório.");
			return;
		}

		setData((prev) => {
			const next: StickyCalendarData = { ...prev };
			const list = (
				next[selectedDateKey] ? [...next[selectedDateKey]] : []
			) as Postit[];

			if (draft.editingId) {
				const idx = list.findIndex((p) => p.id === draft.editingId);
				if (idx !== -1)
					list[idx] = { ...list[idx], title, time, description: desc };
			} else {
				list.push({ id: newId(), title, time, description: desc });
			}

			next[selectedDateKey] = list;
			return next;
		});

		clearForm();
	}

	function startEdit(p: Postit) {
		setDraft({
			editingId: p.id,
			title: p.title,
			time: p.time || "",
			desc: p.description || "",
		});
	}

	function deletePostit(p: Postit) {
		if (!confirm("Tem certeza que deseja excluir este post-it?")) return;

		setData((prev) => {
			const next: StickyCalendarData = { ...prev };
			const arr = next[selectedDateKey] ? [...next[selectedDateKey]] : [];
			const idx = arr.findIndex((x) => x.id === p.id);
			if (idx !== -1) arr.splice(idx, 1);

			if (arr.length === 0) delete next[selectedDateKey];
			else next[selectedDateKey] = arr;

			return next;
		});

		clearForm();
	}

	// Todos
	const [todos, setTodos] = useLocalStorageState<TodosData>(
		TODOS_STORAGE_KEY,
		{},
	);
	const [todoDraft, setTodoDraft] = useState<TodoDraft>({
		editingId: "",
		title: "",
		dateKey: "",
		time: "",
	});

	function clearTodoForm() {
		setTodoDraft({ editingId: "", title: "", dateKey: "", time: "" });
	}

	function saveTodo() {
		const title = todoDraft.title.trim();
		if (!title) {
			alert("O título é obrigatório.");
			return;
		}

		setTodos((prev) => {
			const next: TodosData = { ...prev };

			if (todoDraft.editingId) {
				const existing = next[todoDraft.editingId];
				if (!existing) return next;

				next[todoDraft.editingId] = {
					...existing,
					title,
					dateKey: todoDraft.dateKey.trim() || undefined,
					time: todoDraft.time.trim() || undefined,
				};
				return next;
			}

			const id = newId();
			next[id] = {
				id,
				title,
				dateKey: todoDraft.dateKey.trim() || undefined,
				time: todoDraft.time.trim() || undefined,
			};
			return next;
		});

		clearTodoForm();
	}

	function editTodo(id: string) {
		const t: Todo | undefined = todos[id];
		if (!t) return;

		setTodoDraft({
			editingId: t.id,
			title: t.title,
			dateKey: t.dateKey || "",
			time: t.time || "",
		});

		setArea("todos");
	}

	function deleteTodo(id: string) {
		setTodos((prev) => {
			const next = { ...prev };
			delete next[id];
			return next;
		});

		if (todoDraft.editingId === id) clearTodoForm();
	}

	function toggleTodoDone(id: string) {
		setTodos((prev) => {
			const next = { ...prev };
			const t = next[id];
			if (!t) return next;

			next[id] = {
				...t,
				completedAt: t.completedAt ? undefined : new Date().toISOString(),
			};
			return next;
		});
	}

	return (
		<div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
			{/* Topbar */}
			<div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4  pt-5">
				<nav className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => setArea("calendar")}
						className={[
							"rounded-md px-4 py-2 text-sm font-semibold transition",
							area === "calendar"
								? "bg-indigo-600 text-white"
								: "text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white",
						].join(" ")}
					>
						Calendário
					</button>

					<button
						type="button"
						onClick={() => setArea("todos")}
						className={[
							"rounded-md px-4 py-2 text-sm font-semibold transition",
							area === "todos"
								? "bg-indigo-600 text-white"
								: "text-zinc-600 hover:bg-white hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white",
						].join(" ")}
					>
						To-dos
					</button>
				</nav>

				<ThemeToggle value={themeMode} onChange={setThemeMode} />
			</div>

			{/* Content card */}
			<div className="mx-auto mt-4 flex max-w-[1100px] flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 max-h-[calc(100vh-140px)]">
				{area === "calendar" ? (
					<div className="flex min-h-0 flex-1 gap-6">
						{/* Left calendar */}
						<div className="flex-1 min-w-0">
							<div className="mb-3 flex items-center justify-between gap-3">
								<div>
									<div className="text-xl font-semibold">
										{monthNames[currentMonth]}
									</div>
									<div className="text-sm text-zinc-500 dark:text-zinc-400">
										{currentYear}
									</div>
								</div>

								<div className="flex gap-2">
									<button
										className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
										type="button"
										onClick={goPrevMonth}
									>
										&lt; Anterior
									</button>
									<button
										className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
										type="button"
										onClick={goToday}
									>
										Hoje
									</button>
									<button
										className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
										type="button"
										onClick={goNextMonth}
									>
										Próximo &gt;
									</button>
								</div>
							</div>

							<CalendarGrid
								year={currentYear}
								month={currentMonth}
								today={today}
								selectedDateKey={selectedDateKey}
								data={data}
								onSelectDay={selectDay}
								todos={todos}
							/>
						</div>

						{/* Right sidebar */}
						<SidebarPostits
							selectedDateKey={selectedDateKey}
							items={selectedItems}
							draft={draft}
							onDraftChange={setDraft}
							onSave={savePostit}
							onClear={clearForm}
							onEdit={startEdit}
							onDelete={deletePostit}
							isEditing={isEditing}
							isDirty={isDirty}
						/>
					</div>
				) : (
					<TodosPage
						todos={todos}
						draft={todoDraft}
						onDraftChange={setTodoDraft}
						onSave={saveTodo}
						onClear={clearTodoForm}
						onEdit={editTodo}
						onDelete={deleteTodo}
						onToggleDone={toggleTodoDone}
					/>
				)}
			</div>
		</div>
	);
}
