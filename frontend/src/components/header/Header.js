import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import History from "../../history";
import { Col } from 'reactstrap';
import firebase from '../../firebase.js'

import './Header.css';
import Tip from "../Tip/Tip";

class Header extends Component {
  constructor(props) {
    super(props);

    let tabValue = 0;
    if (!History.location.pathname.indexOf("/budgets")) {
      tabValue = 1;
    } else if (!History.location.pathname.indexOf("/saving")) {
      tabValue = 2;
    } else if (!History.location.pathname.indexOf("/investments")) {
      tabValue = 3;
    } else if (!History.location.pathname.indexOf("/debts")) {
      tabValue = 4;
    } else if (!History.location.pathname.indexOf("/transactions")) {
      tabValue = 5;
    } else if (!History.location.pathname.indexOf("/account-settings")) {
      tabValue = 6;
    } else if (!History.location.pathname.indexOf("/assets")) {
      tabValue = 8;
    } else if (!History.location.pathname.indexOf("/retirement")) {
      tabValue = 9;
    }
    

    this.state = {
      tabValue: tabValue
    };
  }

  handleTabChange = (newValue) => {
    this.setState({ tabValue: newValue });
    if (newValue === '0') {
      History.push("/");
    } else if (newValue === '1') {
      History.push("/budgets");
    } else if (newValue === '2') {
      History.push("/saving");
    } else if (newValue === '3') {
      History.push("/investments");
    } else if (newValue === '4') {
      History.push("/debts");
    } else if (newValue === '5') {
      History.push("/transactions");
    } else if (newValue === '6') {
      History.push("/account-settings");
    } else if (newValue === '7') {
      this.signOut();
    } else if (newValue === '8') {
      History.push("/assets");
    } else if (newValue === '9') {
      History.push("/retirement");
    }

  };

  signOut() {
    firebase.auth().signOut().catch(function(error){
      console.log(error);
    });
    sessionStorage.clear();
  };

  renderTabs = () => {
    return (
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto nav-container" onSelect={this.handleTabChange} activeKey={this.state.tabValue}>
            <Nav.Link eventKey={0}><span id={"icon-tab"}><img src={"Icon.png"} id={"icon"}/></span></Nav.Link>
            <span id={"overview-tab"}><Nav.Link eventKey={0}>Overview</Nav.Link></span>
            <span id={"budgets-tab"}><Nav.Link eventKey={1}>Budgets</Nav.Link></span>
            <span id={"saving-tab"}><Nav.Link eventKey={2}>Saving</Nav.Link></span>
            <span id={"investments-tab"}><Nav.Link eventKey={3}>Investments</Nav.Link></span>
            <span id={"debts-tab"}><Nav.Link eventKey={4}>Debts</Nav.Link></span>
            <span id={"transactions-tab"}><Nav.Link eventKey={5}>Transactions</Nav.Link></span>
            <span id={"assets-tab"}><Nav.Link eventKey={8}>Assets</Nav.Link></span>
            <span id={"retirement-tab"}><Nav.Link eventKey={9}>Retirement</Nav.Link></span>
          </Nav>
          <Nav pullRight onSelect={this.handleTabChange} activeKey={this.state.tabValue}>
            <Nav.Link eventKey={6}>👤</Nav.Link>
            <Nav.Link eventKey={7}>Sign Out</Nav.Link>
          </Nav>

          <Tip text={"View important details"} target={"overview-tab"}/>
          <Tip text={"Create a budget"} target={"budgets-tab"}/>
          <Tip text={"Start saving towards a goal"} target={"saving-tab"}/>
          <Tip text={"Track important investments"} target={"investments-tab"}/>
          <Tip text={"Create a plan to destroy debt"} target={"debts-tab"}/>
          <Tip text={"Track your spending"} target={"transactions-tab"}/>
          <Tip text={"List your biggest assets"} target={"assets-tab"}/>
          <Tip text={"Plan for retirement"} target={"retirement-tab"}/>
        </Navbar.Collapse>
    );
  };

  render() {
    return (
      <div id={"header"}>
        <Navbar id={"navbar"}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {this.renderTabs()}
        </Navbar>
      </div>
    );
  }
}

export default Header;
