import React from 'react';
import Alert from 'react-bootstrap/Alert';

import './Notifications.css';
import axios from "axios";

class Notifications extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      messages: []
    };
  }

  add (message) {
    const list = this.state.messages;
    list.push(message);

    this.setState({
      messages: list
    });
  }

  clear = () => {
    this.setState({
      messages: []
    });
  };

  close (index) {
    const event = this.state.messages[index];

    console.log(event);
    axios.post('http://localhost:8080/Cheddar/Calendar/dismissNotification/' + sessionStorage.getItem('user'), event).then((resp) => {
      const splice = this.state.messages;
      splice.splice(index, 1);

      this.setState({
        messages: splice
      });
    });
  }

  render () {
    const list = [];
    const messages = this.state.messages;
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      list.push(
        <Alert className={"notification"} variant={message.type} onClose={() => {this.close(i);}} dismissible key={i}>
          <Alert.Heading>{message.title}</Alert.Heading>
          <p>{message.message}</p>
        </Alert>
      );
    }

    return (
      <div id={"notifications"}>
        {list}
      </div>
    );
  }
}

export default Notifications;