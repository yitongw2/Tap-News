import json
import pika

#create client class,since we want to connect to different cloudamqp instances
class CloudAMQPClient:
    def __init__(self, cloud_amqp_url, queue_name):
        self.cloud_amqp_url = cloud_amqp_url
        self.queue_name = queue_name
        self.params = pika.URLParameters(cloud_amqp_url)
        # only allow to retry to build connection for 3 seconds
        self.params.socket_timeout = 3
        self.connection = pika.BlockingConnection(self.params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=queue_name)

    # send a message
    def sendMessage(self, message):
        # message is json object, when send message to queue,
        # we need to convert it to string
        self.channel.basic_publish(exchange = '',
                                   routing_key = self.queue_name,
                                   body = json.dumps(message))

    # get a message
    def getMessage(self):
        method_frame, header_frame, body = self.channel.basic_get(self.queue_name)
        # if error, method_frame null
        if method_frame:
            message = json.loads(body.decode('utf-8'))
            self.channel.basic_ack(method_frame.delivery_tag)
            # decode bytes to string, then convert string to json format
            return message
        else:
            print ("No message returned")
            return None

    def clearQueue(self):
        num_of_messages = 0
        while True:
            msg = self.getMessage()
            if msg is None:
                print ("Cleared %d messages." % num_of_messages)
                return
            num_of_messages += 1

    # BlockingConnection.sleep is a safer way to sleep than time.sleep(). This
    # will repond to server's heartbeat.
    def sleep(self, seconds):
        print ('Sleep for %d secs ' % seconds)
        self.connection.sleep(seconds)
