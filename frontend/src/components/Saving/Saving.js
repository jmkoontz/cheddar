import React from 'react';
import { Component } from 'react';
import { withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'

class Saving extends React.Component {
  constructor(props){
    super(props);
    this.state = {show: false, setShow: false, title: '', category: 'Choose a category', goalAmount: '', goalDate: {month: '', year: (new Date()).getFullYear()}, monthlyContribution: ''}

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
    alert('A new goal \'' + this.state.title + '\' of $' + this.state.goalAmount + ' was submitted in ' + this.state.category + '\nYou plan to save $' + this.state.monthlyContribution + ' a month until ' + this.state.month + ' ' + this.state.year);
    event.preventDefault();
    this.setState({show: false})
  }

  render () {
    const years = Array.from(new Array(20),(val, index) => index + this.state.goalDate.year);
    return (
      <div className="BigDivArea">
        <h3>Saving!</h3>
         <span className="input-group-btn">
              <button onClick={this.handleClick} type="button">+</button>
        </span>

        <Modal show={this.state.show} onHide={this.handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title>Create new Savings Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <form onSubmit={this.handleSubmit}>
              <label>
                <b>Title</b><br/>
                <input name="title" type="text" value={this.state.title} onChange={this.handleChange} />
              </label><br/>
              <select name="category" value={this.state.category} onChange={this.handleChange}>
                <option value="Choose a category">Choose a category</option>
                <option value="grapefruit">Grapefruit</option>
                <option value="lime">Lime</option>
                <option value="coconut">Coconut</option>
                <option value="mango">Mango</option>
              </select>
              <br/>
                <label>
                  <b>Goal Amount</b><br/>$
                  <input name="goalAmount" type="number" value={this.state.goalAmount} onChange={this.handleChange} />
                </label>
              <br/>
              <label>
              <b>Planned End Date</b><br/>
              <select name="month" value={this.state.month} onChange={this.handleChange}>
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              </select>
              <select name="year" value={this.state.year} onChange={this.handleChange}>
              {
                years.map((year, index) => {
                  return <option key={`year${index}`} value={year}>{year}</option>
                })
              }
              </select>
              </label>
              <br/>
              <label>
                <b>Monthly Contribution</b><br/>$
                <input name="monthlyContribution" type="number" value={this.state.monthlyContribution} onChange={this.handleChange} />
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

export default Saving;
