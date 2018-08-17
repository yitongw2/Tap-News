import numpy as np
import tensorflow as tf
import pandas as pd
import pickle
import shutil

from tensorflow import keras
from sklearn.model_selection import train_test_split
from preprocessor import PreProcessor
from os import mkdir
from os.path import join, normpath, dirname
from sklearn import metrics

REMOVE_PREVIOUS_MODEL = True
MODEL_OUTPUT_DIR = normpath(join(dirname(__file__), '../model/'))
DATA_SET_FILE = normpath(join(dirname(__file__), '../data/simple_data/labeled_news.csv'))
MODEL_FILE = normpath(join(dirname(__file__), '../model/keras_model.h5'))
TOKEN_FILE = normpath(join(dirname(__file__), '../model/tokenizer'))
VARS_FILE = normpath(join(dirname(__file__), '../model/vars'))

MAX_DOCUMENT_LENGTH = 200
VOCAB_SIZE = 20000
EMBED_DIM = 50
N_CLASSES = 8

LSTM_LAYERS = 100
FILTER_SIZE = 64
POOL_SIZE = 4

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

model = keras.Sequential()
model.add(keras.layers.Embedding(VOCAB_SIZE, EMBED_DIM, input_length=MAX_DOCUMENT_LENGTH))
model.add(keras.layers.Conv1D(FILTER_SIZE, EMBED_DIM, activation='relu'))
model.add(keras.layers.MaxPooling1D(pool_size=POOL_SIZE))
model.add(keras.layers.LSTM(LSTM_LAYERS, dropout=0.2, recurrent_dropout=0.2))
model.add(keras.layers.Dense(N_CLASSES, activation='softmax'))
model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

model.summary()

model.fit(x_train, y_train, epochs=3)

accr = model.evaluate(x_test,y_test)
print('Test set\n  Loss: {:0.3f}\n  Accuracy: {:0.3f}'.format(accr[0],accr[1]))

model.save(MODEL_FILE)
del model
