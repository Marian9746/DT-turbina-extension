# 🏗️ Arquitectura Distribuida - Digital Twin

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                       DIGITAL TWIN ECOSYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

┌───────────────┐      MQTT       ┌────────────────┐
│  IoT Simulator│ ───────────────>│   Mosquitto    │
│   (Node.js)   │  pub: sensors   │  MQTT Broker   │
└───────────────┘                 └────────────────┘
      │                                   │
      │                                   │ subscribe
      │                                   ▼
      │                          ┌────────────────┐
      │                          │   Node-RED     │
      │                          │  Flow Engine   │
      │                          └────────────────┘
      │                                   │
      │ sub: control                      │ process
      │                                   ▼
      ▼                          ┌────────────────┐
┌───────────────┐                │  Facade Service│
│   Commands    │                │  MQTT → WS     │
│   (HTTP API)  │                └────────────────┘
└───────────────┘                         │
                                          │ WebSocket
                                          ▼
                                 ┌────────────────┐
                                 │  React Frontend│
                                 │  (Vite + TS)   │
                                 └────────────────┘
```

## 🧩 Componentes

### 1. **IoT Simulator** (Backend)
- **Tecnología**: Node.js + MQTT.js
- **Puerto**: N/A (cliente MQTT)
- **Función**: Genera datos simulados de sensores cada 1 segundo
- **Datos generados**:
  - `windSpeed`: Velocidad del viento (0-25 m/s)
  - `rpm`: Revoluciones por minuto (0-30 RPM)
  - `power`: Potencia generada (0-2000 kW)
  - `temperature`: Temperatura del generador (20-60°C)
  - `status`: Estado operacional
- **Topics MQTT**:
  - **Publica**: `windturbine/sensors`
  - **Suscribe**: `windturbine/control`

### 2. **Mosquitto Broker** (MQTT)
- **Tecnología**: Eclipse Mosquitto 2.0
- **Puertos**:
  - `1883`: MQTT
  - `9001`: WebSocket MQTT
- **Función**: Broker MQTT central para comunicación pub/sub
- **Configuración**: `docker/mosquitto/config/mosquitto.conf`

### 3. **Facade Service** (Backend)
- **Tecnología**: Node.js + Express + WS
- **Puerto**: `8080`
- **Función**: Puente entre MQTT y WebSocket para el frontend
- **Endpoints**:
  - `GET /health`: Health check
  - `POST /control`: Enviar comandos de control
  - `WS /`: WebSocket para streaming de datos
- **Flujo**:
  1. Se suscribe a `windturbine/sensors` (MQTT)
  2. Recibe datos del simulador
  3. Los retransmite vía WebSocket a clientes conectados

### 4. **Node-RED** (Flow Engine)
- **Tecnología**: Node-RED
- **Puerto**: `1880`
- **Función**: Procesamiento y enriquecimiento de datos
- **Flows**:
  - Recibe datos de MQTT
  - Añade metadata y alertas
  - Publica datos procesados en `windturbine/processed`
  - Opcional: envía datos vía WebSocket
- **Acceso**: http://localhost:1880

### 5. **Frontend** (React + Vite)
- **Tecnología**: React 18 + TypeScript + Vite
- **Puerto**: `5173`
- **Función**: Visualización del Digital Twin
- **Características**:
  - Visualización 3D con Three.js
  - Gráficas en tiempo real con Chart.js
  - Conexión WebSocket al Facade
  - Panel de control interactivo
- **Acceso**: http://localhost:5173

## 🚀 Despliegue con Docker

### Prerequisitos
- Docker 20.10+
- Docker Compose 2.0+

### Inicio rápido

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Chapter\ Digital\ Twin-2\ -\ extension

# 2. Crear archivo .env
cp .env.example .env

# 3. Levantar todos los servicios
docker-compose up -d

# 4. Ver logs
docker-compose logs -f

# 5. Parar todos los servicios
docker-compose down
```

### Servicios individuales

```bash
# Solo backend (sin frontend)
docker-compose up -d mosquitto simulator facade node-red

# Solo frontend (desarrollo local)
npm run dev

# Reconstruir servicios
docker-compose up -d --build
```

## 📊 Flujo de Datos

1. **Simulación** → El `IoT Simulator` genera datos cada 1s
2. **Publicación** → Publica en topic MQTT `windturbine/sensors`
3. **Broker** → `Mosquitto` distribuye a suscriptores
4. **Procesamiento** → `Node-RED` enriquece datos (opcional)
5. **Facade** → Recibe MQTT y retransmite por WebSocket
6. **Frontend** → Recibe datos en tiempo real y actualiza UI

## 🎛️ Control Bidireccional

El usuario puede controlar la turbina desde el frontend:

```
Frontend (React)
    │
    │ HTTP POST /control
    ▼
Facade Service
    │
    │ MQTT publish → windturbine/control
    ▼
Mosquitto Broker
    │
    │ MQTT subscribe
    ▼
IoT Simulator
    │
    │ Actualiza estado
    └─> Nuevos datos reflejan el cambio
```

## 🔧 Desarrollo Local

### Backend services

```bash
# Simulator
cd backend/simulator
npm install
npm start

# Facade
cd backend/facade
npm install
npm start
```

### Frontend

```bash
npm install
npm run dev
```

### Mosquitto (Docker)

```bash
docker run -d -p 1883:1883 -p 9001:9001 \
  -v $(pwd)/docker/mosquitto/config:/mosquitto/config \
  eclipse-mosquitto:2.0
```

## 🌐 URLs de Acceso

| Servicio       | URL                          | Descripción                |
|----------------|------------------------------|----------------------------|
| Frontend       | http://localhost:5173        | Interfaz del Digital Twin  |
| Facade API     | http://localhost:8080        | API REST                   |
| Facade WS      | ws://localhost:8080          | WebSocket streaming        |
| Node-RED       | http://localhost:1880        | Editor de flows            |
| Mosquitto MQTT | mqtt://localhost:1883        | Broker MQTT               |
| Mosquitto WS   | ws://localhost:9001          | WebSocket MQTT            |

## 📦 Estructura del Proyecto

```
.
├── backend/
│   ├── simulator/          # Generador de datos IoT
│   ├── facade/             # Servicio MQTT → WebSocket
│   └── node-red/           # Flows de Node-RED
├── docker/
│   ├── mosquitto/          # Configuración de Mosquitto
│   └── nginx/              # Configuración de Nginx
├── src/                    # Frontend React
├── docker-compose.yml      # Orquestación de servicios
└── Dockerfile              # Imagen del frontend
```

## 🐛 Troubleshooting

### WebSocket no conecta

```bash
# Verificar que el Facade esté corriendo
curl http://localhost:8080/health

# Ver logs del Facade
docker-compose logs facade
```

### No llegan datos

```bash
# Verificar que el Simulator esté publicando
docker-compose logs simulator

# Verificar Mosquitto
docker-compose logs mosquitto
```

### Frontend no arranca

```bash
# Verificar variables de entorno
cat .env

# Reconstruir frontend
docker-compose up -d --build frontend
```

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Esta es una demo educativa. En producción:

- Habilitar autenticación en Mosquitto
- Usar TLS/SSL para WebSocket y MQTT
- Implementar autenticación JWT en el Facade
- Limitar CORS en el backend
- Usar secretos con Docker Secrets o Vault

## 📚 Tecnologías Utilizadas

| Categoría        | Tecnología                    |
|------------------|-------------------------------|
| Frontend         | React 18, TypeScript, Vite    |
| Visualización 3D | Three.js, @react-three/fiber  |
| Gráficas         | Chart.js, react-chartjs-2     |
| Backend          | Node.js, Express, WS          |
| MQTT             | Eclipse Mosquitto, MQTT.js    |
| Flow Engine      | Node-RED                      |
| Containerización | Docker, Docker Compose        |

## 🎓 Conceptos Aprendidos

- ✅ Arquitectura de microservicios
- ✅ Comunicación pub/sub con MQTT
- ✅ WebSocket para streaming en tiempo real
- ✅ Orquestación con Docker Compose
- ✅ Flow-based programming con Node-RED
- ✅ Digital Twin pattern
- ✅ IoT data simulation

## 📄 Licencia

MIT License

---

**Creado para el Chapter Tecnológico** - Demostración de Digital Twin con arquitectura distribuida
