import type { StickyCalendarData } from "../types";
import { buildCalendarCells, sortByTime, type CalendarCell } from "../utils/date";

type Props = {
  year: number;
  month: number;
  today: Date;
  selectedDateKey: string;
  data: StickyCalendarData;
  onSelectDay: (dateKey: string) => void;
};

function weekdayHeader() {
  return (
    <div className="weekdays">
      <div>Dom</div>
      <div>Seg</div>
      <div>Ter</div>
      <div>Qua</div>
      <div>Qui</div>
      <div>Sex</div>
      <div>Sáb</div>
    </div>
  );
}

function DayCell({ cell, selected, chips, onClick }: { cell: CalendarCell; selected: boolean; chips: string[]; onClick: () => void }) {
  const classes = [
    "day",
    cell.isOtherMonth ? "other-month" : "",
    cell.isToday ? "today" : "",
    selected ? "selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick} role="button" tabIndex={0}>
      <div className="day-number">{cell.dayNumber}</div>
      {chips.length > 0 && (
        <div className="day-postits">
          {chips.map((txt, idx) => (
            <div className="day-postit-chip" key={`${cell.dateKey}-${idx}`}>
              {txt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CalendarGrid({ year, month, today, selectedDateKey, data, onSelectDay }: Props) {
  const cells = buildCalendarCells({ year, month, today });

  return (
    <div className="calendar">
      {weekdayHeader()}
      <div className="days">
        {cells.map((cell) => {
          const list = data[cell.dateKey] || [];
          const sorted = list.slice().sort(sortByTime);

          const shown = sorted.slice(0, 3).map((p) => `${p.time ? p.time + " - " : ""}${p.title}`);
          if (sorted.length > 3) shown.push(`+${sorted.length - 3}...`);

          return (
            <DayCell
              key={`${cell.dateKey}-${cell.dayNumber}`}
              cell={cell}
              selected={cell.dateKey === selectedDateKey}
              chips={shown}
              onClick={() => onSelectDay(cell.dateKey)}
            />
          );
        })}
      </div>
    </div>
  );
}
