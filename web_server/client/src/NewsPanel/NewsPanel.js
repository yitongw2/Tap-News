import './NewsPanel.css';

import _ from 'lodash';

import loader from '../Resource/loader.gif';
import NewsCard from '../NewsCard/NewsCard.js';
import Auth from '../Auth/Auth';

import React from 'react';

class NewsPanel extends React.Component {
  constructor() {
    super();
    this.state = {news: null, pageNum: 1, loadedAll: false};
  }

  componentDidMount() {
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
    window.addEventListener('scroll', () => {this.handleScroll()});
  }

  render() {
    if (this.state.news) {
      return (
        <div>
          {this.renderNews()}
        </div>
      );
    } else {
      return (
        <div id='msg-app-loading'>
          <img src={loader} alt='loadings'></img>
        </div>
      );
    }
  }

  renderNews() {
    const news_card_list = this.state.news.map(
      one_news => {
        return (
          <a className='list-group-item' key={one_news.digest} href='/'>
            <NewsCard news={one_news} />
          </a>
        );
      }
    );

    return (
      <div className='container-fluid'>
        <div className='list-group'>
          {news_card_list}
        </div>
      </div>
    );
  }

  loadMoreNews() {
    console.log('Actually triggered loading more news');

    if (this.state.loadedAll === true){
      return;
    }

    const news_url = 'http://' + window.location.hostname +
      ':3000/news/userId=' + Auth.getEmail() + "&pageNum=" + this.state.pageNum;

    const request = new Request(encodeURI(news_url), {
      method: 'GET',
      headers: {
        'Authorization': 'bearer ' + Auth.getToken(),
      }
    });

    fetch(request)
      .then(res => res.json())
      .then(news => {
        console.log('# of news fetched ', news.length);
        if (!news || news.length === 0) {
          this.setState({
            loadedAll:true
          });
        }
        this.setState({
          news: this.state.news? this.state.news.concat(news) : news,
          pageNum: this.state.pageNum + 1
        });
      });
  }


  handleScroll() {
    let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
      this.loadMoreNews();
    }
  }
}

export default NewsPanel;
