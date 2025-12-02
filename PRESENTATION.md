# 🎤 Guía de Presentación - Chapter Tecnológico

## 📋 Preparación Previa (30 minutos antes)

### 1. Verificar Requisitos
```powershell
# Docker instalado y corriendo
docker --version
docker-compose --version

# Puertos libres
netstat -ano | findstr :5173
netstat -ano | findstr :8080
netstat -ano | findstr :1883
netstat -ano | findstr :1880
```

### 2. Iniciar Sistema
```powershell
# Navegar al proyecto
cd "Chapter Digital Twin-2 - extension"

# Iniciar todos los servicios
.\manage.ps1 start

# Verificar salud
.\manage.ps1 health
```

### 3. Preparar Ventanas/Tabs
- **Tab 1**: Frontend (http://localhost:5173)
- **Tab 2**: Node-RED (http://localhost:1880)
- **Tab 3**: Facade Health (http://localhost:8080/health)
- **Terminal**: Logs en vivo (`.\manage.ps1 logs`)

---

## 🎯 Estructura de la Presentación (20-30 min)

### Parte 1: ¿Qué es un Digital Twin? (5 min)

**Puntos clave:**
- Definición: Representación virtual en tiempo real de un objeto físico
- Componentes: Objeto físico + Sensores IoT + Modelo virtual + Análisis
- Beneficios:
  - 🔍 Monitorización en tiempo real
  - 🛠️ Mantenimiento predictivo
  - 📊 Optimización de rendimiento
  - 💰 Reducción de costes
  - 🧪 Simulación sin riesgo

**Demo visual:**
- Mostrar frontend con turbina 3D girando
- Señalar las métricas actualizándose cada segundo
- Destacar gráficas históricas

---

### Parte 2: Demostración de la Aplicación (5-7 min)

#### 2.1 Visualización 3D
```
✨ Mostrar turbina eólica en 3D
- Rotación realista basada en datos de sensores
- Modelo con torre, nacelle, hub y aspas
```

#### 2.2 Métricas en Tiempo Real
```
📊 Señalar las 4 tarjetas de métricas:
- 💨 Velocidad del Viento (m/s)
- 🔄 Revoluciones (RPM)
- ⚡ Potencia Generada (kW)
- 🌡️ Temperatura (°C)
```

#### 2.3 Gráficas Históricas
```
📈 Mostrar las gráficas:
- Potencia generada (últimos 60 segundos)
- Velocidad del viento (últimos 60 segundos)
- Auto-actualización en tiempo real
```

#### 2.4 Interactividad
```
🎮 Demostrar controles:
1. Pausar/Reanudar rotación (solo visual)
2. Encender/Apagar turbina (afecta simulación)
3. Observar cómo los datos reflejan el cambio
```

**Script sugerido:**
> "Como pueden ver, tenemos una turbina eólica en 3D que recibe datos en tiempo real. 
> Si apago la turbina... [click] ... observen cómo los valores comienzan a descender gradualmente.
> Esto simula el comportamiento real de una turbina eólica apagándose."

---

### Parte 3: Arquitectura Técnica (7-10 min)

#### 3.1 Mostrar Diagrama de Arquitectura
```
🏗️ Abrir DIAGRAMS.md y mostrar el diagrama principal
```

**Componentes a explicar:**

1. **IoT Simulator** (Backend)
   ```
   - Genera datos simulados cada 1 segundo
   - Publica en MQTT (topic: windturbine/sensors)
   - Simula sensores reales de IoT
   ```

2. **Mosquitto MQTT Broker**
   ```
   - Broker de mensajes pub/sub
   - Protocolo ligero para IoT
   - Desacopla productores de consumidores
   ```

3. **Facade Service**
   ```
   - Puente entre MQTT y WebSocket
   - API REST para comandos de control
   - Se suscribe a MQTT y retransmite por WebSocket
   ```

4. **Node-RED**
   ```
   - Procesamiento visual de flujos
   - Enriquece datos con metadata
   - Alertas basadas en umbrales
   ```

5. **Frontend React**
   ```
   - Consume WebSocket para datos en vivo
   - Visualización 3D con Three.js
   - Gráficas con Chart.js
   ```

#### 3.2 Demostrar Node-RED
```
🔄 Abrir http://localhost:1880

Mostrar:
- Flow de entrada (MQTT In)
- Nodo de procesamiento (Function)
- Salidas (WebSocket, MQTT procesado)
- Debug para ver datos en vivo
```

**Script sugerido:**
> "Este es Node-RED, una herramienta de programación visual. 
> Aquí vemos cómo los datos fluyen desde MQTT, se procesan añadiendo alertas,
> y se redistribuyen. Es muy útil para prototipos rápidos."

#### 3.3 Mostrar Logs en Tiempo Real
```powershell
# En terminal separada
.\manage.ps1 logs
```

**Señalar:**
- 📤 Simulador publicando datos
- 📡 Facade recibiendo y retransmitiendo
- 📥 Frontend conectado vía WebSocket

---

### Parte 4: Control Bidireccional (3-5 min)

#### Demostrar el flujo completo:

1. **Usuario apaga turbina en UI** → 
2. **Frontend envía HTTP POST a Facade** → 
3. **Facade publica comando en MQTT** → 
4. **Simulador recibe y actualiza estado** → 
5. **Nuevos datos reflejan el cambio** → 
6. **Frontend actualiza visualización**

**Demo en vivo:**
```
1. Abrir DevTools (F12) → Network → WS
2. Ver mensajes WebSocket en tiempo real
3. Apagar turbina desde UI
4. Observar POST request en Network
5. Ver respuesta en logs del terminal
6. Observar cambio en datos WebSocket
```

---

### Parte 5: Ventajas de la Arquitectura (3-5 min)

#### Comparar: Monolítico vs. Microservicios

| Aspecto | Antes (Monolítico) | Ahora (Microservicios) |
|---------|-------------------|------------------------|
| Datos | Simulados en frontend | Simulador independiente |
| Escalabilidad | Limitada | Alta (escalar servicios individualmente) |
| Mantenimiento | Acoplado | Desacoplado |
| Resiliencia | Fallo = todo cae | Servicios independientes |
| Tecnologías | Solo React | React + Node.js + MQTT + Node-RED |

#### Conceptos Clave:
- ✅ **Separación de responsabilidades**
- ✅ **Comunicación asíncrona** (MQTT)
- ✅ **Escalabilidad horizontal**
- ✅ **Tolerancia a fallos** (reconexión automática)
- ✅ **Observabilidad** (logs, health checks)

---

### Parte 6: Aplicaciones Reales (2-3 min)

**Casos de uso de Digital Twins:**

1. **Manufactura**
   - Líneas de producción
   - Mantenimiento predictivo de maquinaria
   - Optimización de procesos

2. **Energía**
   - Turbinas eólicas (como esta demo)
   - Paneles solares
   - Redes eléctricas inteligentes

3. **Ciudades Inteligentes**
   - Gestión de tráfico
   - Sistemas de iluminación
   - Infraestructura urbana

4. **Healthcare**
   - Monitorización de pacientes
   - Equipos médicos
   - Hospitales inteligentes

5. **Aeroespacial**
   - Motores de aviones
   - Satélites
   - Sistemas de propulsión

---

## 🎬 Cierre (2 min)

### Recapitulación:
- ✅ Qué es un Digital Twin
- ✅ Beneficios en industria
- ✅ Arquitectura de microservicios moderna
- ✅ Tecnologías: React, MQTT, Node-RED, Docker
- ✅ Control bidireccional en tiempo real

### Recursos:
- 📁 Código en GitHub: [repo-url]
- 📖 Documentación: ARCHITECTURE.md
- 🚀 Quick Start: QUICKSTART.md
- 📊 Diagramas: DIAGRAMS.md

### Preguntas & Respuestas
```
💬 Abrir espacio para preguntas
```

---

## ❓ Preguntas Frecuentes

**Q: ¿Los datos son reales?**
> A: No, son simulados por un generador de datos IoT. En producción, 
> se conectarían sensores reales que publican en MQTT.

**Q: ¿Se puede escalar?**
> A: Sí, cada servicio puede escalarse independientemente con Docker/Kubernetes.
> Por ejemplo, múltiples facades para más clientes WebSocket.

**Q: ¿Es seguro?**
> A: Esta es una demo educativa. En producción se debe añadir:
> autenticación MQTT, TLS/SSL, JWT en API, CORS configurado.

**Q: ¿Qué pasa si cae un servicio?**
> A: Los servicios están desacoplados. Si cae el Facade, el simulador 
> sigue publicando. Cuando se recupere, recibirá los datos nuevamente.

**Q: ¿Por qué MQTT y no HTTP?**
> A: MQTT es más ligero, ideal para IoT con muchos dispositivos.
> Soporta pub/sub, QoS, y es eficiente en bandwidth.

---

## 🔧 Comandos de Emergencia

### Si algo falla durante la presentación:

**Reinicio rápido:**
```powershell
.\manage.ps1 restart
```

**Ver qué está mal:**
```powershell
.\manage.ps1 status
.\manage.ps1 health
```

**Logs específicos:**
```powershell
docker-compose logs facade -f
docker-compose logs simulator -f
```

**Rebuild completo (último recurso):**
```powershell
docker-compose down
docker-compose up -d --build
```

---

## 📊 Métricas de Éxito

Al final de la presentación, la audiencia debería entender:

- ✅ Concepto de Digital Twin
- ✅ Arquitectura de microservicios
- ✅ Protocolos IoT (MQTT)
- ✅ Comunicación en tiempo real (WebSocket)
- ✅ Beneficios en industria real

---

**¡Buena suerte con el Chapter! 🚀**
