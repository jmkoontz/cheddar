import React from "react";
import { Calendar, momentLocalizer  } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

class EventCalendar extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div id={"calendar-container"}>
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
        />
      </div>
    );
  }
}

export default EventCalendar;