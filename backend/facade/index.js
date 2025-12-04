import mqtt from 'mqtt';
import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import http from 'http';

// Configuración
const PORT = process.env.PORT || 8080;
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'windturbine/sensors';

// Variables globales
let latestSensorData = null;
const connectedClients = new Set();

/**
 * Inicializa el servidor HTTP + WebSocket
 */
function initWebSocketServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'facade',
      timestamp: new Date().toISOString(),
      connectedClients: connectedClients.size,
      latestData: latestSensorData,
    });
  });

  // Endpoint para enviar comandos a la turbina
  app.post('/control', (req, res) => {
    const { action, value } = req.body;

    if (!action) {
      return res.status(400).json({ error: 'Action is required' });
    }

    // Publicar comando en MQTT
    const command = { action, value };
    mqttClient.publish('windturbine/control', JSON.stringify(command), { qos: 1 });

    console.log(`🎛️  Comando enviado: ${action} = ${value}`);
    res.json({ success: true, command });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    connectedClients.add(ws);
    console.log(`✅ Nuevo cliente WebSocket conectado (Total: ${connectedClients.size})`);

    // Enviar últimos datos disponibles inmediatamente
    if (latestSensorData) {
      ws.send(JSON.stringify(latestSensorData));
    }

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📨 Mensaje recibido del cliente:', data);

        // Reenviar comandos al broker MQTT si es necesario
        if (data.type === 'control') {
          mqttClient.publish('windturbine/control', JSON.stringify(data.payload), { qos: 1 });
        }
      } catch (err) {
        console.error('❌ Error procesando mensaje del cliente:', err.message);
      }
    });

    ws.on('close', () => {
      connectedClients.delete(ws);
      console.log(`❌ Cliente WebSocket desconectado (Total: ${connectedClients.size})`);
    });

    ws.on('error', (err) => {
      console.error('❌ Error en WebSocket:', err.message);
      connectedClients.delete(ws);
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Facade Service escuchando en puerto ${PORT}`);
    console.log(`   HTTP API: http://localhost:${PORT}`);
    console.log(`   WebSocket: ws://localhost:${PORT}`);
  });

  return wss;
}

/**
 * Inicializa el cliente MQTT
 */
function initMqttClient() {
  console.log('🔌 Conectando al broker MQTT:', MQTT_BROKER);

  const client = mqtt.connect(MQTT_BROKER, {
    clientId: `facade-service-${Math.random().toString(16).slice(3)}`,
    clean: true,
    reconnectPeriod: 5000,
  });

  client.on('connect', () => {
    console.log('✅ Conectado al broker MQTT');
    console.log(`📥 Suscrito a topic: ${MQTT_TOPIC}\n`);

    client.subscribe(MQTT_TOPIC, { qos: 1 }, (err) => {
      if (err) {
        console.error('❌ Error suscribiéndose al topic:', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    try {
      const sensorData = JSON.parse(message.toString());
      latestSensorData = sensorData;

      console.log(`📡 Datos recibidos de MQTT: Wind=${sensorData.windSpeed}m/s | RPM=${sensorData.rpm} | Power=${sensorData.power}kW`);

      // Broadcast a todos los clientes WebSocket conectados
      let sentCount = 0;
      connectedClients.forEach((client) => {
        if (client.readyState === 1) { // OPEN
          client.send(JSON.stringify(sensorData));
          sentCount++;
        }
      });

      if (sentCount > 0) {
        console.log(`   ↳ Enviado a ${sentCount} cliente(s) WebSocket\n`);
      }
    } catch (err) {
      console.error('❌ Error procesando mensaje MQTT:', err.message);
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

  return client;
}

// Iniciar servicios
const wss = initWebSocketServer();
const mqttClient = initMqttClient(wss);

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando Facade Service...');
  mqttClient.end();
  connectedClients.forEach((client) => client.close());
  process.exit(0);
});
