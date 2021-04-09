FROM node:10

# WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run-script build-client

EXPOSE 5001

CMD ["npm", "start"]