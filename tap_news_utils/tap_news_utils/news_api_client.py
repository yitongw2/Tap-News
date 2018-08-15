import requests

from json import loads

NEWS_API_ENDPOINT = "https://newsapi.org/v2/"
ARTICLES_API = "everything"

#defineconstant
CNN = 'cnn'
DEFAULT_SOURCE = [CNN]
SORT_BY_TOP = 'publishedAt'
DEFAULT_LANG = 'en'

class NewsAPIClient:
    def __init__(self, apiKey, endPoint=NEWS_API_ENDPOINT, apiName=ARTICLES_API):
        self.api_key = apiKey
        self.url = self._buildUrl(endPoint, apiName)

    def _buildUrl(self, endPoint, apiName):
        return endPoint + apiName

    def getNewsFromSource(self, sources=DEFAULT_SOURCE, sortBy=SORT_BY_TOP):
        articles = []
        payload = {
            'apiKey': self.api_key,
            'sortBy': sortBy,
            'language': DEFAULT_LANG
        }

        if len(sources) > 0:
            payload['sources'] = ','.join(sources)

        response = requests.get(self.url, params=payload)
        # response.content is a binary
        res_json = loads(response.content.decode('utf-8'))

        if res_json and res_json['status'] == 'ok':
            print ('# of news received from news api: ', len(res_json['articles']))
            for news in res_json['articles']:
                news['source'] = news['source']['name']
                articles.append(news)

        return articles
