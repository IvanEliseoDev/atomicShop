FROM node:22-alpine

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos todo (esto arreglará lo de sonner y motion)
RUN npm install

# Copiamos el resto del código
COPY . .

EXPOSE 5173

# El --host es vital en Docker para que Vite sea visible
CMD ["npm", "run", "dev", "--", "--host"]