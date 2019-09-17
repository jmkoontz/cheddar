import React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import Header from './header/Header';
import Overview from './Overview/Overview';
import Budgets from './Budgets/Budgets';
import Saving from './Saving/Saving';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" render={() => <Overview />} />
        <Route path="/budgets" render={() => <Budgets />} />
        <Route path="/saving" render={() => <Saving />} />
        <Route path="/" render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  );
}

export default App;
