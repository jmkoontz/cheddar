import React from 'react';
import { Component } from 'react';
import { Button } from 'reactstrap';
import { withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';

const SavingsPlan = ({title, category, goalAmount, goalMonth, goalYear, monthlyCont}) => (
    <div>
     <h3>{title}</h3>
     <p>Save ${goalAmount} by {goalMonth} {goalYear}</p>
    </div>
)

class Saving extends React.Component {
  constructor(props){
    super(props);
    this.state = { userID: sessionStorage.getItem('user'), show: false, savingsList: [], title: '', category: 'Choose a category', goalAmount: '', goalDate: {month: 'january', year: (new Date()).getFullYear()}, monthlyContribution: ''}

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
    //alert('A new goal \'' + this.state.title + '\' of $' + this.state.goalAmount + ' was submitted in ' + this.state.category + '\nYou plan to save $' + this.state.monthlyContribution + ' a month until ' + this.state.month + ' ' + this.state.year);
    // TODO: check user inputs
    axios.post(`http://localhost:8080/Cheddar/Savings/${this.state.userID}`,
      {
        title: this.state.title,
        category: this.state.category,
        goalAmount: this.state.goalAmount,
        goalYear: this.state.year,
        goalMonth: this.state.month,
        monthlyContribution: this.state.monthlyContribution
      })
      .then((response) => {
        console.log(response);
        event.preventDefault();
        this.getSavings();
        this.setState({show: false})
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getSavings = () => {
    axios.get(`http://localhost:8080/Cheddar/Savings/${this.state.userID}/`)
      .then((response) => {
        this.setState({savingsList: response.data})
        //console.log(response);
        //console.log(this.state.savingsList)
      })
      .catch((error) => {
        console.error("Error getting Savings\n" + error);
      });
  }


  componentDidMount(){
    this.getSavings();
  }

  render () {
    const years = Array.from(new Array(20),(val, index) => index + this.state.goalDate.year);
    const savings = this.state.savingsList
    return (
      <div className="BigDivArea">
        <h3>Saving!</h3>
          {(savings.length > 0 && savings[0])
            ? savings.map(plan => <SavingsPlan {...plan} />)
            : <p>You have no savings plans. Why don't you add one below</p>}
         <span className="input-group-btn">
              <Button outline color="secondary" onClick={this.handleClick} type="button">Add +</Button>
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
                <option value="Pay off Debts">Pay off Credit Card Debt</option>
                <option value="Pay off Loans">Pay off Loans</option>
                <option value="Save for Emeregency">Save for Emeregency</option>
                <option value="Save for a Trip">Save for a Trip</option>
                <option value="Other">Other</option>
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
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
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
