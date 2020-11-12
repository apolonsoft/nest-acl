FROM node:12.17.0

RUN mkdir /project

WORKDIR /project

COPY package*.json ./

RUN npm i

COPY . .

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "run", "start:dev"]
