import React, { Component } from 'react';
import { Input, Form, Button, Alert, Row, Col} from 'reactstrap';
import { fireauth } from '../../firebase.js';
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

  updatePassword = () => {

  };

  getEmail = () => {
    return fireauth.currentUser.email;
  };

  render(){
    return(

      <div className="BigDivArea">
        <h3>Edit Account Settings</h3>
        <hr/>

        <Row>
          <Col md='4'/>
          <Col md='4'>
            <Input type='text' readOnly bsSize='lg' placeholder={this.getEmail()}/>
          </Col>
        </Row>

        <hr/>
        <Form onSubmit={this.updatePassword}>
          <Row>
            <Col md='4'/>
            <Col md='2'>
              <Input type='text' id='newpassword' bsSize='lg' placeholder='New Password' style={{border: '1px solid #4682B4'}}/>
            </Col>
          </Row>

          <div style={{height: '1em'}}/>

          <Row>
            <Col md='4'/>
            <Col md='2'>
              <Input type='text' id='confirmpassword' bsSize='lg' placeholder='Confirm Password' style={{border: '1px solid #4682B4'}}/>
            </Col>
            <Col md='1'>
              <Button className='signInButton' size='lg'> Update Password </Button>
            </Col>
          </Row>
        </Form>

        <hr/>
        <div style={{height: '2em'}}/>

        <Row>
          <Col md='5'/>
          <Col md='2'>
            <Button color='danger' onClick={this.deleteAccount}> Delete My Account </Button>
          </Col>
        </Row>
      </div>

    );
  }

}

export default AccountSettings;