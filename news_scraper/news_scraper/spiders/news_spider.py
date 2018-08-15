import scrapy
from scrapy.exceptions import DontCloseSpider

from tap_news_utils.cloudAMQP_client import CloudAMQPClient
from newspaper import Article

SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://njqlwvsl:KFk07rtuur6IuZGK1EyKKRel3nHyrB4v@emu.rmq.cloudamqp.com/njqlwvsl"
SCRAPE_NEWS_TASK_QUEUE_NAME = "tap-news-scrape-news-task-queue"

DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://nvekfhak:grby6gpmQgZineVZkOCkJxWxehKj6LR-@spider.rmq.cloudamqp.com/nvekfhak"
DEDUPE_NEWS_TASK_QUEUE_NAME = "tap-news-dedupe-news-task-queue"

SLEEP_TIME_IN_SECONDS = 5

class NewsSpider(scrapy.Spider):
    name = "news"
    custom_settings = {
        'DOWNLOAD_DELAY': 2,
    }

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(NewsSpider, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_idle, signal = scrapy.signals.spider_idle)
        return spider

    def __init__(self, *args, **kwargs):
        super(NewsSpider, self).__init__(*args, **kwargs)
        self.scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
        self.dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)

    def spider_idle(self, spider):
        for request in self._read_queue():
            self.crawler.engine.crawl(request, self)

        raise DontCloseSpider()

    def start_requests(self):
        for request in self._read_queue():
            yield request

    def parse(self, response):
        msg = response.meta['msg']
        article = Article(response.url)
        article.download(input_html = response.body)
        article.parse()
        if article.text and len(article.text.strip()) > 0:
            print ('parsing ', response.url)
            msg['text'] = article.text
            self.dedupe_news_queue_client.sendMessage(msg)
        else:
            print ('parsing failed')

    def _read_queue(self):
        while (self.scrape_news_queue_client):
            msg = self.scrape_news_queue_client.getMessage()
            while (msg):
                print ('yielding requests')
                request = scrapy.Request(url = msg['url'], callback = self.parse)
                request.meta['msg'] = msg
                yield request
                msg = self.scrape_news_queue_client.getMessage()
            self.scrape_news_queue_client.sleep(10)
            return
