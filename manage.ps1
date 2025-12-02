# Digital Twin - Script de Gestión (PowerShell)

$ErrorActionPreference = "Stop"

function Print-Header {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Blue
    Write-Host "║      Digital Twin - Wind Turbine          ║" -ForegroundColor Blue
    Write-Host "║      Arquitectura Distribuida              ║" -ForegroundColor Blue
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Blue
    Write-Host ""
}

function Print-Usage {
    Write-Host "Uso: .\manage.ps1 [COMANDO]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Comandos disponibles:"
    Write-Host "  start          - Iniciar todos los servicios"
    Write-Host "  stop           - Parar todos los servicios"
    Write-Host "  restart        - Reiniciar todos los servicios"
    Write-Host "  logs           - Ver logs de todos los servicios"
    Write-Host "  status         - Ver estado de los servicios"
    Write-Host "  build          - Reconstruir imágenes Docker"
    Write-Host "  clean          - Limpiar contenedores y volúmenes"
    Write-Host "  dev-frontend   - Iniciar solo frontend en modo desarrollo"
    Write-Host "  dev-backend    - Iniciar solo servicios backend"
    Write-Host "  health         - Verificar salud de los servicios"
    Write-Host ""
}

function Start-Services {
    Write-Host "🚀 Iniciando servicios..." -ForegroundColor Green
    
    if (-Not (Test-Path .env)) {
        Write-Host "⚠️  Archivo .env no encontrado. Copiando desde .env.example..." -ForegroundColor Yellow
        Copy-Item .env.example .env
    }
    
    docker-compose up -d
    
    Write-Host "✅ Servicios iniciados correctamente" -ForegroundColor Green
    Write-Host ""
    Print-Urls
}

function Stop-Services {
    Write-Host "🛑 Parando servicios..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "✅ Servicios parados" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "🔄 Reiniciando servicios..." -ForegroundColor Yellow
    docker-compose restart
    Write-Host "✅ Servicios reiniciados" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Blue
    docker-compose logs -f
}

function Show-Status {
    Write-Host "📊 Estado de los servicios:" -ForegroundColor Blue
    Write-Host ""
    docker-compose ps
}

function Build-Services {
    Write-Host "🔨 Reconstruyendo imágenes Docker..." -ForegroundColor Blue
    docker-compose build --no-cache
    Write-Host "✅ Imágenes reconstruidas" -ForegroundColor Green
}

function Clean-Services {
    Write-Host "🧹 Limpiando contenedores, volúmenes e imágenes..." -ForegroundColor Red
    $confirmation = Read-Host "¿Estás seguro? Esto eliminará todos los datos (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        docker-compose down -v
        docker system prune -f
        Write-Host "✅ Limpieza completada" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Operación cancelada" -ForegroundColor Yellow
    }
}

function Start-DevFrontend {
    Write-Host "💻 Iniciando frontend en modo desarrollo..." -ForegroundColor Blue
    npm run dev
}

function Start-DevBackend {
    Write-Host "⚙️  Iniciando servicios backend..." -ForegroundColor Blue
    docker-compose up -d mosquitto simulator facade node-red
    Write-Host "✅ Servicios backend iniciados" -ForegroundColor Green
    Write-Host ""
    Write-Host "Mosquitto MQTT: mqtt://localhost:1883"
    Write-Host "Facade API: http://localhost:8080"
    Write-Host "Facade WebSocket: ws://localhost:8080"
    Write-Host "Node-RED: http://localhost:1880"
}

function Check-Health {
    Write-Host "🏥 Verificando salud de los servicios..." -ForegroundColor Blue
    Write-Host ""
    
    # Verificar Facade
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ Facade Service: OK" -ForegroundColor Green
    } catch {
        Write-Host "❌ Facade Service: ERROR" -ForegroundColor Red
    }
    
    # Verificar Frontend
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ Frontend: OK" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend: ERROR" -ForegroundColor Red
    }
    
    # Verificar Node-RED
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:1880" -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ Node-RED: OK" -ForegroundColor Green
    } catch {
        Write-Host "❌ Node-RED: ERROR" -ForegroundColor Red
    }
    
    # Verificar Mosquitto
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port 1883 -WarningAction SilentlyContinue
        if ($connection.TcpTestSucceeded) {
            Write-Host "✅ Mosquitto MQTT: OK" -ForegroundColor Green
        } else {
            Write-Host "❌ Mosquitto MQTT: ERROR" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Mosquitto MQTT: ERROR" -ForegroundColor Red
    }
}

function Print-Urls {
    Write-Host "📍 URLs de acceso:" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Frontend:        http://localhost:5173"
    Write-Host "  Facade API:      http://localhost:8080"
    Write-Host "  Facade Health:   http://localhost:8080/health"
    Write-Host "  Node-RED:        http://localhost:1880"
    Write-Host "  Mosquitto MQTT:  mqtt://localhost:1883"
    Write-Host "  Mosquitto WS:    ws://localhost:9001"
    Write-Host ""
}

# Main
Print-Header

$command = $args[0]

switch ($command) {
    "start" {
        Start-Services
    }
    "stop" {
        Stop-Services
    }
    "restart" {
        Restart-Services
    }
    "logs" {
        Show-Logs
    }
    "status" {
        Show-Status
    }
    "build" {
        Build-Services
    }
    "clean" {
        Clean-Services
    }
    "dev-frontend" {
        Start-DevFrontend
    }
    "dev-backend" {
        Start-DevBackend
    }
    "health" {
        Check-Health
    }
    default {
        Print-Usage
        exit 1
    }
}
