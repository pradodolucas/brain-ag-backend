FROM node:20-alpine

WORKDIR /app

# copiar package* para cache de camada
COPY package*.json ./

# instalar dependências (dev)
RUN npm ci --no-audit --no-fund

# copiar o restante (útil pra build inicial; em dev o volume sobrescreverá o código)
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
