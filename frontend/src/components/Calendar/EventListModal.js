import React from 'react';
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import EventModal from "./EventModal";

import './EventListModal.css';
import Button from "react-bootstrap/Button";

class EventListModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      events: [],
      selectedEvent: null,
      isCreatingEvent: false
    };

    this.eventModal = React.createRef();
  }

  open = () => {
    this.displayEvents();

    this.setState({
      isOpen: true,
    });
  };

  handleClose = () => {
    this.setState({
      isOpen: false
    });

    if (this.props.onClose)
      this.props.onClose();
  };

  displayEvents = () => {
    axios.get('http://localhost:8080/Cheddar/Calendar/' + sessionStorage.getItem('user')).then((resp) => {
      console.log(resp.data);
      this.setState({
        events: resp.data
      });
    });
  };

  onSelectEvent = (event) => {
    event.start = new Date(event.start);
    event.end = new Date(event.start);

    this.setState({
      selectedEvent: event
    });

    this.eventModal.current.open(event);
  };

  onCreateEvent = () => {
    const event = {};
    event.start = new Date();
    event.end = new Date();
    event.id = Date.now();

    this.setState({
      selectedEvent: event,
      isCreatingEvent: true
    });

    this.eventModal.current.open(event);
  };

  onCloseEvent = () => {
    this.setState({
      selectedEvent: null,
      isCreatingEvent: false
    });
  };

  render () {
    const eventsList = [];
    const events = this.state.events;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      event.start = new Date(event.start);

      eventsList.push(
        <tr className={'event-row'} onClick={() => {this.onSelectEvent(event);}} key={event.id}>
          <td>{event.start.toLocaleDateString()}</td>
          <td>{event.title}</td>
          <td>${event.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
        </tr>
      );
    }

    return (
      <span>
        <Modal show={this.state.isOpen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Upcoming Expenses</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {eventsList}
              </tbody>
            </Table>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.onCreateEvent}>Add</Button>
          </Modal.Footer>
        </Modal>

        <EventModal
          ref={this.eventModal}
          event={this.state.selectedEvent}
          isNew={this.state.isCreatingEvent}
          onClose={this.displayEvents}
        />
      </span>
    );
  }
}

export default EventListModal;