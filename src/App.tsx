import { useEffect, useMemo, useState } from "react";

type Postit = {
  id: number;
  title: string;
  description?: string;
  time?: string; // "14:00"
};

type StickyCalendarData = Record<string, Postit[]>;

const STORAGE_KEY = "stickyCalendarData";

const monthNames = [
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

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateHuman(key: string) {
  const dt = parseDateKey(key);
  const day = String(dt.getDate()).padStart(2, "0");
  const month = String(dt.getMonth() + 1).padStart(2, "0");
  const year = dt.getFullYear();
  return `${day}/${month}/${year}`;
}

function loadData(): StickyCalendarData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StickyCalendarData;
  } catch {
    return {};
  }
}

function saveData(data: StickyCalendarData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

type CalendarCell = {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isOtherMonth: boolean;
  isToday: boolean;
};

export default function App() {
  const today = useMemo(() => new Date(), []);

  const [data, setData] = useState<StickyCalendarData>(() => loadData());

  const [currentYear, setCurrentYear] = useState(() => today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => today.getMonth()); // 0-11
  const [selectedDateStr, setSelectedDateStr] = useState(() => formatDateKey(today));

  // Form state
  const [editingId, setEditingId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [desc, setDesc] = useState("");

  // Persist
  useEffect(() => {
    saveData(data);
  }, [data]);

  function clearForm() {
    setEditingId("");
    setTitle("");
    setTime("");
    setDesc("");
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
    setSelectedDateStr(formatDateKey(now));
    clearForm();
  }

  const cells: CalendarCell[] = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingWeekday = firstDayOfMonth.getDay(); // 0=Dom

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const totalCells = 42;
    const out: CalendarCell[] = [];

    for (let cell = 0; cell < totalCells; cell++) {
      let dayNumber: number;
      let dateForCell: Date;
      let isOtherMonth = false;

      if (cell < startingWeekday) {
        dayNumber = daysInPrevMonth - (startingWeekday - 1 - cell);
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        dateForCell = new Date(prevYear, prevMonth, dayNumber);
        isOtherMonth = true;
      } else if (cell >= startingWeekday + daysInMonth) {
        dayNumber = cell - (startingWeekday + daysInMonth) + 1;
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        dateForCell = new Date(nextYear, nextMonth, dayNumber);
        isOtherMonth = true;
      } else {
        dayNumber = cell - startingWeekday + 1;
        dateForCell = new Date(currentYear, currentMonth, dayNumber);
      }

      const dateKey = formatDateKey(dateForCell);

      const isToday =
        dateForCell.getFullYear() === today.getFullYear() &&
        dateForCell.getMonth() === today.getMonth() &&
        dateForCell.getDate() === today.getDate();

      out.push({ date: dateForCell, dateKey, dayNumber, isOtherMonth, isToday });
    }

    return out;
  }, [currentYear, currentMonth, today]);

  const selectedList = useMemo(() => {
    const list = data[selectedDateStr] || [];
    return list.slice().sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  }, [data, selectedDateStr]);

  function onSelectDay(dateKey: string) {
    setSelectedDateStr(dateKey);
    clearForm();
  }

  function upsertPostit(e: React.FormEvent) {
    e.preventDefault();

    const t = title.trim();
    if (!t) {
      alert("O título é obrigatório.");
      return;
    }

    setData((prev) => {
      const next: StickyCalendarData = { ...prev };
      const list = (next[selectedDateStr] ? [...next[selectedDateStr]] : []) as Postit[];

      if (editingId) {
        const idx = list.findIndex((p) => String(p.id) === editingId);
        if (idx !== -1) {
          list[idx] = { ...list[idx], title: t, time: time.trim(), description: desc.trim() };
        }
      } else {
        list.push({
          id: Date.now(),
          title: t,
          time: time.trim(),
          description: desc.trim(),
        });
      }

      next[selectedDateStr] = list;
      return next;
    });

    clearForm();
  }

  function startEdit(p: Postit) {
    setEditingId(String(p.id));
    setTitle(p.title);
    setTime(p.time || "");
    setDesc(p.description || "");
  }

  function removePostit(p: Postit) {
    if (!confirm("Tem certeza que deseja excluir este post-it?")) return;

    setData((prev) => {
      const next: StickyCalendarData = { ...prev };
      const arr = next[selectedDateStr] ? [...next[selectedDateStr]] : [];
      const idx = arr.findIndex((x) => x.id === p.id);
      if (idx !== -1) arr.splice(idx, 1);

      if (arr.length === 0) delete next[selectedDateStr];
      else next[selectedDateStr] = arr;

      return next;
    });

    clearForm();
  }

  return (
    <div className="app">
      <div>
        <div className="calendar-header">
          <div>
            <h1>{monthNames[currentMonth]}</h1>
            <div className="year-label">{currentYear}</div>
          </div>

          <div className="nav-buttons">
            <button className="btn" onClick={goPrevMonth}>
              &lt; Anterior
            </button>
            <button className="btn" onClick={goToday}>
              Hoje
            </button>
            <button className="btn" onClick={goNextMonth}>
              Próximo &gt;
            </button>
          </div>
        </div>

        <div className="calendar">
          <div className="weekdays">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>

          <div className="days">
            {cells.map((c) => {
              const list = data[c.dateKey] || [];
              const sorted = list
                .slice()
                .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

              const isSelected = c.dateKey === selectedDateStr;

              return (
                <div
                  key={c.dateKey + "-" + c.dayNumber}
                  className={[
                    "day",
                    c.isOtherMonth ? "other-month" : "",
                    c.isToday ? "today" : "",
                    isSelected ? "selected" : "",
                  ].join(" ")}
                  onClick={() => onSelectDay(c.dateKey)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="day-number">{c.dayNumber}</div>

                  {sorted.length > 0 && (
                    <div className="day-postits">
                      {sorted.slice(0, 3).map((p) => (
                        <div className="day-postit-chip" key={p.id}>
                          {(p.time ? p.time + " - " : "") + p.title}
                        </div>
                      ))}

                      {sorted.length > 3 && (
                        <div className="day-postit-chip">{`+${sorted.length - 3}...`}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="sidebar">
        <div>
          <h2>Post-its do dia</h2>
          <div className="selected-date-label">{formatDateHuman(selectedDateStr)}</div>
        </div>

        <div className="postit-list">
          {selectedList.length === 0 ? (
            <div className="empty-state">Nenhum post-it para este dia ainda.</div>
          ) : (
            selectedList.map((p) => (
              <div className="postit" key={p.id}>
                <div className="postit-title">{p.title}</div>
                <div className="postit-time">{p.time ? `Hora: ${p.time}` : "Hora não definida"}</div>
                <div className="postit-desc">{p.description || ""}</div>

                <div className="postit-actions">
                  <button className="btn" type="button" onClick={() => startEdit(p)}>
                    Editar
                  </button>
                  <button className="btn" type="button" onClick={() => removePostit(p)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="form-title">Adicionar / Editar post-it</h3>

          <form onSubmit={upsertPostit}>
            <input type="hidden" value={editingId} readOnly />

            <input
              type="text"
              placeholder="Título"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

            <textarea
              placeholder="Descrição"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Salvar
              </button>
              <button type="button" className="btn btn-secondary" onClick={clearForm}>
                Limpar
              </button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
}
