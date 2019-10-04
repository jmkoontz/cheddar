import React from 'react';
import Calendar from "../Calendar/Calendar";
import Button from 'react-bootstrap/Button';
import EventListModal from "../Calendar/EventListModal";

import './Overview.css';

class Overview extends React.Component {
  constructor (props) {
    super(props);

    this.eventListModal = React.createRef();
    this.calendar = React.createRef();
  }

  render () {
    return (
      <div className="BigDivArea">
        <h3>Financial Overview</h3>

        <Button id={'events-button'} onClick={() => {this.eventListModal.current.open()}}>All Transactions</Button>
        <EventListModal
          ref={this.eventListModal}
          onClose={() => {this.calendar.current.displayEvents()}}
        />

        <Calendar ref={this.calendar}/>
      </div>
    );
  }
}

export default Overview;