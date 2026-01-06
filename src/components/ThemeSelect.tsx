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

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM4 11a1 1 0 0 1 0 2H3a1 1 0 1 1 0-2h1Zm18 0a1 1 0 0 1 0 2h-1a1 1 0 1 1 0-2h1ZM5.64 4.22a1 1 0 0 1 1.41 0l.7.7a1 1 0 1 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41Zm12.02 12.02a1 1 0 0 1 1.41 0l.7.7a1 1 0 1 1-1.41 1.41l-.7-.7a1 1 0 0 1 0-1.41ZM19.78 5.64a1 1 0 0 1 0 1.41l-.7.7a1 1 0 0 1-1.41-1.41l.7-.7a1 1 0 0 1 1.41 0ZM7.04 17.66a1 1 0 0 1 0 1.41l-.7.7A1 1 0 1 1 4.93 18l.7-.7a1 1 0 0 1 1.41 0Z"
      />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7.5 7.5 0 1 0 11.5 11.5Z"
      />
    </svg>
  );
}

function IconAuto() {
  // “auto/refresh” vibe
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 6a6 6 0 0 1 5.65 4H20l-3 3l-3-3h1.57A4 4 0 1 0 12 16a1 1 0 1 1 0 2a6 6 0 1 1 0-12Z"
      />
    </svg>
  );
}

function IconFor(theme: ThemeMode) {
  if (theme === "light") return <IconSun />;
  if (theme === "dark") return <IconMoon />;
  return <IconAuto />;
}

export default function ThemeSelect({ value, onChange }: Props) {
  const label = labelFor(value);

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => onChange(nextTheme(value))}
      aria-label={`Tema: ${label}. Clique para alternar.`}
      title={`Tema: ${label}`}
    >
      {IconFor(value)}
      <span className="theme-toggle-label">{label}</span>
    </button>
  );
}
