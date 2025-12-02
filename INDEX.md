# 🎯 Índice de Documentación - Digital Twin

## 📚 Guías de Usuario

### Para Empezar
1. **[README.md](./README.md)** - Información general y overview del proyecto
2. **[QUICKSTART.md](./QUICKSTART.md)** - Guía rápida de inicio en 3 pasos

### Para Desarrolladores
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura técnica detallada
4. **[DIAGRAMS.md](./DIAGRAMS.md)** - Diagramas visuales (Mermaid)
5. **[COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)** - Guía de componentes React

### Para Presentar
6. **[PRESENTATION.md](./PRESENTATION.md)** - Guía completa para la presentación del Chapter
7. **[CHECKLIST.md](./CHECKLIST.md)** - Checklist de verificación pre-demo

### Información del Proyecto
8. **[TRANSFORMATION_SUMMARY.md](./TRANSFORMATION_SUMMARY.md)** - Resumen de la transformación
9. **[RESTRUCTURE_SUMMARY.md](./RESTRUCTURE_SUMMARY.md)** - Resumen de reestructuración anterior

---

## 🚀 Inicio Rápido

```powershell
# 1. Configurar
Copy-Item .env.example .env

# 2. Iniciar
.\manage.ps1 start

# 3. Acceder
# Frontend: http://localhost:5173
# Node-RED: http://localhost:1880
```

---

## 🏗️ Estructura del Proyecto

```
📁 Chapter Digital Twin-2 - extension/
│
├── 📁 backend/
│   ├── 📁 simulator/      # IoT Data Generator (Node.js + MQTT)
│   ├── 📁 facade/         # MQTT → WebSocket Bridge
│   └── 📁 node-red/       # Flow-based Processing
│
├── 📁 docker/
│   ├── 📁 mosquitto/      # MQTT Broker Config
│   └── 📁 nginx/          # Web Server Config
│
├── 📁 src/
│   ├── 📁 components/     # React Components
│   ├── 📁 hooks/          # Custom Hooks (useWebSocket, useWindTurbine)
│   └── 📁 types/          # TypeScript Definitions
│
├── 📄 docker-compose.yml  # Orquestación de servicios
├── 📄 Dockerfile          # Frontend container
├── 📄 manage.ps1          # Script de gestión (Windows)
├── 📄 manage.sh           # Script de gestión (Linux/Mac)
│
└── 📚 Documentación/
    ├── README.md
    ├── QUICKSTART.md
    ├── ARCHITECTURE.md
    ├── DIAGRAMS.md
    ├── PRESENTATION.md
    ├── CHECKLIST.md
    └── TRANSFORMATION_SUMMARY.md
```

---

## 🎯 Flujo de Lectura Sugerido

### 👤 Usuario Final / Presentador
```
1. README.md            ← Overview general
2. QUICKSTART.md        ← Cómo ejecutar
3. PRESENTATION.md      ← Guía de presentación
4. CHECKLIST.md         ← Verificación pre-demo
```

### 👨‍💻 Desarrollador
```
1. README.md            ← Overview
2. ARCHITECTURE.md      ← Arquitectura técnica
3. DIAGRAMS.md          ← Diagramas visuales
4. COMPONENTS_GUIDE.md  ← Componentes React
5. TRANSFORMATION_SUMMARY.md ← Qué cambió
```

### 🏢 Stakeholder / Manager
```
1. README.md            ← Overview
2. DIAGRAMS.md          ← Visualización de arquitectura
3. TRANSFORMATION_SUMMARY.md ← Beneficios
```

---

## 🛠️ Comandos Principales

### Gestión del Sistema
```powershell
.\manage.ps1 start       # Iniciar todos los servicios
.\manage.ps1 stop        # Parar servicios
.\manage.ps1 restart     # Reiniciar
.\manage.ps1 status      # Ver estado
.\manage.ps1 logs        # Ver logs en vivo
.\manage.ps1 health      # Health check
```

### Desarrollo
```powershell
.\manage.ps1 dev-backend    # Solo backend services
.\manage.ps1 dev-frontend   # Solo frontend (local)
npm run dev                 # Frontend en modo desarrollo
```

### Mantenimiento
```powershell
.\manage.ps1 build       # Reconstruir imágenes
.\manage.ps1 clean       # Limpiar todo
docker-compose ps        # Ver contenedores
docker-compose logs -f   # Logs detallados
```

---

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interfaz del Digital Twin |
| **Node-RED** | http://localhost:1880 | Editor de flows |
| **Facade Health** | http://localhost:8080/health | Health check API |
| **Facade WS** | ws://localhost:8080 | WebSocket endpoint |
| **Mosquitto** | mqtt://localhost:1883 | MQTT Broker |

---

## 📖 Documentación por Tema

### Arquitectura & Diseño
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Componentes, flujo de datos, despliegue
- **[DIAGRAMS.md](./DIAGRAMS.md)** - Diagramas Mermaid de arquitectura

### Guías de Uso
- **[QUICKSTART.md](./QUICKSTART.md)** - Inicio rápido
- **[PRESENTATION.md](./PRESENTATION.md)** - Cómo presentar el proyecto
- **[CHECKLIST.md](./CHECKLIST.md)** - Verificación pre-demo

### Referencia Técnica
- **[COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)** - Componentes React
- **[TRANSFORMATION_SUMMARY.md](./TRANSFORMATION_SUMMARY.md)** - Cambios realizados

---

## 🎓 Conceptos Clave

### Digital Twin
- Representación virtual en tiempo real
- Sincronización con objeto físico
- Monitorización y análisis
- Control bidireccional

### Arquitectura de Microservicios
- Separación de responsabilidades
- Servicios independientes
- Comunicación asíncrona (MQTT)
- Escalabilidad horizontal

### Tecnologías IoT
- MQTT (Message Queuing Telemetry Transport)
- Pub/Sub pattern
- WebSocket para tiempo real
- Node-RED para flow processing

---

## 🆘 Soporte & Troubleshooting

### Problemas Comunes

**Frontend no carga**
```powershell
docker-compose restart frontend
docker-compose logs frontend
```

**No llegan datos**
```powershell
.\manage.ps1 logs
.\manage.ps1 health
```

**WebSocket desconectado**
```powershell
docker-compose restart facade
curl http://localhost:8080/health
```

### Más Ayuda
- Ver [ARCHITECTURE.md](./ARCHITECTURE.md) sección "Troubleshooting"
- Ver [QUICKSTART.md](./QUICKSTART.md) sección "Solución de Problemas"

---

## 🤝 Contribuir

### Para añadir features:
1. Leer [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Leer [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)
3. Crear branch
4. Desarrollar
5. Probar con `.\manage.ps1 start`
6. PR

---

## 📞 Contacto

**Proyecto**: Digital Twin - Turbina Eólica  
**Propósito**: Demo educativa para Chapter Tecnológico  
**Versión**: 2.0 (Arquitectura Distribuida)

---

## 📝 Changelog

### v2.0 - Arquitectura Distribuida
- ✅ Microservicios (Simulator, Facade, Node-RED)
- ✅ MQTT Broker (Mosquitto)
- ✅ WebSocket para streaming
- ✅ Docker Compose orchestration
- ✅ Control bidireccional
- ✅ Documentación completa

### v1.0 - Demo Monolítica
- ✅ Frontend React + TypeScript
- ✅ Visualización 3D (Three.js)
- ✅ Gráficas (Chart.js)
- ✅ Simulación local

---

**Siguiente Paso**: Lee [QUICKSTART.md](./QUICKSTART.md) para comenzar 🚀
