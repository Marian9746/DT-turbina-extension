# ✅ Checklist de Verificación Pre-Demo

## 📋 Antes de Presentar

### 1. Requisitos del Sistema
- [ ] Docker Desktop instalado y corriendo
- [ ] Docker versión 20.10+
- [ ] Docker Compose versión 2.0+
- [ ] Puertos libres: 5173, 8080, 1883, 1880, 9001
- [ ] Al menos 4GB RAM disponible
- [ ] Conexión a internet (para descargar imágenes si es necesario)

### 2. Preparación del Proyecto
- [ ] Repositorio clonado en máquina local
- [ ] Archivo `.env` creado (desde `.env.example`)
- [ ] Permisos de ejecución en scripts (manage.ps1 / manage.sh)

### 3. Test Inicial (30 min antes)

#### A. Iniciar Servicios
```powershell
.\manage.ps1 start
```
- [ ] Todos los contenedores iniciados correctamente
- [ ] No hay errores en el output

#### B. Verificar Health
```powershell
.\manage.ps1 health
```
- [ ] ✅ Facade Service: OK
- [ ] ✅ Frontend: OK
- [ ] ✅ Node-RED: OK
- [ ] ✅ Mosquitto MQTT: OK

#### C. Verificar Estado
```powershell
.\manage.ps1 status
```
- [ ] mosquitto: Up
- [ ] simulator: Up
- [ ] facade: Up
- [ ] node-red: Up
- [ ] frontend: Up

### 4. Test de Funcionalidad

#### Frontend (http://localhost:5173)
- [ ] Página carga correctamente
- [ ] Turbina 3D visible y girando
- [ ] Métricas actualizándose cada segundo
- [ ] Gráficas mostrando datos históricos
- [ ] Indicador de conexión: 🟢 Conectado
- [ ] Botón "Pausar Rotación" funciona
- [ ] Botón "Encender/Apagar" funciona
- [ ] Al apagar, valores descienden gradualmente

#### Node-RED (http://localhost:1880)
- [ ] Editor carga correctamente
- [ ] Flow "Wind Turbine Digital Twin" visible
- [ ] Debug muestra datos llegando
- [ ] No hay errores en el panel de debug

#### Facade Health (http://localhost:8080/health)
- [ ] Endpoint responde con JSON
- [ ] `status: "ok"`
- [ ] `connectedClients: 1` (o más)
- [ ] `latestData` muestra datos recientes

### 5. Test de Logs

```powershell
.\manage.ps1 logs
```

Verificar que se ven:
- [ ] **Simulator**: "📤 Datos publicados: Wind=X | RPM=Y | Power=Z"
- [ ] **Facade**: "📡 Datos recibidos de MQTT" + "↳ Enviado a N cliente(s)"
- [ ] No hay mensajes de error repetitivos
- [ ] No hay warnings críticos

### 6. Test de Reconexión

#### Simular fallo de red:
```powershell
# Parar el facade
docker-compose stop facade

# Esperar 10 segundos
# Verificar que frontend muestre: 🔴 Desconectado

# Reiniciar facade
docker-compose start facade

# Esperar 5 segundos
# Verificar que frontend vuelva a: 🟢 Conectado
```

- [ ] Frontend detecta desconexión
- [ ] Frontend reconecta automáticamente
- [ ] Datos se reanudan después de reconexión

### 7. Preparación de la Presentación

#### Abrir en tabs del navegador:
- [ ] Tab 1: Frontend (http://localhost:5173)
- [ ] Tab 2: Node-RED (http://localhost:1880)
- [ ] Tab 3: Facade Health (http://localhost:8080/health)

#### Terminal preparada:
- [ ] Terminal con logs en vivo: `.\manage.ps1 logs`
- [ ] Terminal minimizada o en segundo monitor

#### DevTools (F12) preparado:
- [ ] Pestaña Network → WS filtrado
- [ ] Ver mensajes WebSocket en tiempo real

#### Archivos de presentación abiertos:
- [ ] PRESENTATION.md
- [ ] DIAGRAMS.md (para mostrar diagramas)

### 8.備用 Plan (Backup)

Si algo falla:

#### Plan A: Reinicio Rápido
```powershell
.\manage.ps1 restart
```

#### Plan B: Rebuild
```powershell
docker-compose down
docker-compose up -d --build
```

#### Plan C: Logs para diagnosticar
```powershell
docker-compose logs <servicio>
```

#### Plan D: Desarrollo Local
```powershell
# Si Docker falla, correr localmente
cd backend/simulator
npm install && npm start

cd backend/facade
npm install && npm start

npm run dev
```

### 9. Conocimiento de Comandos de Emergencia

Memorizar:
```powershell
# Ver estado rápido
docker-compose ps

# Reiniciar un servicio
docker-compose restart facade

# Ver logs de un servicio
docker-compose logs -f simulator

# Parar todo
.\manage.ps1 stop
```

### 10. Preguntas Frecuentes - Respuestas Preparadas

- [ ] ¿Los datos son reales? → **"No, simulados. En producción serían sensores IoT reales."**
- [ ] ¿Se puede escalar? → **"Sí, con Kubernetes se pueden escalar servicios independientemente."**
- [ ] ¿Es seguro? → **"Demo educativa. En producción: auth, TLS, JWT, CORS."**
- [ ] ¿Por qué MQTT? → **"Ligero, pub/sub, ideal para IoT con muchos dispositivos."**
- [ ] ¿Qué pasa si cae un servicio? → **"Servicios desacoplados. Reconexión automática."**

---

## 🎬 Durante la Presentación

### Checklist de Demostración

#### Introducción (5 min)
- [ ] Mostrar frontend con turbina girando
- [ ] Explicar métricas que se actualizan
- [ ] Señalar gráficas históricas

#### Interactividad (3 min)
- [ ] Pausar rotación
- [ ] Encender/Apagar turbina
- [ ] Mostrar cómo datos cambian

#### Arquitectura (7 min)
- [ ] Abrir DIAGRAMS.md
- [ ] Explicar flujo de datos
- [ ] Mostrar Node-RED flows
- [ ] Mostrar logs en vivo

#### Control Bidireccional (5 min)
- [ ] Abrir DevTools (Network → WS)
- [ ] Apagar turbina
- [ ] Mostrar POST request
- [ ] Ver datos en WebSocket
- [ ] Observar cambio en UI

#### Cierre (5 min)
- [ ] Recapitular beneficios
- [ ] Casos de uso reales
- [ ] Mostrar documentación
- [ ] Q&A

---

## ⏰ Timeline de Verificación

### 24 horas antes:
- [ ] Test completo del sistema
- [ ] Verificar que todo funciona
- [ ] Preparar respuestas a preguntas

### 1 hora antes:
- [ ] Iniciar servicios
- [ ] Verificar health
- [ ] Abrir tabs necesarios
- [ ] Preparar DevTools

### 15 minutos antes:
- [ ] Verificar conexión a internet
- [ ] Verificar que logs siguen fluyendo
- [ ] Cerrar aplicaciones innecesarias
- [ ] Maximizar ventana del navegador

### Justo antes de empezar:
- [ ] Refrescar página del frontend
- [ ] Verificar 🟢 Conectado
- [ ] Minimizar distracciones
- [ ] ¡Respirar profundo! 😊

---

## 🆘 Solución Rápida de Problemas

| Problema | Solución Rápida |
|----------|-----------------|
| Frontend no carga | `docker-compose restart frontend` |
| No llegan datos | Verificar logs: `.\manage.ps1 logs` |
| WebSocket desconectado | `docker-compose restart facade` |
| Puerto ocupado | Cambiar puerto en docker-compose.yml |
| Todo falla | `.\manage.ps1 clean` → `.\manage.ps1 start` |

---

## ✨ Última Verificación (5 min antes)

```powershell
# Test rápido final
.\manage.ps1 health
```

### Checklist Visual Rápido:
- ✅ Frontend: Turbina girando
- ✅ Métricas: Actualizándose
- ✅ Conexión: 🟢 Verde
- ✅ Logs: Fluyendo sin errores
- ✅ Node-RED: Accesible

### Si todo está ✅:
**¡Estás listo para la presentación! 🚀**

---

**Última actualización**: Antes de la presentación  
**Estado**: [ ] TODO → [ ] VERIFICADO → [ ] ✅ LISTO
