FROM node
MAINTAINER Yitong Wu

WORKDIR /app

RUN npm i nodemon -g

COPY ./client ./client
RUN cd client && npm install && npm audit fix && npm run build

COPY ./server ./server
RUN mv server/config/d_rpc_config.json server/config/rpc_config.json
RUN cd server && npm install && npm audit fix

CMD cd server && npm start
