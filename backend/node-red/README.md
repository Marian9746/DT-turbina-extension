# Node-RED Configuration for Digital Twin

## Acceso
- **URL**: http://localhost:1880
- **WebSocket**: ws://localhost:1880/ws/turbine

## Flows Disponibles

### Flow Principal: Wind Turbine Digital Twin
1. **MQTT Input**: Recibe datos del topic `windturbine/sensors`
2. **JSON Parse**: Parsea los datos JSON
3. **Process & Enrich**: Añade metadata y alertas
4. **WebSocket Output**: Envía datos procesados vía WebSocket
5. **MQTT Processed**: Publica datos procesados en `windturbine/processed`

## Topics MQTT
- **Input**: `windturbine/sensors` (datos crudos del simulador)
- **Output**: `windturbine/processed` (datos procesados con alertas)
- **Control**: `windturbine/control` (comandos de control)

## Extensiones
- `node-red-dashboard`: Dashboard web para visualización
- `node-red-contrib-mqtt-broker`: Nodos MQTT adicionales

## Desarrollo
Para modificar los flows:
1. Accede a http://localhost:1880
2. Edita los nodos en el editor visual
3. Deploy los cambios
4. Los flows se guardarán automáticamente en `/data/flows.json`
