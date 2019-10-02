import React, { Component } from 'react';

import { fireauth } from '../../firebase.js';
import { Form, Input, Button, Alert, Row, Col } from 'reactstrap';
//import {Redirect} from 'react-router-dom';
import axios from 'axios';
import history from '../../history';
import './SignIn.css'

class CreateAccount extends Component {

  constructor(props){
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      confirm_password: null,

      error_message: '',
      error_visible: false,

    }
  }

  onFormSubmit = (ev) => {
    ev.preventDefault();
    let firstName = ev.target.firstName.value;
    let lastName = ev.target.lastName.value;
    let email = ev.target.email.value;
    let password = ev.target.password.value;
    let confirm_password = ev.target.confirm_password.value;

    if (firstName === '') {
      this.setError('Please enter a valid first name.');
      return;
    } if (lastName === '') {
      this.setError('Please enter a valid last name.');
      return;
    } else if (email === ''){
      this.setError('Please enter a valid email.');
      return;
    } else if (password === ''){
      this.setError('Please enter a valid password.');
      return;
    } else if (confirm_password === ''){
      this.setError('Please confirm your password.')
      return;
    } else if (password !== confirm_password){
      this.setError('Passwords do not match.');
      return;
    }

    this.setState({
      firstName: firstName,
      lastName: lastName,
      email: email
    });

    this.createAccount(email, password);
  };

  createAccount(email, password){
    let self = this;
    fireauth.createUserWithEmailAndPassword(email, password).then(function (user) {
      self.addUserInfo(user);
    }).catch(function (error){
      self.setError(error.message);
    });
  };

  addUserInfo(userData){
    let self = this;
    axios.post('http://localhost:8080/Cheddar/CreateAccount', {
      _id: userData.user.uid,
      firstName: self.state.firstName,
      lastName: self.state.lastName,
      email: self.state.email
    }).then(() => {
      window.location.reload();
    }).catch((error) => {
      if (error.response && error.response.data) {
        console.log(error.response.data.error);
        fireauth.currentUser.delete();  // delete invalid user from Firebase
        sessionStorage.clear(); // remove saved UID
      } else {
        console.log(error);
      }
    });

    self.setState({
      account_created: true,
    });
  };

  setError(error){
    this.setState({
      error_message: error,
      error_visible: true,
    });
  };

  onDismiss = () => {
    this.setState({
      error_visible: false,
    });
  };

  render() {

    return (
      <div className='text-center'>

        <Row>

          <Col md='5'/>
          <Col md='2'>

            <div className='text-center'>

              <Form className='verticalCenter' onSubmit={this.onFormSubmit}>

                <h2>Create New Account!</h2>

                <div style={{height: '1em'}}/>

                <Input
                  type='text'
                  id='firstName'
                  bsSize='lg'
                  placeholder='First Name'
                  style={{border: '1px solid #4682B4'}}/>

                <div style={{height: '1em'}}/>

                <Input
                  type='text'
                  id='lastName'
                  bsSize='lg'
                  placeholder='Last Name'
                  style={{border: '1px solid #4682B4'}}/>

                <div style={{height: '1em'}}/>

                <Input type='text'
                       id='email'
                       bsSize='lg'
                       placeholder='Email'
                       style={{border: '1px solid #4682B4'}}/>

                <div style={{height: '1em'}}/>

                <Input type='password'
                       id='password'
                       bsSize='lg'
                       placeholder='Password'
                       style={{border: '1px solid #4682B4'}}/>

                <div style={{height: '1em'}}/>

                <Input type='password'
                       id='confirm_password'
                       bsSize='lg'
                       placeholder='Confirm Password'
                       style={{border: '1px solid #4682B4'}}/>

                <hr/>

                <Alert color="danger" isOpen={this.state.error_visible} toggle={this.onDismiss}>
                  {this.state.error_message}
                </Alert>

                <div style={{display: 'flex', justifyContent: 'center'}}>

                  <Button className='signInButton'> Create Account </Button>

                </div>

              </Form>

            </div>

          </Col>

        </Row>

      </div>
    );
  }

}

export default CreateAccount;
