import numpy as np
import tensorflow as tf
import pandas as pd
import pickle
import shutil

from sklearn.model_selection import train_test_split
from models.tf_cnn2_model import CNN2
from preprocessor import PreProcessor
from os import mkdir
from os.path import join, normpath, dirname
from sklearn import metrics

REMOVE_PREVIOUS_MODEL = True

MODEL_OUTPUT_DIR = normpath(join(dirname(__file__), '../model/'))
DATA_SET_FILE = normpath(join(dirname(__file__), '../data/simple_data/labeled_news.csv'))
TOKEN_FILE = normpath(join(dirname(__file__), '../model/tokenizer'))
VARS_FILE = normpath(join(dirname(__file__), '../model/vars'))
EMB_FILE = normpath(join(dirname(__file__), '../model/embed'))
MAX_DOCUMENT_LENGTH = 200
VOCAB_SIZE = 20000
EMBED_DIM = 50
N_CLASSES = 8

# Training parms
STEPS = 100

def main(unused_argv):
    if REMOVE_PREVIOUS_MODEL:
        # Remove old model
        shutil.rmtree(MODEL_OUTPUT_DIR)
        mkdir(MODEL_OUTPUT_DIR)

    # read data
    df = pd.read_csv(DATA_SET_FILE, header=None)
    X, y = df[1], df[0]

    # class range from 0 ~ N_CLASSES-1
    y = y.apply(lambda x: x-1)
    # preprocess
    X = X.apply(lambda x: PreProcessor.clean_text(x))

    # split train and test data
    x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

    # load glove pre-trained embedding
    PreProcessor.load_glove_vocab(EMBED_DIM)

    # tokenizer
    tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=VOCAB_SIZE)
    tokenizer.fit_on_texts(x_train)

    x_train = tokenizer.texts_to_sequences(x_train)
    x_test = tokenizer.texts_to_sequences(x_test)

    x_train = tf.keras.preprocessing.sequence.pad_sequences(x_train, maxlen=MAX_DOCUMENT_LENGTH)
    x_test = tf.keras.preprocessing.sequence.pad_sequences(x_test, maxlen=MAX_DOCUMENT_LENGTH)

    # save tokenizer
    with open(TOKEN_FILE, 'wb') as handle:
        pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

    # save vocab size
    with open(VARS_FILE, 'wb') as handle:
        vars = {
            'MAX_DOCUMENT_LENGTH': MAX_DOCUMENT_LENGTH,
            'VOCAB_SIZE': VOCAB_SIZE,
            'EMBED_DIM': EMBED_DIM,
            'N_CLASSES': N_CLASSES
        }
        pickle.dump(vars, handle, protocol=pickle.HIGHEST_PROTOCOL)

    # generate embed dict
    embed_dict= PreProcessor.create_embed_dict(EMBED_DIM)
    # generate embed matrix
    embed_matrix = PreProcessor.create_embed_matrix(embed_dict, tokenizer, (VOCAB_SIZE, EMBED_DIM))
    # save embed matrix
    with open(EMB_FILE, 'wb') as handle:
        pickle.dump(embed_matrix, handle, protocol=pickle.HIGHEST_PROTOCOL)

    # Build model
    classifier = tf.contrib.learn.Estimator(
        model_fn=CNN2(N_CLASSES, VOCAB_SIZE, EMBED_DIM, embed_matrix),
        model_dir=MODEL_OUTPUT_DIR)

    # Train and predict
    classifier.fit(x_train, y_train, steps=STEPS)

    # Evaluate model
    y_predicted = [
        p['class'] for p in classifier.predict(x_test, as_iterable=True)
    ]

    score = metrics.accuracy_score(y_test, y_predicted)
    print ('Accuracy: {0:f}'.format(score))

if __name__ == '__main__':
    tf.app.run(main=main)
