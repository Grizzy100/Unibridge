FROM node:24-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma

RUN npx prisma generate

COPY src ./src

EXPOSE 3008

CMD ["npm", "run", "dev"]
