const logger = require('./logger');

var jayson = require('jayson');
const rpc_config = require('../config/rpc_config.json');

// create a client
var client = jayson.client.http({
  port: rpc_config.PORT,
  hostname: rpc_config.HOST
});

function getOneNews(callback) {
  logger.info("rpc_client getOneNews called");
  client.request('getOneNews', [], (err, res) => {
    if (err) {
      throw err;
    }
    logger.info(res);
    callback(res);
  });
}

// Get news summaries for a user.
function getNewsSummariesForUser(user_id, page_num, callback) {
  console.log('getNewsSummariesForUser ', rpc_config.HOST);
  client.request('getNewsSummariesForUser', [user_id, page_num], (err, response) => {
    if (err) {
      throw err;
    }
    callback(response.result);
  });
}

// Log a news click event for a user.
function logNewsClickForUser(user_id, news_id) {
  client.request('logNewsClickForUser', [user_id, news_id], function(err, response) {
      if (err) throw err;
      console.log(response);
  });
}

module.exports = {
  getOneNews: getOneNews,
  getNewsSummariesForUser : getNewsSummariesForUser,
  logNewsClickForUser : logNewsClickForUser
}
