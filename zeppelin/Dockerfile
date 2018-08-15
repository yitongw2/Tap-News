FROM apache/zeppelin:0.8.0 as zeppelin
MAINTAINER Yitong Wu

COPY shiro.ini conf/shiro.ini
COPY zeppelin-site.xml conf/zeppelin-site.xml

RUN mkdir logs

RUN mkdir interpreter/mongodb
COPY zeppelin-mongodb-0.7.0.jar interpreter/mongodb/.

FROM mongo

RUN apt-get update
RUN apt-get install -y openjdk-8-jdk

RUN mkdir zeppelin
COPY --from=zeppelin ./zeppelin ./zeppelin

RUN cd zeppelin && ls

CMD ./zeppelin/bin/zeppelin.sh
