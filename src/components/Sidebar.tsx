import type { Postit } from "../types";
import { formatDateHuman } from "../utils/date";
import PostitForm from "./PostitForm";
import PostitList from "./PostitList";

type Draft = {
  editingId: string;
  title: string;
  time: string;
  desc: string;
};

type Props = {
  selectedDateKey: string;
  items: Postit[];
  draft: Draft;
  onDraftChange: (d: Draft) => void;
  onSave: () => void;
  onClear: () => void;
  onEdit: (p: Postit) => void;
  onDelete: (p: Postit) => void;
};

export default function Sidebar({ selectedDateKey, items, draft, onDraftChange, onSave, onClear, onEdit, onDelete }: Props) {
  return (
    <aside className="sidebar">
      <div>
        <h2>Post-its do dia</h2>
        <div className="selected-date-label">{formatDateHuman(selectedDateKey)}</div>
      </div>

      <PostitList items={items} onEdit={onEdit} onDelete={onDelete} />

      <PostitForm draft={draft} onChange={onDraftChange} onSubmit={onSave} onClear={onClear} />
    </aside>
  );
}
