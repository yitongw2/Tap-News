import './Timeline.css';

import React from 'react';

class Timeline extends React.Component {
  render() {
    return (
      <div className='timeline'>
        <div className='event'>
          <div className='panel'>
            Hi
          </div>
        </div>
        <div className='event'>
          <div className='panel panel_invert'>
            Hi
          </div>
        </div>
      </div>
    );
  }
}

export default Timeline;
