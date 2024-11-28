# Utilisez une image Node.js comme base
FROM node:18

# Définissez le répertoire de travail
WORKDIR /app

# Copiez le package.json et le package-lock.json
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel l'application va tourner
EXPOSE 3000

# Démarrez l'application
CMD ["npm", "run", "dev"]