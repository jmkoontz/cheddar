import React from "react";
import { Calendar, momentLocalizer  } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import EventModal from "./EventModal";

const localizer = momentLocalizer(moment);

class EventCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEvent: null
    };

    this.eventModal = React.createRef();
  }

  onSelectEvent = (event) => {
    this.setState({
      selectedEvent: event
    });

    this.eventModal.current.open();
  };

  onCloseEvent = () => {
    this.setState({
      selectedEvent: null
    });
  };

  render () {
    return (
      <div id={"calendar-container"}>
        <Calendar
          localizer={localizer}
          events={[
            {
              title: "rent due",
              start: Date.now(),
              end: Date.now(),
              allDay: true
            }, {
              title: "rent due 2",
              start: Date.now(),
              end: Date.now(),
              allDay: true
            }
          ]}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={this.onSelectEvent}
        />

        <EventModal
          ref={this.eventModal}
          event={this.state.selectedEvent}
          isNew
        />
      </div>
    );
  }
}

export default EventCalendar;