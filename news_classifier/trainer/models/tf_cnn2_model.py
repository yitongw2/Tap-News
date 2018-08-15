import tensorflow as tf
import numpy as np
import pickle

def CNN2(N_CLASSES, VOCAB_SIZE, EMBEDDING_SIZE, EMBED_MATRIX):
    # custom params
    N_FILTERS = 10
    WINDOW_SIZE = 20
    FILTER_SHAPE1 = [WINDOW_SIZE, EMBEDDING_SIZE]
    FILTER_SHAPE2 = [WINDOW_SIZE, N_FILTERS]
    POOLING_WINDOW = 4
    POOLING_STRIDE = 2
    LEARNING_RATE = 0.05

    def model_fn(features, target):
        target = tf.one_hot(target, N_CLASSES, 1, 0)
        embed_matrix = tf.cast(EMBED_MATRIX, tf.float32)
        word_vectors = tf.nn.embedding_lookup(embed_matrix, features)
        word_vectors = tf.expand_dims(word_vectors, 3)
        conv1 = tf.contrib.layers.convolution2d(word_vectors, N_FILTERS, FILTER_SHAPE1, padding='VALID')
        pool1 = tf.nn.max_pool(conv1, ksize=[1, POOLING_WINDOW, 1, 1], strides=[1, POOLING_STRIDE, 1, 1], padding='SAME')
        pool1 = tf.transpose(pool1, [0, 1, 3, 2])
        conv2 = tf.contrib.layers.convolution2d(pool1, N_FILTERS, FILTER_SHAPE2, padding='VALID')
        pool2 = tf.squeeze(tf.reduce_max(conv2, 1), squeeze_dims=[1])
        logits = tf.contrib.layers.fully_connected(pool2, N_CLASSES, activation_fn=None)
        loss = tf.contrib.losses.softmax_cross_entropy(logits, target)

        train_op = tf.contrib.layers.optimize_loss(
            loss,
            tf.contrib.framework.get_global_step(),
            optimizer='Adam',
            learning_rate=LEARNING_RATE)

        return ({
          'class': tf.argmax(logits, 1),
          'prob': tf.nn.softmax(logits)
        }, loss, train_op)

    return model_fn
