import './NewsPanel.css';

import _ from 'lodash';
import { connect } from 'react-redux';
import { logOut } from '../Redux/actions';

import loader from '../Resource/loader.gif';
import NewsCard from '../NewsCard/NewsCard.js';

import React from 'react';

class NewsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      pageNum: 1,
      loadedAll: false,
      loading: true
    };
  }

  componentDidMount() {
    this.loadMoreNews();
    this.loadMoreNews = _.debounce(this.loadMoreNews, 1000);
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  render() {
    return (
      <div className='news_container'>
        {this.state.news.length === 0 && (<img id='loader' src={loader} alt='loadings'></img>)}
        {this.renderNews()}
      </div>
    );
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
    if (this.state.loadedAll === true){
      return;
    }

    const news_url = 'http://' + window.location.host +
      '/news/userId=' + this.props.email + "&pageNum=" + this.state.pageNum;

    const request = new Request(encodeURI(news_url), {
      method: 'GET',
      headers: {
        'Authorization': 'bearer ' + this.props.token,
      }
    });

    fetch(request)
      .then(res => {
        return res.json();
      }, rej => {
        this.props.deauthenticateUser();
        return {};
      })
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

const mapStateToProps = (state, ownProps) => {
  return {
    email: state.email,
    token: state.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deauthenticateUser: () => {
      logOut()(dispatch);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsPanel);
