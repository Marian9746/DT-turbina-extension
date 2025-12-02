import mqtt from 'mqtt';

// Configuración MQTT
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'windturbine/sensors';
const PUBLISH_INTERVAL = parseInt(process.env.PUBLISH_INTERVAL) || 1000;

// Estado de la turbina
let turbineState = {
  isPoweredOn: true,
  baseWind: 8,
  currentWindSpeed: 8,
  currentRPM: 12,
  currentPower: 0,
  currentTemperature: 22,
};

/**
 * Genera datos simulados realistas para la turbina eólica
 */
function generateSensorData() {
  if (!turbineState.isPoweredOn) {
    // Reducir valores gradualmente si está apagada
    turbineState.currentWindSpeed = Math.max(0, turbineState.currentWindSpeed * 0.95);
    turbineState.currentRPM = Math.max(0, turbineState.currentRPM * 0.9);
    turbineState.currentPower = Math.max(0, turbineState.currentPower * 0.9);

    return {
      windSpeed: parseFloat(turbineState.currentWindSpeed.toFixed(2)),
      rpm: parseFloat(turbineState.currentRPM.toFixed(2)),
      power: Math.round(turbineState.currentPower),
      temperature: parseFloat(turbineState.currentTemperature.toFixed(2)),
      status: '🔴 Apagada',
      timestamp: new Date().toISOString(),
    };
  }

  // Simular variación natural del viento
  const windVariation = (Math.random() - 0.5) * 3;
  const windSpeed = Math.max(0, Math.min(25, turbineState.baseWind + windVariation));
  turbineState.currentWindSpeed = windSpeed;

  // RPM basado en velocidad del viento (rango típico: 10-20 RPM para turbinas grandes)
  const rpm = Math.max(0, windSpeed * 1.5 + (Math.random() - 0.5) * 2);
  turbineState.currentRPM = rpm;

  // Generación de potencia (0-2000 kW)
  const powerFactor = Math.min(1, windSpeed / 12);
  const power = Math.max(
    0,
    Math.round(powerFactor * 1800 + (Math.random() - 0.5) * 100)
  );
  turbineState.currentPower = power;

  // Temperatura aumenta con la operación
  const baseTemp = 22;
  const tempIncrease = (rpm / 30) * 15;
  const temperature = baseTemp + tempIncrease + (Math.random() - 0.5) * 2;
  turbineState.currentTemperature = temperature;

  // Determinar estado
  let status = '🟢 Operacional';
  if (windSpeed > 20) status = '🟡 Viento Alto';
  if (temperature > 45) status = '🟠 Alta Temperatura';

  return {
    windSpeed: parseFloat(windSpeed.toFixed(2)),
    rpm: parseFloat(rpm.toFixed(2)),
    power: power,
    temperature: parseFloat(temperature.toFixed(2)),
    status: status,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Inicializa el simulador IoT y publica datos en MQTT
 */
async function startSimulator() {
  console.log('🔌 Conectando al broker MQTT:', MQTT_BROKER);

  const client = mqtt.connect(MQTT_BROKER, {
    clientId: `iot-simulator-${Math.random().toString(16).slice(3)}`,
    clean: true,
    reconnectPeriod: 5000,
  });

  client.on('connect', () => {
    console.log('✅ Conectado al broker MQTT');
    console.log(`📡 Publicando datos en topic: ${MQTT_TOPIC}`);
    console.log(`⏱️  Intervalo de publicación: ${PUBLISH_INTERVAL}ms\n`);

    // Suscribirse a comandos de control
    client.subscribe('windturbine/control', (err) => {
      if (!err) {
        console.log('📥 Suscrito a comandos de control: windturbine/control\n');
      }
    });

    // Publicar datos periódicamente
    setInterval(() => {
      const sensorData = generateSensorData();
      const payload = JSON.stringify(sensorData);

      client.publish(MQTT_TOPIC, payload, { qos: 1 }, (err) => {
        if (err) {
          console.error('❌ Error publicando datos:', err);
        } else {
          console.log(`📤 Datos publicados: Wind=${sensorData.windSpeed}m/s | RPM=${sensorData.rpm} | Power=${sensorData.power}kW | Temp=${sensorData.temperature}°C | Status=${sensorData.status}`);
        }
      });
    }, PUBLISH_INTERVAL);
  });

  client.on('message', (topic, message) => {
    if (topic === 'windturbine/control') {
      try {
        const command = JSON.parse(message.toString());
        console.log('\n🎛️  Comando recibido:', command);

        if (command.action === 'power') {
          turbineState.isPoweredOn = command.value;
          console.log(`⚡ Turbina ${command.value ? 'ENCENDIDA' : 'APAGADA'}\n`);
        }
      } catch (err) {
        console.error('❌ Error procesando comando:', err.message);
      }
    }
  });

  client.on('error', (err) => {
    console.error('❌ Error de conexión MQTT:', err.message);
  });

  client.on('offline', () => {
    console.log('🔌 Desconectado del broker MQTT. Intentando reconectar...');
  });

  client.on('reconnect', () => {
    console.log('🔄 Reconectando al broker MQTT...');
  });
}

// Iniciar el simulador
startSimulator().catch((err) => {
  console.error('💥 Error fatal:', err);
  process.exit(1);
});
