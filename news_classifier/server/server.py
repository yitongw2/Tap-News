import sys
from os.path import join, normpath, dirname
# import packages in trainer
sys.path.append(join(dirname(__file__), '..', 'trainer'))
from models.tf_cnn2_model import CNN2
from preprocessor import PreProcessor

import tensorflow as tf
import numpy as np
import pandas as pd
import news_classes
import pickle

from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer
from tensorflow.contrib.learn.python.learn.estimators import model_fn
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from sklearn.model_selection import train_test_split
from config import SERVER_HOST, SERVER_PORT
from config import MONGO_DB_HOST, MONGO_DB_PORT
from tap_news_utils.mongodb_client import MongoDBClient

MODEL_DIR = normpath(join(dirname(__file__), '../model/'))
VARS_FILE = normpath(join(dirname(__file__), '../model/vars'))
TOKS_FILE = normpath(join(dirname(__file__), '../model/tokenizer'))
EMB_FILE = normpath(join(dirname(__file__), '../model/embed'))
DATA_FILE = normpath(join(dirname(__file__), '../data/simple_data/labeled_news.csv'))

MODEL_UPDATE_LAG_IN_SECONDS = 10

N_CLASSES = 8
VOCAB_SIZE = 0
MAX_DOCUMENT_LENGTH = 200
EMBED_DIM = 50

tokenizer = None
embed_matrix = None
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

    with open(EMB_FILE, 'rb') as f:
        global embed_matrix
        embed_matrix = pickle.load(f)

def loadModel():
    global classifier
    classifier = tf.contrib.learn.Estimator(
        model_fn=CNN2(N_CLASSES, VOCAB_SIZE, EMBED_DIM, embed_matrix),
        model_dir=MODEL_DIR)

    # read data
    df = pd.read_csv(DATA_FILE, header=None)
    X, y = df[1], df[0]

    # class range from 0 ~ N_CLASSES-1
    y = y.apply(lambda x: x-1)
    # preprocess
    X = X.apply(lambda x: PreProcessor.clean_text(x))

    # split train and test data
    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

    x_train = tokenizer.texts_to_sequences(x_train)
    x_train = tf.keras.preprocessing.sequence.pad_sequences(x_train, maxlen=MAX_DOCUMENT_LENGTH)

    classifier.evaluate(x_train, y_train)

    print("Model update.")

restoreVars()
loadModel()

print("Model loaded.")

class ReloadModelHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        # Reload model
        print("Model update detected. Loading new model.")
        time.sleep(MODEL_UPDATE_LAG_IN_SECONDS)
        retoreVars()
        loadModel()

# Setup watchdog
observer = Observer()
observer.schedule(ReloadModelHandler(), path=MODEL_DIR, recursive=False)
observer.start()

def classify(text):
    text = PreProcessor.clean_text(text)
    data = np.array([text])
    data = tokenizer.texts_to_sequences(data)
    data = tf.keras.preprocessing.sequence.pad_sequences(data, maxlen=MAX_DOCUMENT_LENGTH)

    y_predicted = [
        p['class'] for p in classifier.predict(
            data, as_iterable=True)
    ]

    print ('predicted', y_predicted[0]+1)
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

# Threading RPC Server
RPC_SERVER = SimpleJSONRPCServer((SERVER_HOST, SERVER_PORT))
RPC_SERVER.register_function(classify, 'classify')

print (("Starting RPC server on %s:%d" % (SERVER_HOST, SERVER_PORT)))
backfill()
RPC_SERVER.serve_forever()
