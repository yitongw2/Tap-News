FROM python:3.6
MAINTAINER Yitong Wu

WORKDIR /app

COPY . .

RUN mv server/dconfig.py server/config.py

RUN pip install -r requirements.txt
RUN python trainer/model.py

CMD python -u server/server.py
