import React from 'react';
import Calendar from "../Calendar/Calendar";
import Button from 'react-bootstrap/Button';
import EventListModal from "../Calendar/EventListModal";

import './Overview.css';
import NotificationModal from "../Calendar/NotificationModal";

class Overview extends React.Component {
  constructor (props) {
    super(props);

    this.eventListModal = React.createRef();
    this.notificationModal = React.createRef();
    this.calendar = React.createRef();
  }

  render () {
    return (
      <div className="BigDivArea">
        <h3 className="titleSpace">Financial Overview</h3>

        <div id={'calendar-button-row'}>
          <Button className={'calendar-button'} onClick={() => {this.eventListModal.current.open()}}>All Expenses</Button>
          <Button className={'calendar-button'} onClick={() => {this.notificationModal.current.open()}}>Set Notifications</Button>
        </div>
        <EventListModal
          ref={this.eventListModal}
          onClose={() => {this.calendar.current.displayEvents()}}
        />
        <NotificationModal
          ref={this.notificationModal}
          onClose={() => {this.calendar.current.displayEvents()}}
        />

        <Calendar ref={this.calendar}/>
      </div>
    );
  }
}

export default Overview;