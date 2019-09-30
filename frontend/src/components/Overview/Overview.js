import React from 'react';
import Calendar from "../Calendar/Calendar";

class Overview extends React.Component {
  render () {
    return (
      <div className="BigDivArea">
        <h3>Overview!</h3>

        <Calendar/>
      </div>
    );
  }
}

export default Overview;