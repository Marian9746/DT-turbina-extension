import './MetricCard.css';

interface MetricCardProps {
  icon: string;
  label: string;
  value: number;
  unit: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  unit,
  className = '',
}) => {
  return (
    <div className={`metric-card ${className}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-info">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value.toFixed(1)}</span>
        <span className="metric-unit">{unit}</span>
      </div>
    </div>
  );
};
