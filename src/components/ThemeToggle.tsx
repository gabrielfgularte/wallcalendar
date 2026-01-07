import { MonitorCogIcon, MoonIcon, SunIcon } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

type Props = {
	value: ThemeMode;
	onChange: (v: ThemeMode) => void;
};

function nextTheme(current: ThemeMode): ThemeMode {
	if (current === "system") return "light";
	if (current === "light") return "dark";
	return "system";
}

function labelFor(theme: ThemeMode) {
	if (theme === "system") return "Tema do sistema";
	if (theme === "light") return "Tema claro";
	return "Tema escuro";
}

export default function ThemeToggle({ value, onChange }: Props) {
	const label = labelFor(value);
	const icon =
		value === "light" ? (
			<SunIcon size={18} />
		) : value === "dark" ? (
			<MoonIcon size={18} />
		) : (
			<MonitorCogIcon size={18} />
		);

	return (
		<button
			type="button"
			onClick={() => onChange(nextTheme(value))}
			className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50 active:translate-y-px dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
			title={`Tema: ${label}`}
			aria-label={`Tema: ${label}. Clique para alternar.`}
		>
			{icon}
			<span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
		</button>
	);
}
