import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import Header from './header/Header';
import Overview from './Overview/Overview';
import Budgets from './Budgets/Budgets';
import CreateSavings from './Saving/CreateSavings'
import Saving from './Saving/Saving';
import Investments from './Investments/Investments';
import Debts from './Debts/Debts';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" render={() => <Overview />} />
        <Route path="/budgets" render={() => <Budgets />} />
        <Route path="/createsavings" render={() => <CreateSavings />} />
        <Route path="/saving" render={() => <Saving />} />
        <Route path="/investments" render={() => <Investments />} />
        <Route path="/debts" render={() => <Debts />} />
        <Route path="/" render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
}

export default App;
