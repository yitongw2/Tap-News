import sys
from os.path import join, normpath, dirname
# import packages in trainer
sys.path.append(join(dirname(__file__), '..', 'trainer'))
from preprocessor import PreProcessor

import tensorflow as tf
import numpy as np
import pandas as pd
import news_classes
import pickle
import news_classes

from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer
from config import SERVER_HOST, SERVER_PORT
from config import MONGO_DB_HOST, MONGO_DB_PORT
from tap_news_utils.mongodb_client import MongoDBClient
from tensorflow.keras.models import load_model

MODEL_FILE = normpath(join(dirname(__file__), '../model/keras_model.h5'))
VARS_FILE = normpath(join(dirname(__file__), '../model/vars'))
TOKS_FILE = normpath(join(dirname(__file__), '../model/tokenizer'))

MODEL_UPDATE_LAG_IN_SECONDS = 10

N_CLASSES = 0
VOCAB_SIZE = 0
MAX_DOCUMENT_LENGTH = 0
EMBED_DIM = 0

tokenizer = None
classifier = None

def restoreVars():
    with open(VARS_FILE, 'rb') as f:
        vars = pickle.load(f)
        global VOCAB_SIZE
        VOCAB_SIZE = vars['VOCAB_SIZE']
        global EMBED_DIM
        EMBED_DIM = vars['EMBED_DIM']
        global MAX_DOCUMENT_LENGTH
        MAX_DOCUMENT_LENGTH = vars['MAX_DOCUMENT_LENGTH']
        global N_CLASSES
        N_CLASSES = vars['N_CLASSES']

    with open(TOKS_FILE, 'rb') as f:
        global tokenizer
        tokenizer = pickle.load(f)

def loadModel():
    global classifier
    classifier = load_model(MODEL_FILE)

restoreVars()
loadModel()

print ("Model loaded.")

def classify(text):
    text = PreProcessor.clean_text(text)
    data = np.array([text])
    data = tokenizer.texts_to_sequences(data)
    data = tf.keras.preprocessing.sequence.pad_sequences(data, maxlen=MAX_DOCUMENT_LENGTH)

    y_predicted = np.argmax(classifier.predict(data), axis=1)

    topic = news_classes.class_map[str(y_predicted[0]+1)]
    return topic

def backfill():
    print ('begin backfilling')
    db = MongoDBClient(MONGO_DB_HOST, MONGO_DB_PORT).get_db()
    cursor = db['news'].find({})
    count = 0
    for news in cursor:
        count += 1
        print(count)
        if 'class' not in news:
            print('Populating classes...')
            description = news['description']
            if description is None:
                description = news['title']
            topic = classify(description)
            news['class'] = topic
            db['news'].replace_one({'digest': news['digest']}, news, upsert=True)

backfill()
print("Backfill news.")

# Threading RPC Server
RPC_SERVER = SimpleJSONRPCServer((SERVER_HOST, SERVER_PORT))
RPC_SERVER.register_function(classify, 'classify')

print (("Starting RPC server on %s:%d" % (SERVER_HOST, SERVER_PORT)))
RPC_SERVER.serve_forever()
