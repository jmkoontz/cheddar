import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import Header from './header/Header';
import Overview from './Overview/Overview';
import Budgets from './Budgets/Budgets';
import CreateSavings from './Saving/CreateSavings'
import Saving from './Saving/Saving';
import Investments from './Investments/Investments';
import Debts from './Debts/Debts';
import Transactions from './Transactions/Transactions';
import SignIn from './Accounts/SignIn';
import firebase from '../firebase.js';
import './App.css';
import CreateAccount from "./Accounts/CreateAccount";
import AccountSettings from "./Accounts/AccountSettings";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      username: null,
      email: null,
    };
  }

  UNSAFE_componentWillMount(){
    if(this.state.uid == null){
      let self = this;
      firebase.auth().onAuthStateChanged((user) => {

        if(user){
          sessionStorage.setItem('user', user.uid);
          self.setState({
            uid: user.uid,
          });

        } else {
          self.setState({
            uid: null,
            username: null,
          });
        }
      });
    }
  }

  /*getUsername = () => {
    let uid = sessionStorage.getItem('user');
    let self = this;

    TODO need to get username from Mongo. This next line gets it from firebase

    firestore.collection('users').doc(uid).get().then((doc) => {
      self.setState({
        username: doc.data().username,
      }, function () {
        sessionStorage.setItem('username', this.state.username);
      });
    }).catch((error) => {
      console.log('Error getting username: ', error);
    });
  };*/

  render() {

    if(this.state.uid !=  null) {

      return (
        <div className="App">
          <Header/>
          <Switch>
            <Route exact path="/" render={() => <Overview/>}/>
            <Route path="/budgets" render={() => <Budgets/>}/>
            <Route path="/createsavings" render={() => <CreateSavings/>}/>
            <Route path="/saving" render={() => <Saving/>}/>
            <Route path="/investments" render={() => <Investments/>}/>
            <Route path="/debts" render={() => <Debts/>}/>
            <Route path="/transactions" render={() => <Transactions/>}/>
            <Route path="/account-settings" render={() => <AccountSettings/>}/>
            <Route path="/" render={() => <Redirect to="/"/>}/>
          </Switch>
        </div>
      );

    } else {
      return (
        <div className="App">
          <Switch>
            <Route exact path="/" render={() => <SignIn/>}/>
            <Route path="/sign-in" render={() => <SignIn/>}/>
            <Route path="/create-account" render={() => <CreateAccount/>}/>
            <Route path="/" render={() => <Redirect to="/"/>}/>
          </Switch>
        </div>
      );
    }
  }
}

export default App;
