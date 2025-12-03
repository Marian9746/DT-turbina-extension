import { useWindTurbine } from '@/hooks/useWindTurbine';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VisualizationPanel } from '@/components/VisualizationPanel';
import { MetricsPanel } from '@/components/MetricsPanel';
import { PowerChart } from '@/components/PowerChart';
import { WindChart } from '@/components/WindChart';
import './App.css';

function App() {
  const {
    sensorData,
    dataHistory,
    turbineState,
    toggleRotation,
    togglePower,
  } = useWindTurbine();

  return (
    <div className="container">
      <Header />

      <div className="main-content">
        <VisualizationPanel
          turbineState={turbineState}
          onToggleRotation={toggleRotation}
          onTogglePower={togglePower}
        />
        <MetricsPanel sensorData={sensorData} />
      </div>

      <div className="charts-section">
        <PowerChart dataHistory={dataHistory} />
        <WindChart dataHistory={dataHistory} />
      </div>

      <div className="explanation-section">
        <h2>¿Qué es un Digital Twin?</h2>
        <div className="explanation-content">
          <div className="explanation-card">
            <h3>Definición</h3>
            <p>
              Un <strong>Digital Twin (Gemelo Digital)</strong> es una representación virtual en tiempo real de un objeto, proceso o sistema físico. Utiliza datos de sensores IoT para simular, predecir y optimizar el comportamiento del activo real.
            </p>
          </div>

          <div className="explanation-card">
            <h3>Componentes Principales</h3>
            <ul>
              <li><strong>Objeto Físico:</strong> La turbina eólica real con sensores</li>
              <li><strong>Datos en Tiempo Real:</strong> Velocidad del viento, RPM, temperatura, potencia</li>
              <li><strong>Modelo Virtual:</strong> Representación 3D y lógica de simulación</li>
              <li><strong>Análisis:</strong> Visualización de datos históricos y predicciones</li>
            </ul>
          </div>

          <div className="explanation-card">
            <h3>Beneficios</h3>
            <ul>
              <li><strong>Monitorización en tiempo real</strong> del estado del activo</li>
              <li><strong>Mantenimiento predictivo</strong> para evitar fallos</li>
              <li><strong>Optimización del rendimiento</strong> basada en datos</li>
              <li><strong>Reducción de costes</strong> operativos y de inactividad</li>
              <li><strong>Simulación de escenarios</strong> sin riesgo físico</li>
            </ul>
          </div>

          <div className="explanation-card highlight">
            <h3>Esta Demo</h3>
            <p>En este ejemplo, simulamos una turbina eólica con sensores que envían datos cada segundo. El Digital Twin:</p>
            <ul>
              <li>Visualiza el estado actual en 3D</li>
              <li>Muestra métricas en tiempo real</li>
              <li>Registra históricos en gráficas</li>
              <li>Permite interactuar con el sistema (pausar, apagar)</li>
            </ul>
            <p className="note">
              <em>En producción, estos datos vendrían de sensores IoT reales conectados vía MQTT, HTTP, o WebSockets.</em>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
