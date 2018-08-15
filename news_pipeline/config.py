REDIS_HOST = 'localhost'
REDIS_PORT = '6379'

MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = '27017'

NEWS_TOPIC_MODEL_HOST = 'localhost'
NEWS_TOPIC_MODEL_PORT = '6060'

DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://nvekfhak:grby6gpmQgZineVZkOCkJxWxehKj6LR-@spider.rmq.cloudamqp.com/nvekfhak"
DEDUPE_NEWS_TASK_QUEUE_NAME = "tap-news-dedupe-news-task-queue"

SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://njqlwvsl:KFk07rtuur6IuZGK1EyKKRel3nHyrB4v@emu.rmq.cloudamqp.com/njqlwvsl"
SCRAPE_NEWS_TASK_QUEUE_NAME = "tap-news-scrape-news-task-queue"
