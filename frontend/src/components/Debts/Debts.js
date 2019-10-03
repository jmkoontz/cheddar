import React from 'react';
import { Component } from 'react';
import { withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'

class Debts extends React.Component {
  constructor(props){
    super(props);
    this.state = {show: false, setShow: false, category: '', nickname: '', initial: '', currBalance: '', interestRate: ''}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleClick = () => {
    this.setState({show: true})
    //History.push("/createsavings");
  }
  handleClose = () =>{
    this.setState({show: false})
  }

  handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleSubmit(event){
    alert('A new goal \'' + this.state.title + '\' of $' + this.state.goalAmount + ' was submitted in ' + this.state.category + '\nYou plan to save $' + this.state.monthlyCont + ' a month until ' + this.state.month + ' ' + this.state.year);
    event.preventDefault();
    this.setState({show: false})
  }

  render () {
    return (
      <div className="BigDivArea">
        <h3>Debts!</h3>
         <span className="input-group-btn">
              <button onClick={this.handleClick} type="button">+</button>
        </span>

        <Modal show={this.state.show} onHide={this.handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title>Add a Debt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form onSubmit={this.handleSubmit}>
              <label>
              <select name="category" value={this.state.category} onChange={this.handleChange}>
                <option value="Choose a category">Choose a category</option>
                <option value="grapefruit">Grapefruit</option>
                <option value="lime">Lime</option>
                <option value="coconut">Coconut</option>
                <option value="mango">Mango</option>
              </select>
              <br/>
                <label>
                  <b>Initial Amount Owned</b><br/>$
                  <input name="initial" type="number" value={this.state.initial} onChange={this.handleChange} />
                </label>
              <br/>
              <label>
                <b>Current Balance Owed</b><br/>$
                <input name="currBalance" type="number" value={this.state.currBalance} onChange={this.handleChange} />
              </label>
              <br/>
              <label>
                <b>Monthly Contribution</b><br/>
                <input name="interestRate" type="number" value={this.state.interestRate} onChange={this.handleChange} />
              %</label><br/>
              <b>Nickname</b> (<i>optional</i>)<br/>
                <input name="title" type="text" value={this.state.title} onChange={this.handleChange} />
              </label>
              </form>
          </Modal.Body>
          <Modal.Footer>
            <button variant="secondary" onClick={this.handleClose}>
              Close
            </button>
            <button variant="primary" onClick={this.handleSubmit}>
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Debts;
