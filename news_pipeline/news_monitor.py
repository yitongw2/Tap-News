import datetime
import hashlib #md5hash
import redis

from tap_news_utils.news_api_client import NewsAPIClient
from tap_news_utils.cloudAMQP_client import CloudAMQPClient

from config import SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME, REDIS_HOST, REDIS_PORT

COMP_NAME = 'news_monitor'

# every 10 seconds for every loop, may consider to set a longer time
SLEEP_TIME_IN_SECONDS = 10
NEWS_TIME_OUT_IN_SECONDS = 3600 * 24 * 3 #newsexpiresin3days

NEWS_SOURCES = [
    'bbc-news',
    'cnn',
    'bloomberg',
    'bleacher-report',
    'reuters'
]

NEWS_API_KEY = "2ffd0fc65c15466b8bb037a5dc41d9c6"

# connect redis_client and cloundAMQP_client
redis_client = redis.StrictRedis(REDIS_HOST,REDIS_PORT)
cloudAMQP_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
newsAPI_client = NewsAPIClient(NEWS_API_KEY)

def run():
    print (COMP_NAME, 'start to run')
    while (True):
        news_list = newsAPI_client.getNewsFromSource(NEWS_SOURCES)
        """
        news_list = [
            {'author': 'BBC News', 'title': 'Trump wants Nato to double spending target', 'description': 'The US president says allies should each aim to spend 4% of GDP on their armed forces.', 'url': 'http://www.bbc.co.uk/news/world-europe-44799027', 'urlToImage': 'https://ichef.bbci.co.uk/images/ic/1024x576/p06dfxp0.jpg', 'publishedAt': '2018-07-11T16:08:57Z'},
            {'author': 'BBC News', 'title': 'First hospital images emerge of Thai boys', 'description': 'The boys are seen celebrating, as new details emerge of how they were sedated for the rescue.', 'url': 'http://www.bbc.co.uk/news/world-asia-44797035', 'urlToImage': 'https://ichef.bbci.co.uk/news/1024/branded_news/F760/production/_102482336_mediaitem102482335.jpg', 'publishedAt': '2018-07-11T13:05:40Z'},
            {'author': 'BBC News', 'title': "'Tiny bit of hope became reality'", 'description': 'In an exclusive BBC interview, the head of the Thai Navy Seals describes his relief following the successful cave rescue operation.', 'url': 'http://www.bbc.co.uk/news/world-asia-44790863', 'urlToImage': 'https://ichef.bbci.co.uk/news/1024/branded_news/C13B/production/_102476494_p06dfh0s_e.jpg', 'publishedAt': '2018-07-11T05:26:18Z'},
            {'author': 'BBC Sport', 'title': 'World Cup 2018: Croatia v England', 'description': "England's bid to reach a first World Cup final since 1966 ends in the last four with an extra-time defeat by Croatia in Moscow.", 'url': 'http://www.bbc.co.uk/sport/football/44706648', 'urlToImage': 'https://ichef.bbci.co.uk/onesport/cps/624/cpsprodpb/13590/production/_97584297_breaking_news.png', 'publishedAt': '2018-07-11T20:43:13Z'},
            {'author': 'BBC News', 'title': "Kylie Jenner 'on track to be billionaire'", 'description': 'But some are debating whether the cosmetics entrepreneur is truly "self-made", as Forbes says.', 'url': 'http://www.bbc.co.uk/news/world-us-canada-44802123', 'urlToImage': 'https://ichef.bbci.co.uk/news/1024/branded_news/AD61/production/_102458344_gettyimages-956164946.jpg', 'publishedAt': '2018-07-11T21:25:32Z'},
            {'author': 'BBC News', 'title': 'Killing rats could save coral reefs', 'description': 'Threatened coral reefs can be protected by eradicating destructive rats that have invaded tropical islands, scientists say.', 'url': 'http://www.bbc.co.uk/news/science-environment-44799420', 'urlToImage': 'https://ichef.bbci.co.uk/news/1024/branded_news/1514C/production/_102484368_p066lqx2.jpg', 'publishedAt': '2018-07-12T00:00:47Z'},
            {'author': 'BBC News', 'title': 'May hopes Trump visit will boost US-UK links', 'description': 'There will be meetings with the PM and the Queen, but mass protests across the UK are expected.', 'url': 'http://www.bbc.co.uk/news/uk-44802315', 'urlToImage': 'https://ichef.bbci.co.uk/news/1024/branded_news/1093A/production/_102489876_hi048088384.jpg', 'publishedAt': '2018-07-12T01:23:42Z'},
            {'author': 'BBC News', 'title': 'Trump baby blimp ready to take first steps', 'description': 'The final tests on the 20ft balloon of the US president have been completed ahead of his UK visit.', 'url': 'http://www.bbc.co.uk/news/uk-44798408', 'urlToImage': 'https://ichef.bbci.co.uk/news/1024/branded_news/10188/production/_102482956_gettyimages-996075192.jpg', 'publishedAt': '2018-07-11T14:02:54Z'},
            {'author': 'BBC News', 'title': 'Sky battle rages as Comcast offers £26bn', 'description': "Rupert Murdoch's Fox increases its offer for Sky as part of a takeover battle with Comcast.", 'url': 'http://www.bbc.co.uk/news/business-44802670', 'urlToImage': 'https://ichef.bbci.co.uk/news/1024/branded_news/1430A/production/_102489628_gettyimages-654462580.jpg', 'publishedAt': '2018-07-11T22:56:11Z'},
            {'author': 'BBC News', 'title': 'Woman arrested over Mexican grandpa attack', 'description': 'The California woman allegedly told the grandfather "go back to your country" while attacking him.', 'url': 'http://www.bbc.co.uk/news/world-us-canada-44797913', 'urlToImage': 'https://ichef.bbci.co.uk/news/1024/branded_news/616A/production/_102483942_elderly-man-beaten-la-woman.jpg', 'publishedAt': '2018-07-11T15:46:48Z'}
            ]
        """
        num_of_news = 0
        for news in news_list:
            news_digest = hashlib.md5(news['title'].encode('utf-8')).hexdigest()
            # check in redis
            if redis_client.get(news_digest) is None:
                num_of_news += 1
                # every news has unique digest
                news['digest'] = news_digest
                # use utc time to avoid different time zones
                if news['publishedAt'] is None:
                    news['publishedAt'] = datetime.datetime.utcnow().strftime("%Y-%m-%dT %H:%M:%SZ")
                # use as hash set, value does not matter
                redis_client.set(news_digest, "True")
                redis_client.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)
                # send message to queue for next tast
                cloudAMQP_client.sendMessage(news)

        print (COMP_NAME, "Fetched %d news." % num_of_news)
        # use cloudAMQP_client.sleep keep queue heartbeat
        cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)

if __name__ == '__main__':
    run()
