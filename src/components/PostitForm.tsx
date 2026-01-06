import { useEffect, useRef } from "react";
import Button from "./Button";

type Draft = {
  editingId: string;
  title: string;
  time: string;
  desc: string;
};

type Props = {
  draft: Draft;
  onChange: (draft: Draft) => void;
  onSubmit: () => void;
  onClear: () => void;
  isEditing: boolean;
  isDirty: boolean;
};

export default function PostitForm({ draft, onChange, onSubmit, onClear, isEditing, isDirty }: Props) {
  const titleRef = useRef<HTMLInputElement | null>(null);

  // Focus title when editing/creating changes
  useEffect(() => {
    // do not auto-focus on initial mount; but if editingId changes, focus
    if (draft.editingId) titleRef.current?.focus();
  }, [draft.editingId]);

  return (
    <div>
      <h3 className="form-title">{draft.editingId ? "Editar post-it" : "Adicionar post-it"}</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input type="hidden" value={draft.editingId} readOnly />

        <input
          ref={titleRef}
          type="text"
          placeholder="Título"
          required
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
        />

        <input
          type="time"
          value={draft.time}
          onChange={(e) => onChange({ ...draft, time: e.target.value })}
        />

        <textarea
          placeholder="Descrição"
          value={draft.desc}
          onChange={(e) => onChange({ ...draft, desc: e.target.value })}
        />

        <div className="form-actions">
          <Button type="submit" variant="primary">
            Salvar
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            disabled={!isEditing && !isDirty}
          >
            {isEditing ? "Cancelar" : "Limpar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
