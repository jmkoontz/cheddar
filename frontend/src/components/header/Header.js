import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import History from "../../history";

import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);

    let tabValue = 0;
    if (!History.location.pathname.indexOf("/budgets")) {
      tabValue = 1;
    } else if (!History.location.pathname.indexOf("/saving")) {
      tabValue = 2;
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
    }
  };

  renderTabs = () => {
    return (
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" onSelect={this.handleTabChange} activeKey={this.state.tabValue}>
          <Nav.Link eventKey={0}>Overview</Nav.Link>
          <Nav.Link eventKey={1}>Budgets</Nav.Link>
          <Nav.Link eventKey={2}>Saving</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    );
  };

  render() {
    return (
      <div id={"header"}>
        <Navbar id={"navbar"}>
          <Navbar.Brand>Cheddar</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          {this.renderTabs()}
        </Navbar>
      </div>
    );
  }
}

export default Header;
