import { SensorData } from '@/types';
import { MetricCard } from '../MetricCard';
import { StatusBar } from '../StatusBar';
import { Air, RotateRight, ElectricBolt, Thermostat } from '@mui/icons-material';
import './MetricsPanel.css';

interface MetricsPanelProps {
  sensorData: SensorData;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ sensorData }) => {
  const timestamp = new Date().toLocaleTimeString('es-ES');

  return (
    <div className="metrics-panel">
      <h2>Métricas en Tiempo Real</h2>
      <div className="metrics-grid">
        <MetricCard
          icon={<Air sx={{ fontSize: 28, color: '#1976d2' }} />}
          label="Velocidad del Viento"
          value={sensorData.windSpeed}
          unit="m/s"
          className="wind"
        />
        <MetricCard
          icon={<RotateRight sx={{ fontSize: 28, color: '#1976d2' }} />}
          label="Revoluciones"
          value={sensorData.rpm}
          unit="RPM"
          className="rpm"
        />
        <MetricCard
          icon={<ElectricBolt sx={{ fontSize: 28, color: '#1976d2' }} />}
          label="Potencia Generada"
          value={sensorData.power}
          unit="kW"
          className="power"
        />
        <MetricCard
          icon={<Thermostat sx={{ fontSize: 28, color: '#1976d2' }} />}
          label="Temperatura"
          value={sensorData.temperature}
          unit="°C"
          className="temp"
        />
      </div>
      <StatusBar status={sensorData.status} timestamp={timestamp} />
    </div>
  );
};
