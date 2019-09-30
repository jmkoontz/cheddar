import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class EventModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  open = () => {
    this.setState({ isOpen: true });
  };

  handleSave = () => {
    this.handleClose();
  };

  handleClose = () => {
    this.setState({
      isOpen: false
    });

    if (this.props.onClose)
      this.props.onClose();
  };

  render () {
    const event = this.props.event;

    if (!event)
      return null;

    return (
      <Modal show={this.state.isOpen} onHide={this.handleClose}>
        <Modal.Header closeButton>
          {
            this.props.isNew ?
              <Modal.Title>Create Event</Modal.Title>
              : <Modal.Title>Edit Event</Modal.Title>
          }
        </Modal.Header>

        <Modal.Body>
          <p>{event.title}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>

          <Button variant="primary" onClick={this.handleSave}>Save Event</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EventModal;