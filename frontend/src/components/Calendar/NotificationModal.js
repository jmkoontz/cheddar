import React from 'react';
import Modal from "react-bootstrap/Modal";
import axios from "axios";

import './NotificationModal.css';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import buildUrl from "../../actions/connect";

class NotificationModal extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      schedule: {
        month: false,
        twoWeek: false,
        week: false,
        day: false,
        dayOf: false
      },
    };
  }

  open = () => {
    this.displaySchedule();

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

  displaySchedule = () => {
    axios.get(buildUrl('/Cheddar/Calendar/notificationSchedule/' + sessionStorage.getItem('user'))).then((resp) => {
      this.setState({
        schedule: resp.data
      });
    });
  };

  onSave = () => {
    axios.put(buildUrl('/Cheddar/Calendar/notificationSchedule/' + sessionStorage.getItem('user')), this.state.schedule).then((resp) => {
      this.handleClose();
    });
  };

  onSelectTime = (key) => {
    const newSchedule = this.state.schedule;
    newSchedule[key] = !newSchedule[key];

    this.setState({
      schedule: newSchedule
    });
  };

  render () {
    const schedule = this.state.schedule;
    return (
      <span>
        <Modal show={this.state.isOpen} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Set Notification Schedule</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>How long before an event should we notify you?</div>

            <Form id={'schedule-form'}>
              <Form.Check
                label={"One Month"}
                type="checkbox"
                checked={schedule.month}
                onChange={() => {
                  this.onSelectTime("month");
                }}
              />
              <Form.Check
                label={"Two Weeks"}
                type="checkbox"
                checked={schedule.twoWeek}
                onChange={() => {
                  this.onSelectTime("twoWeek");
                }}
              />
              <Form.Check
                label={"One Week"}
                type="checkbox"
                checked={schedule.week}
                onChange={(e) => {
                  this.onSelectTime("week");
                }}
              />
              <Form.Check
                label={"One Day"}
                type="checkbox"
                checked={schedule.day}
                onChange={(e) => {
                  this.onSelectTime("day");
                }}
              />
              <Form.Check
                label={"Day of"}
                type="checkbox"
                checked={schedule.dayOf}
                onChange={(e) => {
                  this.onSelectTime("dayOf");
                }}
              />
            </Form>

            <Form.Check
              label={"Send me email notifications"}
              type="checkbox"
              checked={schedule.emailsEnabled}
              onChange={(e) => {
                this.onSelectTime("emailsEnabled");
              }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
            <Button variant="primary" onClick={this.onSave}>Save</Button>
          </Modal.Footer>
        </Modal>
      </span>
    );
  }
}

export default NotificationModal;