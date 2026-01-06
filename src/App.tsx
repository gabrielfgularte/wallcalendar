import { useEffect, useMemo, useState } from "react";
import CalendarGrid from "./components/CalendarGrid";
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import ThemeSelect from "./components/ThemeSelect";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import type { Postit, StickyCalendarData } from "./types";
import { formatDateKey, monthNames, sortByTime } from "./utils/date";
import { newId } from "./utils/id";

const STORAGE_KEY = "stickyCalendarData";
const THEME_STORAGE_KEY = "stickyCalendarTheme";

type Draft = {
  editingId: string;
  title: string;
  time: string;
  desc: string;
};

type ThemeMode = "system" | "light" | "dark";

export default function App() {
  const today = useMemo(() => new Date(), []);

  const [data, setData] = useLocalStorageState<StickyCalendarData>(STORAGE_KEY, {});
  const [themeMode, setThemeMode] = useLocalStorageState<ThemeMode>(THEME_STORAGE_KEY, "system");


  const [currentYear, setCurrentYear] = useState(() => today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => today.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState(() => formatDateKey(today));

  const [draft, setDraft] = useState<Draft>({
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
      const list = (next[selectedDateKey] ? [...next[selectedDateKey]] : []) as Postit[];

      if (draft.editingId) {
        const idx = list.findIndex((p) => p.id === draft.editingId);
        if (idx !== -1) {
          list[idx] = { ...list[idx], title, time, description: desc };
        }
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

  useEffect(() => {
    const root = document.documentElement;

    if (themeMode === "system") {
      root.removeAttribute("data-theme");
      return;
    }

    root.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  return (
    <div className="app">
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
          <ThemeSelect value={themeMode} onChange={setThemeMode} />
        </div>

        <CalendarHeader
          monthLabel={monthNames[currentMonth]}
          year={currentYear}
          onPrev={goPrevMonth}
          onToday={goToday}
          onNext={goNextMonth}
        />

        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          today={today}
          selectedDateKey={selectedDateKey}
          data={data}
          onSelectDay={selectDay}
        />
      </div>

      <Sidebar
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
  );
}
