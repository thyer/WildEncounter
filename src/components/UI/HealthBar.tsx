import './HealthBar.css';

interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
}

export default function HealthBar({ current, max, label }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const barColor = percentage > 50 ? 'green' : percentage > 20 ? 'yellow' : 'red';

  return (
    <div className="health-bar-container">
      {label && <div className="health-bar-label">{label}</div>}
      <div className="health-bar-outer">
        <div
          className={`health-bar-inner health-bar-${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="health-bar-text">
        {current}/{max} HP
      </div>
    </div>
  );
}
