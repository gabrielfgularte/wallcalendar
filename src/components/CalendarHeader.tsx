import Button from "./Button";

type Props = {
  monthLabel: string;
  year: number;
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
};

export default function CalendarHeader({ monthLabel, year, onPrev, onToday, onNext }: Props) {
  return (
    <div className="calendar-header">
      <div>
        <h1>{monthLabel}</h1>
        <div className="year-label">{year}</div>
      </div>
      <div className="nav-buttons">
        <Button onClick={onPrev} type="button">
          &lt; Anterior
        </Button>
        <Button onClick={onToday} type="button">
          Hoje
        </Button>
        <Button onClick={onNext} type="button">
          Próximo &gt;
        </Button>
      </div>
    </div>
  );
}
