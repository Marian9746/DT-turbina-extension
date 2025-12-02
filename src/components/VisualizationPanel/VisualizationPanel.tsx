import { WindTurbine3D } from '../WindTurbine3D';
import { ControlPanel } from '../ControlPanel';
import { TurbineState } from '@/types';
import './VisualizationPanel.css';

interface VisualizationPanelProps {
  turbineState: TurbineState;
  onToggleRotation: () => void;
  onTogglePower: () => void;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  turbineState,
  onToggleRotation,
  onTogglePower,
}) => {
  return (
    <div className="visualization-panel">
      <h2>Visualización 3D</h2>
      <WindTurbine3D turbineState={turbineState} />
      <ControlPanel
        isRotating={turbineState.isRotating}
        isPoweredOn={turbineState.isPoweredOn}
        onToggleRotation={onToggleRotation}
        onTogglePower={onTogglePower}
      />
    </div>
  );
};
