FROM node
MAINTAINER Yitong Wu

WORKDIR /app

COPY ./client ./client
RUN cd client && npm install && npm run build

COPY ./server ./server
RUN mv server/config/d_rpc_config.json server/config/rpc_config.json
RUN cd server && npm install

CMD cd server && npm start
