import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Input, Form, Button, Alert, Row, Col} from 'reactstrap';
import firebase from '../../firebase.js';
import axios from 'axios';
import './SignIn.css'
import {fireauth} from "../../firebase";

class AccountSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      new_password: null,
      confirm_password: null,

      alert_message: null,
      alert_visible: false,
      alert_color: null,

      modal_visible: false,

      reauthenticate_visible: false,
      current_password: null,
    };

  }

  confirmDelete = () => {
    this.setState({ modal_visible: true });

  };

  deleteAccount = () => {
    let uid = sessionStorage.getItem('user');
    axios.delete(`http://localhost:8080/Cheddar/${uid}`).then(() => {
      window.location.reload();
      fireauth.currentUser.delete();  // delete invalid user from Firebase
      sessionStorage.clear(); // remove saved UID
    }).catch((error) => {
      if (error.response && error.response.data) {
        console.log(error.response.data.error);
      } else {
        console.log(error);
      }
    });
  };

  openReauth = (ev) => {
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
    this.setState({
      new_password: new_password,
      confirm_password: confirm_password,
      reauthenticate_visible: true,
    });

  };

  updatePassword = () => {
    let self = this;
    let user = firebase.auth().currentUser;
    user.updatePassword(self.state.new_password).then(function() {
      self.passwordUpdatedSuccessfully();
    }).catch(function(error){
      self.setErrorWithRef(self, error);
    });
  };

  setError(message){
    this.setState({
      alert_message: message,
      alert_visible: true,
      alert_color: "danger",
    });
  }

  setErrorWithRef(self, message){
    self.setState({
      alert_message: message.message,
      alert_visible: true,
      alert_color: 'danger',
    });
  }

  passwordUpdatedSuccessfully(){
    let self = this;
    self.setState({
      alert_message: "Your password has been updated successfully.",
      alert_visible: true,
      alert_color: 'success',
    });
  }

  onDismiss = () => {
    this.setState({
      alert_message: null,
      alert_visible: false,
      alert_color: null,
    });
  };

  reauthenticate = (ev) => {
    ev.preventDefault();
    let self = this;
    let current_password = ev.target.currentpassword.value;

    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      current_password
    );

    user.reauthenticateWithCredential(credential).then(function() {
      self.closeReauthenticate();
      self.updatePassword();
    }).catch(function(error) {
      self.closeReauthenticate();
      self.setErrorWithRef(self, error);
    });
  };

  closeModal = () => {
    let self = this;
    self.setState({ modal_visible: false });
  };

  closeReauthenticate = () => {
    let self = this;
    self.setState( { reauthenticate_visible: false });
  };

  getEmail = () => {
    return firebase.auth().currentUser.email;
  };

  render(){
    return(

      <div className="BigDivArea">
        <div style={{height: '1em'}}/>
        <h3>Edit Account Settings</h3>
        <hr/>

        <Modal isOpen={this.state.modal_visible} toggle={this.closeModal}>
          <ModalHeader toggle={this.closeModal}> Are you sure you want to delete your account? </ModalHeader>
          <ModalBody>
            <p>This will delete all of your saved data!</p>
            <hr/>
            <Button color='danger' size='sm' onClick={this.deleteAccount}>Delete My Account and My Data</Button>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.reauthenticate_visible} toggle={this.closeReauthenticate}>
          <ModalHeader toggle={this.closeReauthenticate}> Please Confirm your Current Password </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.reauthenticate}>
              <Row>
                <Col md='2'/>
                <Col md='8'>
                  <Input type='password' id='currentpassword' bsSize='lg' placeholder='Current Password' style={{border: '1px solid #4682B4'}}/>
                </Col>
              </Row>
              <div style={{height: '1em'}}/>
              <Row>
                <Col md='3'/>
                <Col md='6'>
                  <Button className='signInButton' size='lg'>Confirm</Button>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <Row>
          <Col md='4'/>
          <Col md='4'>
            <Input type='text' readOnly bsSize='lg' placeholder={this.getEmail()}/>
          </Col>
        </Row>

        <hr/>
        <Form onSubmit={this.openReauth}>
          <Row>
            <Col md='3'/>
            <Col md='3'>
              <Input type='password' id='newpassword' bsSize='lg' placeholder='New Password' style={{border: '1px solid #4682B4'}}/>
            </Col>
          </Row>

          <div style={{height: '1em'}}/>

          <Row>
            <Col md='3'/>
            <Col md='3'>
              <Input type='password' id='confirmpassword' bsSize='lg' placeholder='Confirm Password' style={{border: '1px solid #4682B4'}}/>
            </Col>
            <Col md='3'>
              <Button className='signInButton' size='lg'> Update Password </Button>
            </Col>
          </Row>

          <div style={{height: '1em'}}/>

          <Row>
            <Col md='3'/>
            <Col md='6'>
              <Alert color={this.state.alert_color} isOpen={this.state.alert_visible} toggle={this.onDismiss}>
                {this.state.alert_message}
              </Alert>
            </Col>
          </Row>

        </Form>

        <hr/>
        <div style={{height: '1em'}}/>

        <Row>
          <Col md='4'/>
          <Col md='4'>
            <Button color='danger' className='deleteButton' size='lg' onClick={this.confirmDelete}> Delete My Account </Button>
          </Col>
        </Row>
      </div>

    );
  }

}

export default AccountSettings;