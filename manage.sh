#!/bin/bash

# Digital Twin - Script de Gestión
# Facilita el inicio, parada y monitoreo del sistema

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

function print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════╗"
    echo "║      Digital Twin - Wind Turbine          ║"
    echo "║      Arquitectura Distribuida              ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}"
}

function print_usage() {
    echo "Uso: ./manage.sh [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start          - Iniciar todos los servicios"
    echo "  stop           - Parar todos los servicios"
    echo "  restart        - Reiniciar todos los servicios"
    echo "  logs           - Ver logs de todos los servicios"
    echo "  status         - Ver estado de los servicios"
    echo "  build          - Reconstruir imágenes Docker"
    echo "  clean          - Limpiar contenedores y volúmenes"
    echo "  dev-frontend   - Iniciar solo frontend en modo desarrollo"
    echo "  dev-backend    - Iniciar solo servicios backend"
    echo "  health         - Verificar salud de los servicios"
    echo ""
}

function start_services() {
    echo -e "${GREEN}🚀 Iniciando servicios...${NC}"
    
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  Archivo .env no encontrado. Copiando desde .env.example...${NC}"
        cp .env.example .env
    fi
    
    docker-compose up -d
    
    echo -e "${GREEN}✅ Servicios iniciados correctamente${NC}"
    echo ""
    print_urls
}

function stop_services() {
    echo -e "${YELLOW}🛑 Parando servicios...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ Servicios parados${NC}"
}

function restart_services() {
    echo -e "${YELLOW}🔄 Reiniciando servicios...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ Servicios reiniciados${NC}"
}

function show_logs() {
    echo -e "${BLUE}📋 Mostrando logs (Ctrl+C para salir)...${NC}"
    docker-compose logs -f
}

function show_status() {
    echo -e "${BLUE}📊 Estado de los servicios:${NC}"
    echo ""
    docker-compose ps
}

function build_services() {
    echo -e "${BLUE}🔨 Reconstruyendo imágenes Docker...${NC}"
    docker-compose build --no-cache
    echo -e "${GREEN}✅ Imágenes reconstruidas${NC}"
}

function clean_services() {
    echo -e "${RED}🧹 Limpiando contenedores, volúmenes e imágenes...${NC}"
    read -p "¿Estás seguro? Esto eliminará todos los datos (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker system prune -f
        echo -e "${GREEN}✅ Limpieza completada${NC}"
    else
        echo -e "${YELLOW}⚠️  Operación cancelada${NC}"
    fi
}

function dev_frontend() {
    echo -e "${BLUE}💻 Iniciando frontend en modo desarrollo...${NC}"
    npm run dev
}

function dev_backend() {
    echo -e "${BLUE}⚙️  Iniciando servicios backend...${NC}"
    docker-compose up -d mosquitto simulator facade node-red
    echo -e "${GREEN}✅ Servicios backend iniciados${NC}"
    echo ""
    echo "Mosquitto MQTT: mqtt://localhost:1883"
    echo "Facade API: http://localhost:8080"
    echo "Facade WebSocket: ws://localhost:8080"
    echo "Node-RED: http://localhost:1880"
}

function check_health() {
    echo -e "${BLUE}🏥 Verificando salud de los servicios...${NC}"
    echo ""
    
    # Verificar Facade
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Facade Service: OK${NC}"
    else
        echo -e "${RED}❌ Facade Service: ERROR${NC}"
    fi
    
    # Verificar Frontend
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend: OK${NC}"
    else
        echo -e "${RED}❌ Frontend: ERROR${NC}"
    fi
    
    # Verificar Node-RED
    if curl -s http://localhost:1880 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Node-RED: OK${NC}"
    else
        echo -e "${RED}❌ Node-RED: ERROR${NC}"
    fi
    
    # Verificar Mosquitto
    if nc -zv localhost 1883 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Mosquitto MQTT: OK${NC}"
    else
        echo -e "${RED}❌ Mosquitto MQTT: ERROR${NC}"
    fi
}

function print_urls() {
    echo -e "${GREEN}📍 URLs de acceso:${NC}"
    echo ""
    echo "  Frontend:        http://localhost:5173"
    echo "  Facade API:      http://localhost:8080"
    echo "  Facade Health:   http://localhost:8080/health"
    echo "  Node-RED:        http://localhost:1880"
    echo "  Mosquitto MQTT:  mqtt://localhost:1883"
    echo "  Mosquitto WS:    ws://localhost:9001"
    echo ""
}

# Main
print_header

case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    build)
        build_services
        ;;
    clean)
        clean_services
        ;;
    dev-frontend)
        dev_frontend
        ;;
    dev-backend)
        dev_backend
        ;;
    health)
        check_health
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
