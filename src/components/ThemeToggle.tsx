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
	if (theme === "system") return "Sistema";
	if (theme === "light") return "Claro";
	return "Escuro";
}

function IconSun() {
	return (
		<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
			<path
				fill="currentColor"
				d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4 11a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2h1Zm18 0a1 1 0 0 1 0 2h-1a1 1 0 1 1 0-2h1ZM5.64 4.22a1 1 0 0 1 1.41 0l.7.7a1 1 0 1 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41Zm12.02 12.02a1 1 0 0 1 1.41 0l.7.7a1 1 0 1 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41ZM19.78 5.64a1 1 0 0 1 0 1.41l-.7.7a1 1 0 0 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 0ZM7.04 17.66a1 1 0 0 1 0 1.41l-.7.7A1 1 0 1 1 4.93 18l.7-.7a1 1 0 0 1 1.41 0Z"
			/>
		</svg>
	);
}

function IconMoon() {
	return (
		<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
			<path
				fill="currentColor"
				d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7.5 7.5 0 1 0 11.5 11.5Z"
			/>
		</svg>
	);
}

function IconAuto() {
	return (
		<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
			<path
				fill="currentColor"
				d="M12 6a6 6 0 0 1 5.65 4H20l-3 3l-3-3h1.57A4 4 0 1 0 12 16a1 1 0 1 1 0 2a6 6 0 1 1 0-12Z"
			/>
		</svg>
	);
}

export default function ThemeToggle({ value, onChange }: Props) {
	const label = labelFor(value);
	const icon =
		value === "light" ? (
			<IconSun />
		) : value === "dark" ? (
			<IconMoon />
		) : (
			<IconAuto />
		);

	return (
		<button
			type="button"
			onClick={() => onChange(nextTheme(value))}
			className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm hover:bg-zinc-50 active:translate-y-px dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
			title={`Tema: ${label}`}
			aria-label={`Tema: ${label}. Clique para alternar.`}
		>
			{icon}
			<span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
		</button>
	);
}
