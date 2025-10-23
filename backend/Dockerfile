# Imagen base
FROM node:20

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Exponer el puerto del backend
EXPOSE 3000

# Comando de inicio
CMD ["npm", "run", "start:dev"]
