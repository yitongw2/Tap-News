import string, re, os, zipfile, io, requests, time, sys, nltk
import pandas as pd
import tensorflow as tf
import numpy as np
from sklearn import metrics
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import word_tokenize


class GloveZipDownloadError(Exception):
    pass

GLOVE_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), '../data/glove.6B'))
GLOVE_ZIP_FILE = os.path.normpath(os.path.join(os.path.dirname(__file__), '../data/glove.6B/glove.6B.zip'))

GLOVE_DOWNLOAD_URL = 'http://nlp.stanford.edu/data/glove.6B.zip'

nltk.download('stopwords')
nltk.download('punkt')

class PreProcessor:
    @staticmethod
    def create_embed_dict(EMB_DIM):
        embed_dict = dict()
        emb_file = os.path.normpath(os.path.join(os.path.dirname(__file__), '../data/glove.6B/glove.6B.{}d.txt'.format(EMB_DIM)))
        with open(emb_file) as file:
            for line in file.readlines():
                row = line.strip().split()
                word = row[0]
                embed_vect = [float(i) for i in row[1:]]
                embed_dict[word] = embed_vect
        return embed_dict

    @staticmethod
    def create_embed_matrix(embed_dict, tokenizer, shape):
        miss = 0
        embed_matrix = np.zeros(shape)
        for word, index in tokenizer.word_index.items():
            embed_vect = embed_dict.get(word, None)
            if embed_vect is not None:
                embed_matrix[index] = embed_vect
            else:
                embed_matrix[index] = np.random.randn(shape[1])
                miss += 1

        embed_matrix[0] = embed_dict['unk']
        print ('Missing embedding : ', miss)
        return embed_matrix

    @staticmethod
    def _download_zip_file(url, save_to):
        r = requests.get(url, stream=True)

        if r.status_code != 200:
            raise GloveZipDownloadError('Failed to download GLOVE file from %s ' % GLOVE_DOWNLOAD_URL)

        total_size = int(r.headers.get('content-length'))
        start_time = time.time()
        count = 1
        block_size = 512
        with open(save_to, "wb") as f:
            for chunk in r.iter_content(chunk_size=block_size):
                if chunk:
                    duration = time.time() - start_time
                    progress_size = int(count * block_size)
                    if duration == 0:
                        duration = 0.1
                    speed = int(progress_size / (1024 * duration))
                    percent = int(count * block_size * 100 / total_size)
                    sys.stdout.write("\r...%d%%, %d MB, %d KB/s, %d seconds passed" %
                            (percent, progress_size / (1024 * 1024), speed, duration))
                    f.write(chunk)
                    f.flush()
                    count += 1

    @staticmethod
    def unzip_glove(zip_file_path, unzip_to):
        with zipfile.ZipFile(zip_file_path, 'r') as z:
            print(f'Extracting glove embeds from {zip_file_path}')
            z.extractall(path=unzip_to)

    @staticmethod
    def load_glove_vocab(EMB_DIM=50):
        if not os.path.exists(GLOVE_DIR):
            os.mkdir(GLOVE_DIR)

        emb_file = os.path.normpath(os.path.join(os.path.dirname(__file__), '../data/glove.6B/glove.6B.{}d.txt'.format(EMB_DIM)))
        if not os.path.isfile(emb_file):
            print ('Starting to download glove.6B.zip from {}'.format(GLOVE_DOWNLOAD_URL))
            try:
                PreProcessor._download_zip_file(GLOVE_DOWNLOAD_URL, GLOVE_ZIP_FILE)
                PreProcessor.unzip_glove(GLOVE_ZIP_FILE, GLOVE_DIR)
            except Exception as e:
                raise
            finally:
                os.remove(GLOVE_ZIP_FILE)

    @staticmethod
    def clean_text(text):
        stemmer = PorterStemmer()
        stop_words = set(stopwords.words('english'))

        ## turn to lower case
        text = text.lower()

        ## clean short handed notation
        text = re.sub(r"what's", " what is ", text)
        text = re.sub(r"\'s", " ", text)
        text = re.sub(r"\'ve", " have ", text)
        text = re.sub(r"can't", " can not ", text)
        text = re.sub(r"n't", " not ", text)
        text = re.sub(r"i'm", " i am ", text)
        text = re.sub(r"\'re", " are ", text)
        text = re.sub(r"\'d", " would ", text)
        text = re.sub(r"\'ll", " will ", text)

        ## Remove puncuation
        table = str.maketrans({key: None for key in string.punctuation})
        text = text.translate(table)

        ## clean non alphanumeric chars
        text = re.sub(r"[^A-Za-z0-9^,!.\/'+-=]", " ", text)

        # stem
        stemmed_tokens = [stemmer.stem(t) for t in word_tokenize(text) if not t in stop_words]
        text =  ' '.join(stemmed_tokens)

        return text
