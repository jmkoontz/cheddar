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
      selectedEvent: null,
      isCreatingEvent: false
    };

    this.eventModal = React.createRef();
  }

  onSelectEvent = (event) => {
    this.setState({
      selectedEvent: event,
      isCreatingEvent: false
    });

    this.eventModal.current.open(event);
  };

  onSelectSlot = (event) => {
    // It's a unique id assuming the same user doesn't somehow create 2 events at the same time
    event.id = Date.now();

    this.setState({
      selectedEvent: event,
      isCreatingEvent: true
    });

    this.eventModal.current.open(event);
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
          selectable
          events={[
            {
              title: "rent due",
              start: new Date,
              end: new Date,
              allDay: true
            }, {
              title: "rent due 2",
              start: new Date,
              end: new Date,
              allDay: true
            }
          ]}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={this.onSelectEvent}
          onSelectSlot={this.onSelectSlot}
        />

        <EventModal
          ref={this.eventModal}
          event={this.state.selectedEvent}
          isNew={this.state.isCreatingEvent}
        />
      </div>
    );
  }
}

export default EventCalendar;