import operations

def test_getNewsSummariesForUser_basic():
    news = operations.getNewsSummariesForUser('test', 1)
    print ('operations_test getNewsSummariesForUser', news)
    one_news = operations.getOneNews()
    print ('operations_test getOneNews', one_news)

if __name__=="__main__":
    while (True):
        test_getNewsSummariesForUser_basic()
