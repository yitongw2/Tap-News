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
                  <li className="list-group-item">Cras justo odio</li>
                  <li className="list-group-item">Dapibus ac facilisis in</li>
                  <li className="list-group-item">Vestibulum at eros</li>
                </ul>
              </div>

            </div>
          </div>
          <div className='event'>
            <div className='panel panel_invert'>
              <div className="card-body">
                <h5 className="card-title">News Scraper</h5>
                <h6 className="card-subtitle mb-2 text-muted">A Scrapy spider that crawls news</h6>
                <p className="card-text">
                asdsa
                </p>
              </div>
            </div>
          </div>
          <div className='event'>
            <div className='panel'>
              <div className="card-body">
                <h5 className="card-title">News Scraper</h5>
                <h6 className="card-subtitle mb-2 text-muted">A Scrapy spider that crawls news</h6>
                <p className="card-text">
                  asdsa
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
