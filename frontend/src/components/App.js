import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import Header from './header/Header';
import Overview from './Overview/Overview';
import Budgets from './Budgets/Budgets';
import EditSavings from './Saving/EditSavings'
import EditDebts from './Debts/EditDebts'
import RepaymentDate from './Debts/RepaymentDateCalc'
import Saving from './Saving/Saving';
import Investments from './Investments/Investments';
import Retirement from './Investments/Retirement';
import Debts from './Debts/Debts';
import Transactions from './Transactions/Transactions';
import Tracker from './Tracker/Tracker';
import SignIn from './Accounts/SignIn';
import firebase from '../firebase.js';
import './App.css';
import CreateAccount from "./Accounts/CreateAccount";
import AccountSettings from "./Accounts/AccountSettings";
import Assets from "./Assets/Assets";

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

  render() {

    if(this.state.uid !=  null || sessionStorage.getItem('user')) {

      return (
        <div className="App">
          <Header/>
          <Switch>
            <Route exact path="/" render={() => <Overview/>}/>
            <Route path="/budgets" render={() => <Budgets/>}/>
            <Route path="/editsavings/:id" component={EditSavings}/>
            <Route path="/editdebts/:id" component={EditDebts}/>
            <Route path="/saving" render={() => <Saving/>}/>
            <Route path="/investments" render={() => <Investments/>}/>
            <Route path="/retirement" render={() => <Retirement/>}/>
            <Route path="/debts" render={() => <Debts/>}/>
            <Route path="/repaymentcalc" render={() => <RepaymentDate/>}/>
            <Route path="/transactions" render={() => <Transactions/>}/>
            <Route path="/tracker" render={() => <Tracker/>}/>
            <Route path="/account-settings" render={() => <AccountSettings/>}/>
            <Route path="/assets" render={() => <Assets/>}/>
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
