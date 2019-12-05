import React from "react";
import { Calendar, momentLocalizer  } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import EventModal from "./EventModal";
import Notifications from "../Notifications/Notifications";

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import buildUrl from "../../actions/connect";

const localizer = momentLocalizer(moment);

class EventCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEvent: null,
      isCreatingEvent: false,
      events: []
    };

    this.eventModal = React.createRef();
    this.notifications = React.createRef();
  }

  componentDidMount = () => {
    this.displayEvents();
  };

  displayEvents = () => {
    axios.get(buildUrl('/Cheddar/Calendar/' + sessionStorage.getItem('user'))).then((resp) => {
      this.setState({
        events: resp.data
      });
    });

    axios.get(buildUrl('/Cheddar/Calendar/notifications/' + sessionStorage.getItem('user'))).then((resp) => {
      this.notifications.current.clear();

      for (let i = 0; i < resp.data.length; i++) {
        const event = resp.data[i];
        this.notifications.current.add({
          ...event,
          message: event.title,
          type: "info",
          title: "You have a payment coming up:"
        });
      }
    });
  };

  onSelectEvent = (event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.start);

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
      selectedEvent: {
        start: event.start,
        end: event.start,
        id: event.id
      },
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
          events={this.state.events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={this.onSelectEvent}
          onSelectSlot={this.onSelectSlot}
        />

        <EventModal
          ref={this.eventModal}
          event={this.state.selectedEvent}
          isNew={this.state.isCreatingEvent}
          onClose={this.displayEvents}
        />

        <Notifications
          ref={this.notifications}
        />
      </div>
    );
  }
}

export default EventCalendar;