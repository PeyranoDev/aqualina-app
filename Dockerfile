# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./
COPY yarn.lock* ./

# Instala dependencias (usando npm o yarn)
RUN npm install -g expo-cli && npm install
# O si usas yarn:
# RUN yarn global add expo-cli && yarn install

# Copia todo el proyecto
COPY . .

# Expone los puertos necesarios para Expo
EXPOSE 19000 19001 19002 19006

# Variables de entorno (ajusta según tu configuración)
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Comando para iniciar la aplicación
CMD ["npx", "expo", "start"]