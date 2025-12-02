# 📊 Diagrama de Arquitectura - Digital Twin

## Arquitectura Completa del Sistema

```mermaid
graph TB
    subgraph "IoT Layer"
        SIM[IoT Simulator<br/>Node.js + MQTT]
    end
    
    subgraph "Message Broker"
        MQTT[Mosquitto MQTT<br/>Port 1883]
    end
    
    subgraph "Processing Layer"
        NR[Node-RED<br/>Flow Engine<br/>Port 1880]
        FACADE[Facade Service<br/>MQTT → WebSocket<br/>Port 8080]
    end
    
    subgraph "Presentation Layer"
        FE[Frontend React<br/>Vite + TypeScript<br/>Port 5173]
    end
    
    subgraph "User"
        USER[👤 Usuario]
    end
    
    SIM -->|pub: sensors| MQTT
    MQTT -->|sub: sensors| NR
    MQTT -->|sub: sensors| FACADE
    MQTT -->|sub: control| SIM
    
    NR -->|pub: processed| MQTT
    NR -.->|WebSocket<br/>Optional| FE
    
    FACADE -->|WebSocket| FE
    
    FE -->|HTTP POST<br/>/control| FACADE
    FACADE -->|pub: control| MQTT
    
    USER -->|View & Control| FE
    
    style SIM fill:#4CAF50
    style MQTT fill:#FF9800
    style NR fill:#2196F3
    style FACADE fill:#9C27B0
    style FE fill:#E91E63
    style USER fill:#607D8B
```

## Flujo de Datos Principal

```mermaid
sequenceDiagram
    participant S as IoT Simulator
    participant M as Mosquitto
    participant F as Facade
    participant R as React Frontend
    participant U as Usuario

    Note over S,M: Cada 1 segundo
    S->>M: MQTT Publish<br/>(windturbine/sensors)
    M->>F: MQTT Subscribe<br/>(recibe datos)
    F->>R: WebSocket<br/>(streaming)
    R->>U: Actualiza UI<br/>(3D + Gráficas)
```

## Flujo de Control Bidireccional

```mermaid
sequenceDiagram
    participant U as Usuario
    participant R as React Frontend
    participant F as Facade
    participant M as Mosquitto
    participant S as IoT Simulator

    U->>R: Click "Apagar Turbina"
    R->>F: POST /control<br/>{action: 'power', value: false}
    F->>M: MQTT Publish<br/>(windturbine/control)
    M->>S: MQTT Subscribe<br/>(recibe comando)
    S->>S: Actualiza estado<br/>(isPoweredOn = false)
    Note over S,M: En próximo ciclo
    S->>M: MQTT Publish<br/>(datos reflejan cambio)
    M->>F: MQTT Subscribe
    F->>R: WebSocket
    R->>U: UI actualizada<br/>(turbina apagada)
```

## Arquitectura de Componentes Frontend

```mermaid
graph TD
    APP[App.tsx]
    
    APP --> HEADER[Header]
    APP --> VIZ[VisualizationPanel]
    APP --> METRICS[MetricsPanel]
    APP --> CHARTS[Charts Section]
    APP --> FOOTER[Footer]
    
    VIZ --> TURBINE3D[WindTurbine3D<br/>Three.js]
    VIZ --> CONTROL[ControlPanel<br/>Buttons]
    
    METRICS --> CARD1[MetricCard<br/>Wind Speed]
    METRICS --> CARD2[MetricCard<br/>RPM]
    METRICS --> CARD3[MetricCard<br/>Power]
    METRICS --> CARD4[MetricCard<br/>Temperature]
    METRICS --> STATUS[StatusBar<br/>Connection Status]
    
    CHARTS --> POWER[PowerChart<br/>Chart.js]
    CHARTS --> WIND[WindChart<br/>Chart.js]
    
    APP -.-> HOOK[useWindTurbine<br/>Custom Hook]
    HOOK -.-> WS[useWebSocket<br/>WebSocket Hook]
    
    style APP fill:#E91E63
    style HOOK fill:#9C27B0
    style WS fill:#2196F3
    style TURBINE3D fill:#4CAF50
```

## Stack Tecnológico por Capa

```mermaid
graph LR
    subgraph "Frontend"
        F1[React 18]
        F2[TypeScript]
        F3[Vite]
        F4[Three.js]
        F5[Chart.js]
    end
    
    subgraph "Backend"
        B1[Node.js]
        B2[Express]
        B3[WebSocket]
        B4[MQTT.js]
    end
    
    subgraph "Infrastructure"
        I1[Docker]
        I2[Docker Compose]
        I3[Mosquitto]
        I4[Node-RED]
    end
    
    style F1 fill:#61DAFB
    style B1 fill:#339933
    style I1 fill:#2496ED
```

## Protocolo de Comunicación

```mermaid
graph LR
    A[IoT Simulator] -->|MQTT<br/>QoS 1| B[Mosquitto Broker]
    B -->|MQTT<br/>Subscribe| C[Facade Service]
    B -->|MQTT<br/>Subscribe| D[Node-RED]
    C -->|WebSocket<br/>JSON| E[React Frontend]
    E -->|HTTP REST<br/>POST| C
    C -->|MQTT<br/>Publish| B
    B -->|MQTT<br/>Subscribe| A
    
    style A fill:#4CAF50
    style B fill:#FF9800
    style C fill:#9C27B0
    style D fill:#2196F3
    style E fill:#E91E63
```

## Despliegue Docker

```mermaid
graph TB
    subgraph "Docker Network: digital-twin-network"
        C1[Container<br/>mosquitto<br/>:1883, :9001]
        C2[Container<br/>simulator]
        C3[Container<br/>facade<br/>:8080]
        C4[Container<br/>node-red<br/>:1880]
        C5[Container<br/>frontend<br/>:5173]
    end
    
    HOST[Host Machine] -.->|Port Mapping| C1
    HOST -.->|Port Mapping| C3
    HOST -.->|Port Mapping| C4
    HOST -.->|Port Mapping| C5
    
    C2 <-->|MQTT| C1
    C3 <-->|MQTT| C1
    C4 <-->|MQTT| C1
    C5 <-->|WebSocket| C3
    C5 <-->|HTTP| C3
    
    V1[Volume<br/>node-red-data] -.-> C4
    V2[Volume<br/>mosquitto/config] -.-> C1
    V3[Volume<br/>mosquitto/data] -.-> C1
    V4[Volume<br/>mosquitto/log] -.-> C1
    
    style HOST fill:#607D8B
    style C1 fill:#FF9800
    style C2 fill:#4CAF50
    style C3 fill:#9C27B0
    style C4 fill:#2196F3
    style C5 fill:#E91E63
```

---

## 📝 Leyenda de Colores

- 🟢 **Verde**: IoT Simulator / Data Generation
- 🟠 **Naranja**: MQTT Broker / Message Bus
- 🔵 **Azul**: Node-RED / Processing
- 🟣 **Púrpura**: Facade / Backend Bridge
- 🔴 **Rojo/Rosa**: Frontend / User Interface
- ⚫ **Gris**: Usuario / External

---

## 🔗 Referencias

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentación detallada
- [QUICKSTART.md](./QUICKSTART.md) - Guía de inicio rápido
- [README.md](./README.md) - Información general
