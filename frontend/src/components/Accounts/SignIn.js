import React, { Component } from 'react';
import firebase from '../../firebase.js';
import { NavLink, Redirect } from 'react-router-dom';
import { Form, Input, Button, Alert, Row, Col} from 'reactstrap';
import history from '../../history';
import './SignIn.css';

class SignIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
      error_message: '',
      error_visible: false,
    };
  }

  onSubmit = (ev) => {
    ev.preventDefault();
    let self = this;

    let email = ev.target.email.value;
    let password = ev.target.password.value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(err) {
      // Handle errors
      self.setState({
        error_message: err.message,
        error_visible: true,
      });
    });
  };

  onDismiss = () => {
    this.setState({
      error_visible: false,
    });
  };

  createAccount = () => {
    history.push({
      pathname: '/create-account',
    });
    //window.location.reload();
  };

  render() {

    return (
      <div className='text-center'>

        <Row>

          <Col md='5'/>
          <Col md='2'>

            <div className='text-center'>

              <Form className='verticalCenter' onSubmit={this.onSubmit}>

                <h2>Cheddar</h2>

                <div style={{height: '1em'}}/>

                <Input
                  type='text'
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

                <hr/>

                <Alert color="danger" isOpen={this.state.error_visible} toggle={this.onDismiss}>
                  {this.state.error_message}
                </Alert>

                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Button type='submit' className='signInButton'> Sign In </Button>
                </div>

                <div style={{height: '1em'}}/>

              </Form>

              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button className='signInButton' onClick={this.createAccount}> Create New Account </Button>
              </div>

              <div/>

            </div>

          </Col>

        </Row>

      </div>
    )

  };
}

export default SignIn;