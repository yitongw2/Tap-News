import datetime
from dateutil import parser
from sklearn.feature_extraction.text import TfidfVectorizer

from tap_news_utils.mongodb_client import MongoDBClient
from tap_news_utils.cloudAMQP_client import CloudAMQPClient
from tap_news_utils.news_classifier_client import NewsClassifierClient

from config import DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME, MONGO_DB_HOST, MONGO_DB_PORT,NEWS_TOPIC_MODEL_HOST, NEWS_TOPIC_MODEL_PORT

COMP_NAME = 'news_deduper'

SLEEP_TIME_IN_SECONDS = 10

NEWS_TABLE_NAME = "news"

SAME_NEWS_SIMILARITY_THRESHOLD = 0.9

cloudAMQP_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)
mongodb_client = MongoDBClient(MONGO_DB_HOST, MONGO_DB_PORT)
newsClassifier_client = NewsClassifierClient(NEWS_TOPIC_MODEL_HOST, NEWS_TOPIC_MODEL_PORT)

def handle_message(msg):
    if not isinstance(msg, dict):
        print (COMP_NAME, 'message is broken')
        return

    if 'text' not in msg:
        print (COMP_NAME, 'message has no text')
        return

    text = msg['text']
    if not text:
        print (COMP_NAME, 'message text is empty')
        return

    published_at = parser.parse(msg['publishedAt'])
    published_at_day_begin = datetime.datetime(published_at.year, published_at.month, published_at.day, 0, 0, 0, 0)
    published_at_day_end = published_at_day_begin + datetime.timedelta(days=1)

    db = mongodb_client.get_db()
    same_day_news_list = list(db[NEWS_TABLE_NAME].find(
        {'publishedAt': {'$gte':published_at_day_begin,
                         '$lt':published_at_day_end}}))

    print (COMP_NAME, 'fetched %d today news ' % len(same_day_news_list))

    if same_day_news_list and len(same_day_news_list) > 0:
        documents = [news['text'] for news in same_day_news_list]
        documents.insert(0, text)

        tfidf = TfidfVectorizer().fit_transform(documents)
        pairwise_sim = tfidf * tfidf.T

        print (COMP_NAME, "Pairwise Sim: %s", str(pairwise_sim))

        rows, _ = pairwise_sim.shape
        for row in range(1, rows):
            if pairwise_sim[row, 0] > SAME_NEWS_SIMILARITY_THRESHOLD:
                print (COMP_NAME, "Duplicated news. Ignore.")
                return

    msg['publishedAt'] = parser.parse(msg['publishedAt'])
    print (COMP_NAME, 'insert news into db')
    msg['class'] = newsClassifier_client.classify(msg['text'])
    db[NEWS_TABLE_NAME].replace_one({'digest':msg['digest']}, msg, upsert=True)

def run():
    print (COMP_NAME, 'start to run')
    while (True):
        if cloudAMQP_client:
            msg = cloudAMQP_client.getMessage()
            if msg:
                try:
                    handle_message(msg)
                except Exception as e:
                    print ('ERROR', e)
                    pass

            cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ == '__main__':
    run()
