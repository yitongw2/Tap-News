from pymongo import MongoClient

MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = '27017'
DB_NAME = 'tap-news'

class MongoDBClient:
    def __init__(self, host=MONGO_DB_HOST, port=MONGO_DB_PORT):
        self.client = MongoClient("%s:%s" % (host, port))

    def get_db(self, db=DB_NAME):
        db = self.client[db]
        return db
