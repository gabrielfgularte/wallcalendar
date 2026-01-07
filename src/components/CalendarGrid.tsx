// src/components/CalendarGrid.tsx

import type { StickyCalendarData, TodosData } from "../types";
import {
	buildCalendarCells,
	sortByTime,
	sortByTimeWithNoTimeLast,
} from "../utils/date";

type Props = {
	year: number;
	month: number;
	today: Date;
	selectedDateKey: string;
	data: StickyCalendarData;
	onSelectDay: (dateKey: string) => void;
	todos: TodosData;
};

export default function CalendarGrid({
	year,
	month,
	today,
	selectedDateKey,
	data,
	onSelectDay,
	todos,
}: Props) {
	const cells = buildCalendarCells({ year, month, today });

	return (
		<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
			<div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
				{["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
					<div
						key={d}
						className="border-r border-zinc-200 px-2 py-2 text-center last:border-r-0 dark:border-zinc-800"
					>
						{d}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7">
				{cells.map((cell) => {
					const isSelected = cell.dateKey === selectedDateKey;

					// ===== Unified events (post-its + to-dos) =====
					// ✅ agora: 2 eventos + "+N"
					const MAX_EVENTS = 2;

					type DayEvent =
						| { kind: "postit"; time?: string; label: string }
						| {
								kind: "todo";
								id: string;
								time?: string;
								label: string;
								done: boolean;
						  };

					const postits = data[cell.dateKey] || [];
					const todosForDay = Object.values(todos).filter(
						(t) => t.dateKey === cell.dateKey && !t.completedAt,
					);

					const events: DayEvent[] = [
						...postits
							.slice()
							.sort(sortByTime)
							.map((p) => ({
								kind: "postit" as const,
								time: p.time || undefined,
								label: `${p.time ? p.time + " - " : ""}${p.title}`,
							})),
						...todosForDay.map((t) => ({
							kind: "todo" as const,
							id: t.id,
							time: t.time || undefined,
							done: Boolean(t.completedAt),
							label: `${t.time ? t.time + " - " : ""}${t.title}`,
						})),
					];

					// Ordena por hora; sem hora por último
					events.sort((a, b) => sortByTimeWithNoTimeLast(a, b));

					const shownEvents = events.slice(0, MAX_EVENTS);
					const moreCount = events.length - shownEvents.length;

					return (
						<button
							key={`${cell.dateKey}-${cell.dayNumber}`}
							onClick={() => onSelectDay(cell.dateKey)}
							className={[
								"relative min-h-[96px] cursor-pointer border-r border-b border-zinc-100 p-2 transition-colors last:border-r-0",
								"dark:border-zinc-800/70",
								cell.isOtherMonth
									? "bg-zinc-50 text-zinc-400 dark:bg-zinc-950/60 dark:text-zinc-500"
									: "bg-white dark:bg-zinc-900",
								cell.isToday ? "bg-indigo-50 dark:bg-indigo-950/30" : "",
								isSelected
									? "outline outline-2 outline-indigo-600 -outline-offset-2"
									: "",
								"hover:bg-indigo-50/60 dark:hover:bg-indigo-950/20",
							].join(" ")}
							type="button"
							tabIndex={0}
						>
							{/* ✅ número do dia no canto superior esquerdo */}
							<div className="absolute left-2 top-2 text-xs font-semibold opacity-80">
								{cell.dayNumber}
							</div>

							{/* espaço pro número */}
							<div className="h-5" />

							{shownEvents.length > 0 && (
								<div className="mt-1 flex flex-col gap-1">
									{shownEvents.map((ev, idx) => {
										if (ev.kind === "postit") {
											return (
												<div
													key={`${cell.dateKey}-ev-postit-${idx}`}
													className="truncate rounded border border-amber-200 bg-amber-100 px-1.5 py-0.1 text-[10px] text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100"
													title={ev.label}
												>
													{ev.label}
												</div>
											);
										}

										return (
											<div
												key={ev.id}
												className={[
													"truncate rounded border px-1.5 py-0.1 text-[10px]",
													ev.done
														? "border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100"
														: "border-indigo-200 bg-indigo-100 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-100",
												].join(" ")}
												title="Clique para ações (done/edit/del)"
											>
												{ev.done ? `✓ ${ev.label}` : ev.label}
											</div>
										);
									})}

									{moreCount > 0 && (
										<div className="truncate rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.1 text-[10px] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
											+{moreCount}
										</div>
									)}
								</div>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
