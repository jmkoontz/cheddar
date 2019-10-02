import React, { Component } from 'react';
import { Input, Button, Alert, Row, Col} from 'reactstrap';
import './SignIn.css'

class AccountSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      new_password: null,
      confirm_password: null,
      new_email: null,
    }
  }

  deleteAccount = () => {

  };


  render(){
    return(

      <div className="BigDivArea">
        <h3>Edit Account Settings</h3>
        <Row>
          <Col md='3'/>
          <Col md='2'>

          </Col>
        </Row>
      </div>

    );
  }

}

export default AccountSettings;