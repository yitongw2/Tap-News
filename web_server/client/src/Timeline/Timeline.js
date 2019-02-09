import './Timeline.css';

import React from 'react';

class Timeline extends React.Component {
  render() {
    return (
      <div className='container-fluid timeline_container card'>
        <div className='timeline-header'>
          How Do We Deliver News To You?
        </div>
        <hr />
        <div className='timeline'>
          <div className='event'>
            <div className='panel card'>
              <div className="card-body">
                <h5 className="card-title">News Monitor</h5>
                <h6 className="card-subtitle mb-2 text-muted">Download news from News API</h6>
                <p className="card-text">
                  News Monitor is an essential component of our news pipeline.
                  This is an automated python script that runs constantly but with breaks.
                  It first downloads news abstract from <a href='https://newsapi.org'>News API</a>.
                  In the same time, redis store keeps a copy of the news id.
                  When all is done, the news will be sent to a dedicated message queue deployed on <a href='https://www.cloudamqp.com/'>CloudAMQP</a> for scraper.
                </p>
                <p className="card-text">
                  Currently, our news scource are below:
                </p>
                <ul className="list-group">
                  <li className="list-group-item">BBC News</li>
                  <li className="list-group-item">CNN</li>
                  <li className="list-group-item">Bloomberg</li>
                  <li className="list-group-item">Bleacher Report</li>
                  <li className="list-group-item">Reuters</li>
                </ul>
              </div>

            </div>
          </div>
          <div className='event'>
            <div className='panel panel_invert card'>
              <div className="card-body">
                <h5 className="card-title">News Scraper</h5>
                <h6 className="card-subtitle mb-2 text-muted">A Scrapy spider that crawls news</h6>
                <p className="card-text">
                  News scraper is a web spider written with <a href='https://scrapy.org/'>Scrapy</a>.
                  It constantly listens for news abstract from the clould message queue.
                  When no abstract is in the queue, it keeps idle and waits.
                  Once it receives a news abstract, it starts to crawl the content of the news according to the url provided.
                  Then, it parses the downloaded webpage and extracts the content of the news.
                  Finally, it sends the complete news with content included.
                </p>
              </div>
            </div>
          </div>
          <div className='event'>
            <div className='panel card'>
              <div className="card-body">
                <h5 className="card-title">News Deduper</h5>
                <h6 className="card-subtitle mb-2 text-muted">Exclude duplicate news from queue</h6>
                <p className="card-text">
                  News deduper is an automated python script that waits for news from message queue.
                  Once it receives a news, it first extracts today's news from MongoDB database and then convert them into tf-idf vector and compares their pairwise sim.
                  If a news is confirmed to be unique, its content will be sent to news classifier for topic classification and inserted to MongoDB database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Timeline;
