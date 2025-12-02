# 🌬️ Digital Twin - Turbina Eólica

Demo interactiva de un **Digital Twin (Gemelo Digital)** de una turbina eólica con **arquitectura distribuida basada en microservicios**.

> 🎯 **Nueva versión**: Sistema completo con IoT Simulator, MQTT, WebSockets, Node-RED y Docker

## 🏗️ Arquitectura

Este proyecto ha evolucionado de una demo monolítica a una **arquitectura distribuida real** con:

- 🔌 **IoT Simulator**: Generador de datos de sensores (Node.js + MQTT)
- 📡 **MQTT Broker**: Mosquitto para comunicación pub/sub
- 🌉 **Facade Service**: Puente MQTT → WebSocket (Node.js + Express + WS)
- 🔄 **Node-RED**: Procesamiento y enriquecimiento de datos
- 💻 **Frontend**: React + TypeScript + Vite con visualización 3D
- 🐳 **Docker Compose**: Orquestación de todos los servicios

📖 **Ver documentación completa**: [ARCHITECTURE.md](./ARCHITECTURE.md)

## 🚀 Tecnologías

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Three.js**: Visualización 3D de turbina eólica
- **Chart.js**: Gráficas de datos en tiempo real
- **WebSocket**: Streaming de datos en vivo

### Backend & Infraestructura
- **Node.js** + **Express**: API REST y WebSocket server
- **MQTT.js**: Cliente MQTT para IoT
- **Eclipse Mosquitto**: Broker MQTT
- **Node-RED**: Flow-based programming
- **Docker Compose**: Containerización y orquestación

## ✨ Características

- 🌬️ **Visualización 3D en tiempo real** con Three.js
- 📊 **Métricas de sensores en vivo** (velocidad viento, RPM, potencia, temperatura)
- 📈 **Gráficas históricas** con Chart.js
- 🎮 **Controles interactivos** (pausar rotación, encender/apagar)
- 📱 **Diseño responsive** para todos los tamaños de pantalla
- 🏗️ **Arquitectura modular de componentes**
- 🔒 **TypeScript** para seguridad de tipos

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── Header/          # Encabezado de la app
│   ├── Footer/          # Pie de página
│   ├── WindTurbine3D/   # Visualización 3D con Three.js
│   ├── VisualizationPanel/  # Wrapper del panel 3D
│   ├── MetricsPanel/    # Panel de métricas en tiempo real
│   ├── MetricCard/      # Tarjeta de métrica individual
│   ├── StatusBar/       # Indicador de estado
│   ├── ControlPanel/    # Botones de control
│   ├── PowerChart/      # Gráfica de potencia generada
│   └── WindChart/       # Gráfica de velocidad del viento
├── hooks/               # Custom React hooks
│   └── useWindTurbine.ts  # Gestión de estado de turbina
├── types/               # Interfaces TypeScript
│   └── index.ts         # Definiciones de tipos
├── App.tsx              # Componente principal
├── App.css              # Estilos globales
├── main.tsx             # Punto de entrada React
└── index.css            # CSS base
```

## 🏁 Inicio Rápido

### Requisitos Previos
- Docker 20.10+ y Docker Compose 2.0+
- Node.js 16+ y npm (solo para desarrollo local)

### Opción 1: Docker Compose (Recomendado)

```powershell
# Iniciar todos los servicios
.\manage.ps1 start

# Ver logs
.\manage.ps1 logs

# Parar servicios
.\manage.ps1 stop

# Verificar salud
.\manage.ps1 health
```

O manualmente:

```powershell
# Crear archivo .env
cp .env.example .env

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

### Opción 2: Desarrollo Local

```powershell
# Backend services con Docker
.\manage.ps1 dev-backend

# Frontend en modo desarrollo (en otra terminal)
npm install
npm run dev
```

### 🌐 URLs de Acceso

| Servicio       | URL                          |
|----------------|------------------------------|
| **Frontend**   | http://localhost:5173        |
| Facade API     | http://localhost:8080/health |
| Node-RED       | http://localhost:1880        |
| Mosquitto MQTT | mqtt://localhost:1883        |

## 🧩 Componentes Clave

### Hook `useWindTurbine`
Gestiona todo el estado de la turbina y simulación de datos de sensores:
- Actualización de datos de sensores cada segundo
- Simulación realista de viento y generación de potencia
- Transiciones suaves de velocidad de rotación
- Registro de datos históricos (últimos 60 segundos)

### Componente `WindTurbine3D`
Visualización 3D con Three.js:
- Modelo realista de turbina eólica con torre, nacelle, hub y aspas
- Rotación dinámica basada en datos de sensores
- Iluminación y sombras adecuadas
- Canvas responsive

### Componentes de Gráficas
Visualización de datos en tiempo real:
- Potencia generada a lo largo del tiempo
- Tendencias de velocidad del viento
- Auto-actualización con nuevos datos
- Integración de Chart.js con React

## 🎓 Conceptos Demostrados

### Digital Twin Pattern
1. **Objeto físico virtual**: Turbina eólica en 3D
2. **Datos en tiempo real**: Sensores simulados actualizándose cada segundo
3. **Visualización de métricas**: Panel con 4 métricas principales
4. **Análisis histórico**: Gráficas con datos de los últimos 60 segundos
5. **Control bidireccional**: Comandos desde UI → MQTT → Simulador

### Arquitectura de Microservicios
- ✅ **Separación de responsabilidades**: Cada servicio tiene un propósito único
- ✅ **Comunicación asíncrona**: Pub/Sub con MQTT
- ✅ **Escalabilidad**: Servicios independientes y containerizados
- ✅ **Resiliencia**: Reconexión automática y manejo de errores
- ✅ **Observabilidad**: Logs centralizados y health checks

## 🤔 ¿Qué es un Digital Twin?

Un **Digital Twin** es una representación virtual de un objeto o sistema físico que:
- Usa datos de sensores en tiempo real (IoT)
- Simula comportamiento y rendimiento
- Permite mantenimiento predictivo
- Optimiza operaciones
- Prueba escenarios sin riesgo físico

Esta demo muestra:
✅ Simulación de datos de sensores en tiempo real  
✅ Sincronización del modelo 3D  
✅ Monitoreo de rendimiento  
✅ Capacidades de control interactivo  

¡Perfecto para entender cómo funcionan los digital twins en aplicaciones industriales IoT!

## � Flujo de Datos

```
IoT Simulator → MQTT Broker → Node-RED (procesamiento)
                    ↓
                Facade Service (MQTT → WebSocket)
                    ↓
                Frontend React (UI + 3D)
```

### Control Bidireccional
```
Frontend → HTTP API → MQTT → IoT Simulator → Nuevos datos
```

## 🛠️ Desarrollo

### Estructura del Proyecto
```
backend/
├── simulator/       # IoT data generator
├── facade/          # MQTT to WebSocket bridge
└── node-red/        # Flow processing engine
docker/
└── mosquitto/       # MQTT broker config
src/
├── components/      # React components
├── hooks/           # Custom hooks (useWebSocket, useWindTurbine)
└── types/           # TypeScript definitions
```

### Scripts Útiles

**PowerShell** (Windows):
```powershell
.\manage.ps1 start       # Iniciar todo
.\manage.ps1 status      # Ver estado
.\manage.ps1 logs        # Ver logs
.\manage.ps1 build       # Rebuild imágenes
.\manage.ps1 clean       # Limpiar todo
```

**Bash** (Linux/Mac):
```bash
./manage.sh start        # Iniciar todo
./manage.sh status       # Ver estado
./manage.sh logs         # Ver logs
```

## 🐛 Troubleshooting

### WebSocket no conecta
```powershell
# Verificar Facade
curl http://localhost:8080/health

# Ver logs
docker-compose logs facade
```

### No llegan datos
```powershell
# Verificar Simulator
docker-compose logs simulator

# Verificar Mosquitto
docker-compose logs mosquitto
```

### Más ayuda
Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para documentación completa

## 📚 Recursos Adicionales

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura detallada
- [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) - Guía de componentes
- [QUICK_START.md](./QUICK_START.md) - Guía de inicio rápido

## 🔐 Nota de Seguridad

⚠️ Esta es una **demo educativa**. En producción:
- Habilitar autenticación MQTT
- Usar TLS/SSL
- Implementar JWT en API
- Configurar CORS apropiadamente

---

**Creado para Chapter Tecnológico** - Demostración de Digital Twin con arquitectura distribuida
