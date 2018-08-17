# -*- coding: utf-8 -*-

'''
Time decay model:
If selected:
p = (1-α)p + α
If not:
p = (1-α)p
Where p is the selection probability, and α is the degree of weight decrease.
The result of this is that the nth most recent selection will have a weight of
(1-α)^n. Using a coefficient value of 0.05 as an example, the 10th most recent
selection would only have half the weight of the most recent. Increasing epsilon
would bias towards more recent results more.
'''
import os
import sys

from news_classes import classes
from config import LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME
from config import MONGO_DB_HOST, MONGO_DB_PORT
from config import PREFERENCE_MODEL_TABLE_NAME
from tap_news_utils.mongodb_client import MongoDBClient
from tap_news_utils.cloudAMQP_client import CloudAMQPClient

NUM_OF_CLASSES = 8
INITIAL_P = 1.0 / NUM_OF_CLASSES
ALPHA = 0.1

SLEEP_TIME_IN_SECONDS = 1

NEWS_TABLE_NAME = "news"

cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)
mongodb_client = MongoDBClient(MONGO_DB_HOST, MONGO_DB_PORT)

def handle_message(msg):
    print ('click log processor: handle_message', msg)

    if not isinstance(msg, dict):
        print ('Error not dict')
        return

    if ('userId' not in msg
        or 'newsId' not in msg
        or 'timestamp' not in msg):
        print ('Error not valid msg')
        return

    userId = msg['userId']
    newsId = msg['newsId']

    db = mongodb_client.get_db()
    model = db[PREFERENCE_MODEL_TABLE_NAME].find_one({'userId': userId})

    if model is None:
        new_model = {'userId': userId}
        preference = {}
        for i in classes:
            preference[i] = float(INITIAL_P)
        new_model['preference'] = preference
        model = new_model

    # Update model using time decaying method.
    news = db[NEWS_TABLE_NAME].find_one({'digest':newsId})
    if (news is None
        or 'class' not in news
        or news['class'] not in classes):
        print ('ERROR news is none or not yet classified or not a valid class', news)
        return

    click_class = news['class']
    # Update the clicked one.
    old_p = model['preference'][click_class]
    model['preference'][click_class] = float((1 - ALPHA) * old_p + ALPHA)

    # Update not clicked classes.
    for i, prob in model['preference'].items():
        if i != click_class:
            model['preference'][i] = float((1 - ALPHA) * model['preference'][i])

    db[PREFERENCE_MODEL_TABLE_NAME].replace_one({'userId': userId}, model, upsert=True)

def run():
    while True:
        if cloudAMQP_client is not None:
            msg = cloudAMQP_client.getMessage()
            if msg is not None:
                try:
                    handle_message(msg)
                except Exception as e:
                    print ('ERROR', e)
            cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)


if __name__ == "__main__":
    run()
