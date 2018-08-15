# Tap-News

Tap-News is a complex web application for users to view latest news around the globe. It is consist of a React front-end, multiple backend services including RESTful servers and RPC servers, a MongoDB database, a news scraper using Python Scrapy package as well as multiple cloud RabbitMQ message queues. In addition, the web application implements the functionality of classifying news by topics and recommending news according to user preference with time decay model.

  - Front-End
    - React UI
  - Back-End
    - Node.js server handling client-side requests
    - News Pipeline including obtaining news, deduping news and inserting news to database
    - News Scraper that scrapes obtained news
    - News Classifier with Tensorflow pre-trained CNN model 
    - News Recommender that logs and retrieve user preference
    - Apache Zeppelin for data visualization and analysis

### Tech

Tap-News uses a number of open source projects to work properly:

* [React]() - javaScript library for building user interfaces
* [node.js]() - evented I/O for the backend
* [Express]() - fast node.js network app framework
* [Twitter Bootstrap]() - great UI boilerplate for modern web apps
* [Redis]() - open source (BSD licensed), in-memory data structure store, used as a cache 
* [MongoDB]() - open-source cross-platform document-oriented database program
* [Cloudamqp]() - RabbitMQ as a Service
* [jsonrpclib-pelix]() - implementation of the JSON-RPC v2.0 specification as a client library
* [Tensorflow]() - open-source software library for dataflow programming across a range of tasks
* [Apache Zeppelin]() - Web-based notebook that enables data-driven, interactive data analytics
* [Docker]() - computer program that performs operating-system-level virtualization

### Installation

Tap-News requires [Docker](www.docker.com) to run.

Start the Docker Daemon, install the dependencies and devDependencies and start the service.

```sh
$ cd Tap-News
$ docker-compose build
$ docker-compose up
```

Alternatively, each component can be started manually, though no bash script shortcut is provided. In addition, dependencies for each component must be installed beforehand.

For example, to run backend server

```sh
cd backend_server
pip install -r requirements.txt # install necessary packages
python service.py # or python3
```

### Docker
Tap-News is completely dockerized for easier deployment with docker-compose.

Every components of this application is run as a container and these containers are connected by the docker network driver specified in the docker-compose.yml.

The data related containers (MongoDB, redis) are all mounted to the local data directory for data persistency. 

### Structure

Since the application has more than six different components, the workflow of the application can be quite confusing at times. 

The following diagram shows how these components work together to present news for users.

![tap-news](https://user-images.githubusercontent.com/13974845/44027389-f0385b1a-9f28-11e8-8b2a-6def3ad1e189.png)

### Versioning

We use [git](https://git-scm.com/) for versioning. For the versions available, see the [tags on this repository](https://github.com/yitongw2/Tap-News). 

### Authors

* **Yitong Wu**


### Acknowledgments

Adapted from CS503 project of Bittiger.com 

### Additional
This markdown file is created using dillinger.io, which is a great online markdown editor tool.
