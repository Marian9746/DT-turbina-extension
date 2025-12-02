import './ControlPanel.css';

interface ControlPanelProps {
  isRotating: boolean;
  isPoweredOn: boolean;
  onToggleRotation: () => void;
  onTogglePower: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isRotating,
  isPoweredOn,
  onToggleRotation,
  onTogglePower,
}) => {
  return (
    <div className="controls">
      <button onClick={onToggleRotation} className="btn">
        {isRotating ? '⏸️ Pausar Rotación' : '▶️ Reanudar Rotación'}
      </button>
      <button
        onClick={onTogglePower}
        className={`btn ${isPoweredOn ? 'btn-power' : 'btn-power-off'}`}
      >
        {isPoweredOn ? '⚡ Apagar Turbina' : '🔌 Encender Turbina'}
      </button>
    </div>
  );
};
