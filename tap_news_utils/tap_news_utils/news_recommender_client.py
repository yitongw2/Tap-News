import jsonrpclib

URL = "http://{}:{}"

class NewsRecommenderClient:
    def __init__(self, host, port):
        self.client = jsonrpclib.ServerProxy(URL.format(host, port))

    def getPreferenceForUser(self, userId):
        preference = self.client.getPreferenceForUser(userId)
        return preference
