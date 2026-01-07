import type { Postit } from "../types";
import { formatDateHuman } from "../utils/date";

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

	isEditing: boolean;
	isDirty: boolean;
};

export default function SidebarPostits({
	selectedDateKey,
	items,
	draft,
	onDraftChange,
	onSave,
	onClear,
	onEdit,
	onDelete,
	isEditing,
	isDirty,
}: Props) {
	return (
		<aside className="w-full max-w-[420px] rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
			<div className="mb-4">
				<div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
					Post-its do dia
				</div>
				<div className="text-sm text-zinc-500 dark:text-zinc-400">
					{formatDateHuman(selectedDateKey)}
				</div>
			</div>

			<div className="space-y-3">
				{items.length === 0 ? (
					<div className="text-sm italic text-zinc-500 dark:text-zinc-400">
						Nenhum post-it para este dia ainda.
					</div>
				) : (
					items.map((p) => (
						<div
							key={p.id}
							className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/40 dark:bg-amber-950/30"
						>
							<div className="font-semibold text-zinc-900 dark:text-zinc-100">
								{p.title}
							</div>
							<div className="mt-0.5 text-sm text-gray-400 dark:text-gray-300">
								<i>{p.time ? `${p.time}` : "Sem hora marcada"}</i>
							</div>
							{p.description && (
								<div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-200">
									{p.description}
								</div>
							)}

							<div className="mt-3 flex justify-end gap-2">
								<button
									className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
									type="button"
									onClick={() => onEdit(p)}
								>
									Editar
								</button>
								<button
									className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
									type="button"
									onClick={() => onDelete(p)}
								>
									Excluir
								</button>
							</div>
						</div>
					))
				)}
			</div>

			<div className="mt-5">
				<div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
					{isEditing ? "Editar post-it" : "Adicionar post-it"}
				</div>

				<form
					className="mt-2 space-y-2"
					onSubmit={(e) => {
						e.preventDefault();
						onSave();
					}}
				>
					<input
						className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
						type="text"
						placeholder="Título"
						required
						value={draft.title}
						onChange={(e) => onDraftChange({ ...draft, title: e.target.value })}
					/>

					<input
						className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
						type="time"
						value={draft.time}
						onChange={(e) => onDraftChange({ ...draft, time: e.target.value })}
					/>

					<textarea
						className="min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
						placeholder="Descrição"
						value={draft.desc}
						onChange={(e) => onDraftChange({ ...draft, desc: e.target.value })}
					/>

					<div className="flex items-center justify-between gap-2">
						<button
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:translate-y-px"
							type="submit"
						>
							Salvar
						</button>

						<button
							className="rounded-md bg-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
							type="button"
							onClick={onClear}
							disabled={!isEditing && !isDirty}
						>
							{isEditing ? "Cancelar" : "Limpar"}
						</button>
					</div>
				</form>
			</div>
		</aside>
	);
}
