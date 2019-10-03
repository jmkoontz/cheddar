import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Calendar from 'react-calendar';
import axios from 'axios';

import './EventModal.css';

class EventModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      event: {},
      isSaved: true
    };
  }

  open = (event) => {
    this.setState({
      isOpen: true,
      isSaved: true,
      event
    });
  };

  handleSave = () => {
    // Save stuff here
    if (this.props.isNew) {
      axios.post('http://localhost:8080/Cheddar/Calendar/event/' + sessionStorage.getItem('user'), this.state.event).then((resp) => {
        this.setState({isSaved: true});
        this.handleClose();
      });
    } else {
      axios.put('http://localhost:8080/Cheddar/Calendar/event/' + sessionStorage.getItem('user'), this.state.event).then((resp) => {
        this.setState({isSaved: true});
        this.handleClose();
      });
    }
  };

  handleDelete = () => {
    // Delete stuff here
    axios.delete('http://localhost:8080/Cheddar/Calendar/event/' + sessionStorage.getItem('user') + '/' + this.state.event.id, this.state.event).then((resp) => {
      this.setState({isSaved: true});
      this.handleClose();
    });
  };

  handleClose = () => {
    // Check if not saved using state.isSaved
    if (!this.state.isSaved && !window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
      return;
    }

    this.setState({
      isOpen: false
    });

    if (this.props.onClose)
      this.props.onClose();
  };

  setProperty = (name, value) => {
    const newEvent = this.state.event;
    newEvent[name] = value;

    this.setState({
      event: newEvent,
      isSaved: false
    });
  };

  render () {
    const event = this.state.event;

    if (!event)
      return null;

    return (
      <Modal show={this.state.isOpen} onHide={this.handleClose}>
        <Modal.Header closeButton>
          {
            this.props.isNew ?
              <Modal.Title>Add Transaction</Modal.Title>
              : <Modal.Title>Edit Transaction</Modal.Title>
          }
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={event.title}
                onChange={(e) => {
                  this.setProperty("title", e.target.value);
                }}
                placeholder="Enter title"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Amount Due</Form.Label>
              <Form.Control
                type={"number"}
                value={event.amount}
                onChange={(e) => {
                  this.setProperty("amount", e.target.value);
                }}
                placeholder="$0"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Selected Date</Form.Label>
              <Calendar
                value={event.start}
                onChange={(date) => {
                  this.setProperty("start", date);
                  this.setProperty("end", date);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
          {this.props.isNew ? null : <Button variant="danger" onClick={this.handleDelete}>Delete</Button>}
          <Button variant="primary" onClick={this.handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EventModal;