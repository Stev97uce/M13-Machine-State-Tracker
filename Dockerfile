FROM node:18

# Crear carpeta de trabajo
WORKDIR /usr/src/app

# Copiar archivos
COPY package*.json ./
RUN npm install

COPY . .

# Exponer el puerto WebSocket
EXPOSE 8082

CMD [ "npm", "start" ]
