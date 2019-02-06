import json
import pickle
import redis

from datetime import datetime
from bson.json_util import dumps

from tap_news_utils.mongodb_client import MongoDBClient
from tap_news_utils.cloudAMQP_client import CloudAMQPClient
from tap_news_utils.news_recommender_client import NewsRecommenderClient
from config import NEWS_TABLE_NAME, NEWS_LIST_BATCH_SIZE, NEWS_LIMIT, USER_NEWS_TIME_OUT_IN_SECONDS
from config import REDIS_HOST, REDIS_PORT
from config import MONGO_DB_HOST, MONGO_DB_PORT
from config import LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME
from config import NEWS_RECOMMENDER_HOST, NEWS_RECOMMENDER_PORT

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)

def getOneNews():
    db = MongoDBClient(MONGO_DB_HOST, MONGO_DB_PORT).get_db()
    news = db[NEWS_TABLE_NAME].find_one()
    return json.loads(dumps(news))

def logNewsClickForUser(user_id, news_id):
    print ('logNewsClickForUser', user_id, news_id)
    cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': str(datetime.utcnow())}
    # Send log message to click log processor.
    cloudAMQP_client.sendMessage(message)
    message['status'] = 'updated'
    return message

def getNewsSummariesForUser(user_id, page_num):
    page_num = int(page_num)
    # news range to be fetched for the page number
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # the final list of news to be returned
    sliced_news = []
    db = MongoDBClient(MONGO_DB_HOST, MONGO_DB_PORT).get_db()

    if redis_client.get(user_id) is not None:
        # user id already cached in redis, get next paginating data and fetch news
        news_digests = pickle.loads(redis_client.get(user_id))
        # both parameters are inclusive
        sliced_news_digest = news_digests[begin_index:end_index]
        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest': {'$in': sliced_news_digest}}))
    else:
        # no cached data
        # retrieve news and store their digests list in redis with user id as key first)
        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))
        total_news_digest = [x['digest'] for x in total_news] # lambda function in python
        redis_client.set(user_id, pickle.dumps(total_news_digest))
        redis_client.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)
        sliced_news = total_news[begin_index:end_index]

    # Get preference for the user
    preference = NewsRecommenderClient(NEWS_RECOMMENDER_HOST, NEWS_RECOMMENDER_PORT).getPreferenceForUser(user_id)
    #preference = None
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if 'class' in news and news['class'] == topPreference:
            news['reason'] = 'Recommended'

    return json.loads(dumps(sliced_news))
