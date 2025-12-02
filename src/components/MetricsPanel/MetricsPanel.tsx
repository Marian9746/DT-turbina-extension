import { SensorData } from '@/types';
import { MetricCard } from '../MetricCard';
import { StatusBar } from '../StatusBar';
import './MetricsPanel.css';

interface MetricsPanelProps {
  sensorData: SensorData;
  isConnected?: boolean;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ sensorData, isConnected = true }) => {
  const timestamp = new Date().toLocaleTimeString('es-ES');

  return (
    <div className="metrics-panel">
      <h2>Métricas en Tiempo Real</h2>
      <div className="metrics-grid">
        <MetricCard
          icon="💨"
          label="Velocidad del Viento"
          value={sensorData.windSpeed}
          unit="m/s"
          className="wind"
        />
        <MetricCard
          icon="🔄"
          label="Revoluciones"
          value={sensorData.rpm}
          unit="RPM"
          className="rpm"
        />
        <MetricCard
          icon="⚡"
          label="Potencia Generada"
          value={sensorData.power}
          unit="kW"
          className="power"
        />
        <MetricCard
          icon="🌡️"
          label="Temperatura"
          value={sensorData.temperature}
          unit="°C"
          className="temp"
        />
      </div>
      <StatusBar status={sensorData.status} timestamp={timestamp} isConnected={isConnected} />
    </div>
  );
};
