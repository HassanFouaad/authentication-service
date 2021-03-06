FROM node:16.13.2-alpine
WORKDIR /home/g/fatura
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run seed
RUN npm run build


## this is stage two , where the app actually runs
FROM node:16.13.2-alpine
WORKDIR /home/g/fatura
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY --from=0 /home/g/fatura/dist .
RUN npm run seed:prod
RUN npm install pm2 -g

EXPOSE 9000
CMD ["pm2-runtime","index.js"]