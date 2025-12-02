# 🚀 Guía de Inicio Rápido

## ⚡ Inicio en 3 Pasos

### 1️⃣ Clonar y Configurar

```powershell
# Clonar repositorio
git clone <repo-url>
cd "Chapter Digital Twin-2 - extension"

# Crear archivo de configuración
Copy-Item .env.example .env
```

### 2️⃣ Iniciar Servicios

**Opción A: Script de gestión (Recomendado)**

```powershell
.\manage.ps1 start
```

**Opción B: Docker Compose directo**

```powershell
docker-compose up -d
```

### 3️⃣ Acceder a la Aplicación

- **Frontend Digital Twin**: http://localhost:5173
- **Node-RED Dashboard**: http://localhost:1880
- **API Health Check**: http://localhost:8080/health

---

## 🎯 Casos de Uso Comunes

### Ver Logs en Tiempo Real

```powershell
# Todos los servicios
.\manage.ps1 logs

# O con Docker Compose
docker-compose logs -f

# Solo un servicio específico
docker-compose logs -f simulator
docker-compose logs -f facade
```

### Verificar Estado de Servicios

```powershell
.\manage.ps1 status
```

```powershell
# O manualmente
docker-compose ps
```

### Reiniciar un Servicio Específico

```powershell
docker-compose restart simulator
docker-compose restart facade
docker-compose restart frontend
```

### Parar Todo

```powershell
.\manage.ps1 stop
```

```powershell
# O con Docker Compose
docker-compose down
```

---

## 🧪 Desarrollo Local (sin Docker)

### Backend Services (con Docker)

```powershell
# Terminal 1: Iniciar backend services
.\manage.ps1 dev-backend
```

### Frontend (desarrollo local)

```powershell
# Terminal 2: Iniciar frontend
npm install
npm run dev
```

Acceder a http://localhost:5173

---

## 🔍 Verificar Salud del Sistema

```powershell
.\manage.ps1 health
```

Esto verifica:
- ✅ Facade Service (API REST)
- ✅ Frontend (React)
- ✅ Node-RED (Editor)
- ✅ Mosquitto (MQTT Broker)

---

## 🐛 Troubleshooting Rápido

### ❌ Frontend no carga

```powershell
# Verificar logs del frontend
docker-compose logs frontend

# Reconstruir frontend
docker-compose up -d --build frontend
```

### ❌ No llegan datos al frontend

```powershell
# 1. Verificar que el simulador esté publicando
docker-compose logs simulator

# 2. Verificar el Facade
curl http://localhost:8080/health

# 3. Ver logs del Facade
docker-compose logs facade
```

### ❌ Mosquitto no responde

```powershell
# Verificar puerto MQTT
Test-NetConnection -ComputerName localhost -Port 1883

# Ver logs de Mosquitto
docker-compose logs mosquitto

# Reiniciar Mosquitto
docker-compose restart mosquitto
```

### ❌ Error de puertos ocupados

```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :5173
netstat -ano | findstr :8080
netstat -ano | findstr :1883

# Parar el proceso o cambiar puertos en docker-compose.yml
```

---

## 🔧 Comandos Útiles

### Limpiar y Empezar de Nuevo

```powershell
# Parar y eliminar contenedores + volúmenes
.\manage.ps1 clean

# O manualmente
docker-compose down -v
docker system prune -f

# Reconstruir todo
.\manage.ps1 build
.\manage.ps1 start
```

### Ver Métricas de Contenedores

```powershell
docker stats
```

### Acceder a un Contenedor

```powershell
# Shell interactivo en el simulador
docker exec -it dt-simulator sh

# Shell interactivo en el facade
docker exec -it dt-facade sh
```

### Ver Configuración de Servicios

```powershell
docker-compose config
```

---

## 📡 Probar Manualmente MQTT

### Publicar mensaje de prueba

```powershell
# Instalar cliente MQTT (si no lo tienes)
npm install -g mqtt

# Publicar mensaje
mqtt pub -t "windturbine/sensors" -h localhost -p 1883 -m '{"windSpeed":10,"rpm":15,"power":1200,"temperature":35,"status":"OK"}'
```

### Suscribirse a un topic

```powershell
mqtt sub -t "windturbine/sensors" -h localhost -p 1883
```

---

## 🎨 Personalización Rápida

### Cambiar intervalo de publicación del simulador

Editar `backend/simulator/index.js`:

```javascript
const PUBLISH_INTERVAL = 2000; // 2 segundos en lugar de 1
```

Reiniciar:

```powershell
docker-compose restart simulator
```

### Cambiar puerto del frontend

Editar `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "3000:5173"  # Acceder en localhost:3000
```

---

## 📦 Comandos de Gestión Completos

```powershell
.\manage.ps1 start          # Iniciar todos los servicios
.\manage.ps1 stop           # Parar todos los servicios
.\manage.ps1 restart        # Reiniciar servicios
.\manage.ps1 status         # Ver estado
.\manage.ps1 logs           # Ver logs en vivo
.\manage.ps1 health         # Verificar salud
.\manage.ps1 build          # Reconstruir imágenes
.\manage.ps1 clean          # Limpiar todo
.\manage.ps1 dev-frontend   # Solo frontend (dev)
.\manage.ps1 dev-backend    # Solo backend services
```

---

## 🎓 Próximos Pasos

1. ✅ Iniciar el sistema
2. 📊 Explorar el frontend en http://localhost:5173
3. 🔄 Ver los flows en Node-RED: http://localhost:1880
4. 📡 Monitorear logs: `.\manage.ps1 logs`
5. 🎮 Probar controles: Encender/Apagar turbina desde la UI
6. 📖 Leer documentación completa: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**¿Necesitas ayuda?** Revisa [ARCHITECTURE.md](./ARCHITECTURE.md) para documentación detallada.
