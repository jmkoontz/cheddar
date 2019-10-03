import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Input, Form, Button, Alert, Row, Col} from 'reactstrap';
import { fireauth } from '../../firebase.js';
import './SignIn.css'

class AccountSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      new_password: null,
      confirm_password: null,
      new_email: null,

      error_message: null,
      error_visible: false,

      modal_visible: false,
    }
  }

  confirmDelete = () => {
    this.setState({ modal_visible: true });

  };

  deleteAccount = () => {

  };

  updatePassword = (ev) => {
    ev.preventDefault();
    let new_password = ev.target.newpassword.value;
    let confirm_password = ev.target.confirmpassword.value;
    if(new_password === ""){
      this.setError("Please enter your new password.");
      return;
    }
    if(confirm_password === ""){
      this.setError("Please confirm your new password.");
      return;
    }
    if (new_password !== confirm_password) {
      this.setError("Passwords do not match.");
      return;
    }
    //TODO update firebase password
  };

  getEmail = () => {
    return fireauth.currentUser.email;
  };

  setError(message){
    this.setState({
      error_message: message,
      error_visible: true,
    });
  }

  onDismiss = () => {
    this.setState({
      error_message: null,
      error_visible: false,
    });
  };

  closeModal = () => {
    this.setState({ modal_visible: false });
  }

  render(){
    return(

      <div className="BigDivArea">
        <h3>Edit Account Settings</h3>
        <hr/>

        <Modal isOpen={this.state.modal_visible} toggle={this.closeModal}>
          <ModalHeader toggle={this.closeModal}> Are you sure you want to delete your account? </ModalHeader>
          <ModalBody>
            <p>This will delete all of your saved data!</p>
            <hr/>
            <Button color='danger' size='sm' onClick={this.deleteAccount}>Delete My Account and  My Data</Button>
          </ModalBody>
        </Modal>

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
              <Input type='password' id='newpassword' bsSize='lg' placeholder='New Password' style={{border: '1px solid #4682B4'}}/>
            </Col>
          </Row>

          <div style={{height: '1em'}}/>

          <Row>
            <Col md='4'/>
            <Col md='2'>
              <Input type='password' id='confirmpassword' bsSize='lg' placeholder='Confirm Password' style={{border: '1px solid #4682B4'}}/>
            </Col>
            <Col md='1'>
              <Button className='signInButton' size='lg'> Update Password </Button>
            </Col>
          </Row>

          <div style={{height: '1em'}}/>

          <Row>
            <Col md='4'/>
            <Col md='4'>
              <Alert color="danger" isOpen={this.state.error_visible} toggle={this.onDismiss}>
                {this.state.error_message}
              </Alert>
            </Col>
          </Row>

        </Form>

        <hr/>
        <div style={{height: '2em'}}/>

        <Row>
          <Col md='5'/>
          <Col md='2'>
            <Button color='danger' onClick={this.confirmDelete}> Delete My Account </Button>
          </Col>
        </Row>
      </div>

    );
  }

}

export default AccountSettings;