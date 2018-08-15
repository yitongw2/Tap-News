from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer
import operations
from config import RPC_SERVER_HOST, RPC_SERVER_PORT

"""
RPC server = a computer program causes a procedure (subroutine) to execute in a different address space (commonly on another computer on a shared network),
                which is coded as if it were a normal (local) procedure call,
                without the programmer explicitly coding the details for the remote interaction.
"""

def getOneNews():
    """ Test method to get one news """
    print ("getOneNews is called")
    return operations.getOneNews()

def get_news_summaries_for_user(user_id, page_num):
    print ("get_news_summaries_for_user is called with %s and %s" % (user_id, page_num))
    return operations.getNewsSummariesForUser(user_id, page_num)

def log_news_click_for_user(user_id, news_id):
    """ Log a news click event for a user. """
    print ("log_news_click_for_user is called with %s and %s", user_id, news_id)
    return operations.logNewsClickForUser(user_id, news_id)


RPC_SERVER = SimpleJSONRPCServer((RPC_SERVER_HOST, RPC_SERVER_PORT))
# register add function and expose the api
RPC_SERVER.register_function(getOneNews, 'getOneNews')
# registerthemethodtoRPCserver
RPC_SERVER.register_function(get_news_summaries_for_user, 'getNewsSummariesForUser')
# register log news click
RPC_SERVER.register_function(log_news_click_for_user, 'logNewsClickForUser')

print ("StartingRPCserveron%s:%d"%(RPC_SERVER_HOST,RPC_SERVER_PORT))
RPC_SERVER.serve_forever()
