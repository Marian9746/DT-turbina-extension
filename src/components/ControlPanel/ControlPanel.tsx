import './ControlPanel.css';
import { Button, Tooltip } from '@mui/material';
import { PlayArrow, Pause, Power, PowerOff } from '@mui/icons-material';

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
      <Tooltip title={isRotating ? "Pausar rotación" : "Reanudar rotación"}>
        <Button
          variant="outlined"
          onClick={onToggleRotation}
          startIcon={isRotating ? <Pause /> : <PlayArrow />}
          className="control-button rotation-button"
        >
          {isRotating ? 'Pausar Rotación' : 'Reanudar Rotación'}
        </Button>
      </Tooltip>
      
      <Tooltip title={isPoweredOn ? "Apagar turbina" : "Encender turbina"}>
        <Button
          variant="outlined"
          onClick={onTogglePower}
          startIcon={isPoweredOn ? <PowerOff /> : <Power />}
          className="control-button power-button"
        >
          {isPoweredOn ? 'Apagar Turbina' : 'Encender Turbina'}
        </Button>
      </Tooltip>
    </div>
  );
};
