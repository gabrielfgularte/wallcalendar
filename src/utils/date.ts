export const monthNames = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

export function formatDateKey(date: Date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string) {
	const [y, m, d] = key.split("-").map(Number);
	return new Date(y, m - 1, d);
}

export function formatDateHuman(key: string) {
	const dt = parseDateKey(key);
	const day = String(dt.getDate()).padStart(2, "0");
	const month = String(dt.getMonth() + 1).padStart(2, "0");
	const year = dt.getFullYear();
	return `${day}/${month}/${year}`;
}

export type CalendarCell = {
	date: Date;
	dateKey: string;
	dayNumber: number;
	isOtherMonth: boolean;
	isToday: boolean;
};

export function buildCalendarCells(opts: {
	year: number;
	month: number;
	today: Date;
}) {
	const { year, month, today } = opts;

	const firstDayOfMonth = new Date(year, month, 1);
	const startingWeekday = firstDayOfMonth.getDay();

	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const daysInPrevMonth = new Date(year, month, 0).getDate();

	const totalCells = 42;
	const out: CalendarCell[] = [];

	for (let cell = 0; cell < totalCells; cell++) {
		let dayNumber: number;
		let dateForCell: Date;
		let isOtherMonth = false;

		if (cell < startingWeekday) {
			dayNumber = daysInPrevMonth - (startingWeekday - 1 - cell);
			const prevMonth = month === 0 ? 11 : month - 1;
			const prevYear = month === 0 ? year - 1 : year;
			dateForCell = new Date(prevYear, prevMonth, dayNumber);
			isOtherMonth = true;
		} else if (cell >= startingWeekday + daysInMonth) {
			dayNumber = cell - (startingWeekday + daysInMonth) + 1;
			const nextMonth = month === 11 ? 0 : month + 1;
			const nextYear = month === 11 ? year + 1 : year;
			dateForCell = new Date(nextYear, nextMonth, dayNumber);
			isOtherMonth = true;
		} else {
			dayNumber = cell - startingWeekday + 1;
			dateForCell = new Date(year, month, dayNumber);
		}

		const dateKey = formatDateKey(dateForCell);

		const isToday =
			dateForCell.getFullYear() === today.getFullYear() &&
			dateForCell.getMonth() === today.getMonth() &&
			dateForCell.getDate() === today.getDate();

		out.push({ date: dateForCell, dateKey, dayNumber, isOtherMonth, isToday });
	}

	return out;
}

export function sortByTime(a: { time?: string }, b: { time?: string }) {
	return (a.time || "").localeCompare(b.time || "");
}

export function sortByTimeWithNoTimeLast(
	a: { time?: string },
	b: { time?: string },
) {
	const ta = a.time?.trim() || "";
	const tb = b.time?.trim() || "";
	if (!ta && tb) return 1;
	if (ta && !tb) return -1;
	return ta.localeCompare(tb);
}
