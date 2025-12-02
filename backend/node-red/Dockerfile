FROM nodered/node-red:latest

# Copiar configuración de flows
COPY flows.json /data/flows.json

# Copiar package.json para instalar dependencias adicionales
COPY package.json /data/package.json

# Instalar dependencias adicionales
USER root
RUN cd /data && npm install
USER node-red

# Exponer puerto de Node-RED
EXPOSE 1880

# Comando por defecto (ya definido en la imagen base)
