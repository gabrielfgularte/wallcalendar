import type { Postit } from "../types";
import Button from "./Button";

type Props = {
	items: Postit[];
	onEdit: (p: Postit) => void;
	onDelete: (p: Postit) => void;
};

export default function PostitList({ items, onEdit, onDelete }: Props) {
	if (items.length === 0) {
		return (
			<div className="empty-state">Nenhum post-it para este dia ainda.</div>
		);
	}

	return (
		<div className="postit-list">
			{items.map((p) => (
				<div className="postit" key={p.id}>
					<div className="postit-title">{p.title}</div>
					<div className="postit-time">
						{p.time ? `Hora: ${p.time}` : "Hora não definida"}
					</div>
					<div className="postit-desc">{p.description || ""}</div>
					<div className="postit-actions">
						<Button type="button" onClick={() => onEdit(p)}>
							Editar
						</Button>
						<Button type="button" onClick={() => onDelete(p)}>
							Excluir
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
