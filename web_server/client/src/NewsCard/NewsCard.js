import './NewsCard.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Auth from '../Auth/Auth';
import moment from 'moment'

import React from 'react';

class NewsCard extends React.Component {
  redirectToUrl(url, e) {
    e.preventDefault();
    this.sendClickLog();
    window.open(url, '_blank');
  }

  sendClickLog() {
    const url = 'http://' + window.location.host +
      '/news/userId=' + Auth.getEmail() + '&newsId=' + this.props.news.digest;

    console.log('sending log click :', url);

    const request = new Request(
      encodeURI(url),
      {
        method: 'POST',
        headers: {
          'Authorization': 'bearer ' + Auth.getToken(),
        }
      }
    );

    fetch(request);
  }

  render() {
    return (
      <div class="card mb-3 news_card" onClick={(e) => this.redirectToUrl(this.props.news.url, e)}>
        {this.props.news.reason != null && <div class="card-header"><h4>{this.props.news.reason}</h4></div>}
        <img class="card-img-top news_img" alt='news' src={this.props.news.urlToImage} onerror='this.style.display = "none"'></img>
        <div class="card-body">
          <h3 class="card-title news_title">{this.props.news.title}</h3>
          <blockquote class="blockquote mb-0">
          <p class="card-text news-description ">
            {this.props.news.description}
          </p>
          <footer class="blockquote-footer">
            {this.props.news.author != null && <i><em class='news_footer'>{this.props.news.author}</em> from </i>}
            {this.props.news.source != null && <cite class='news_footer' title="Source Title">{this.props.news.source}</cite>}
          </footer>
          </blockquote>
        </div>

        {
          this.props.news.publishedAt != null &&
          <div class="card-footer">
            <small class="text-muted">Published at {moment(this.props.news.publishedAt.$date).format('YYYY-MM-DD HH:mm')}</small>
          </div>
        }

      </div>
    );
  }
}

export default NewsCard;
