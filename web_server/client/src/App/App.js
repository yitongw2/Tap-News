import 'materialize-css/dist/css/materialize.min.css';
import './App.css';
import React from 'react';
import logo from '../Resource/logo.png';

import NewsPanel from '../NewsPanel/NewsPanel';

class App extends React.Component {
  render() {
    return (
      <div>
        <img className='logo' src={logo} alt='logo'></img>
        <div className='container'>
          <NewsPanel />
        </div>
      </div>
    );
  }
}

export default App;
