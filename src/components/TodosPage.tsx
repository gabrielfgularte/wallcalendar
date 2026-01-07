// src/components/TodosPage.tsx
import type { Todo, TodosData } from "../types";
import { formatDateHuman } from "../utils/date";

type Draft = {
	editingId: string;
	title: string;
	dateKey: string;
	time: string;
};

type Props = {
	todos: TodosData;

	draft: Draft;
	onDraftChange: (d: Draft) => void;

	onSave: () => void;
	onClear: () => void;

	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
	onToggleDone: (id: string) => void;
};

function todoLabel(t: Todo) {
	const when = t.dateKey ? formatDateHuman(t.dateKey) : "Sem data";
	const time = t.time ? ` • ${t.time}` : "";
	return `${when}${time}`;
}

export default function TodosPage({
	todos,
	draft,
	onDraftChange,
	onSave,
	onClear,
	onEdit,
	onDelete,
	onToggleDone,
}: Props) {
	const list = Object.values(todos);

	const pending = list
		.filter((t) => !t.completedAt)
		.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

	const done = list
		.filter((t) => Boolean(t.completedAt))
		.sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));

	const isEditing = Boolean(draft.editingId);
	const isDirty =
		!isEditing &&
		(draft.title.trim() !== "" ||
			draft.dateKey.trim() !== "" ||
			draft.time.trim() !== "");

	return (
		<div className="flex min-h-0 flex-1 gap-6">
			{/* Left list (clean) */}
			<div className="flex-1 min-w-0 min-h-0 flex flex-col">
				<div className="mb-4">
					<div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
						To-dos
					</div>
					<div className="text-sm text-zinc-500 dark:text-zinc-400">
						Com data/hora aparecem no calendário. Sem data ficam só aqui.
					</div>
				</div>

				<div className="min-h-0 flex-1 overflow-y-auto pr-1 divide-zinc-200 dark:divide-zinc-800 scrollbar-pretty">
					<div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
						Pendentes
					</div>

					{pending.length === 0 ? (
						<div className="text-sm italic text-zinc-500 dark:text-zinc-400">
							Nenhum to-do pendente.
						</div>
					) : (
						<div className="space-y-2">
							{pending.map((t) => (
								<div
									key={t.id}
									className="flex items-start justify-between gap-3 py-2 border-b border-zinc-200"
								>
									{/* Left: texto */}
									<div className="min-w-0">
										<div className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
											{t.title}
										</div>

										<div className="text-xs text-zinc-500 dark:text-zinc-400">
											{todoLabel(t)}
										</div>
									</div>

									{/* Right: ações por ícone */}
									<div className="flex shrink-0 items-center gap-2">
										{/* Done */}
										<button
											type="button"
											title="Marcar como feito"
											onClick={() => onToggleDone(t.id)}
											className="rounded p-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30"
										>
											✓
										</button>

										{/* Edit */}
										<button
											type="button"
											title="Editar"
											onClick={() => onEdit(t.id)}
											className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
										>
											✎
										</button>

										{/* Delete */}
										<button
											type="button"
											title="Excluir"
											onClick={() => {
												if (
													!confirm("Tem certeza que deseja excluir este to-do?")
												)
													return;
												onDelete(t.id);
											}}
											className="rounded p-1 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
										>
											✕
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					<div className="pt-4">
						<div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
							Feitos
						</div>

						{done.length === 0 ? (
							<div className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-400">
								Nenhum to-do feito ainda.
							</div>
						) : (
							<ul className="mt-2 space-y-2">
								{done.map((t) => (
									<li key={t.id} className="flex items-start gap-2 text-sm">
										<span className="mt-[2px] text-emerald-600 dark:text-emerald-400">
											✓
										</span>

										<div className="min-w-0">
											<div className="truncate line-through text-zinc-500 dark:text-zinc-400">
												{t.title}
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>

			{/* Right form panel */}
			<aside className="w-full max-w-[420px] shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
				<div className="mb-4">
					<div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
						To-do
					</div>
					<div className="text-sm text-zinc-500 dark:text-zinc-400">
						{isEditing ? "Editando um to-do" : "Criar novo to-do"}
					</div>
				</div>

				<div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
					{isEditing ? "Editar to-do" : "Adicionar to-do"}
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

					<div className="flex gap-2">
						<input
							className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
							type="date"
							value={draft.dateKey}
							onChange={(e) =>
								onDraftChange({ ...draft, dateKey: e.target.value })
							}
							title="Opcional"
						/>
						<input
							className="w-[140px] rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
							type="time"
							value={draft.time}
							onChange={(e) =>
								onDraftChange({ ...draft, time: e.target.value })
							}
							title="Opcional"
						/>
					</div>

					<div className="flex items-center justify-between gap-2 pt-1">
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
			</aside>
		</div>
	);
}
