import React from 'react';
import { Component } from 'react';
import { Button } from 'reactstrap';
import { withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';

class CreateSavings extends React.Component {
  constructor(props){
    super(props);
    this.state = {userID: sessionStorage.getItem('user'), savings: '', title: '', category: 'Choose a category', goalAmount: '', goalDate: {month: '', year: (new Date()).getFullYear()}, monthlyCont: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleSubmit(event){
    alert('A new goal \'' + this.state.savings.title + '\' of $' + this.state.savings.goalAmount + ' was submitted in ' + this.state.savings.category + '\nYou plan to save $' + this.state.savings.monthlyCont + ' a month until ' + this.state.savings.month + ' ' + this.state.savings.year);
    event.preventDefault();
  }

  componentDidMount(){
    const {match:{params}} = this.props;

    axios.get(`http://localhost:8080/Cheddar/Savings/${this.state.userID}/`)
      .then((response) => {
        const savingsList = response.data;
        //console.log(response);
        //console.log(this.state.savingsList)
        for (let i in savingsList){
          if (i.title === params.savingsTitle){
            this.setState({savings: i});
          }
        }
      })
      .catch((error) => {
        console.error("Error getting Savings\n" + error);
      });
  }

  render () {
    const years = Array.from(new Array(20),(val, index) => index + this.state.goalDate.year);
    return (
      <div className="BigDivArea">
        <h3>Edit Savings Goal</h3>
        <form onSubmit={this.handleSubmit}>
        <label>
          <b>Title</b><br/>
          <input name="title" type="text" value={this.state.savings.title} onChange={this.handleChange} />
        </label><br/>
        <select name="category" value={this.state.savings.category} onChange={this.handleChange}>
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
            <input name="goalAmount" type="number" value={this.state.savings.goalAmount} onChange={this.handleChange} />
          </label>
        <br/>
        <label>
        <b>Planned End Date</b><br/>
        <select name="month" value={this.state.savings.month} onChange={this.handleChange}>
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
        <select name="year" value={this.state.savings.year} onChange={this.handleChange}>
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
          <input name="monthlyContribution" type="number" value={this.state.savings.monthlyContribution} onChange={this.handleChange} />
        </label>
        </form>
      </div>
    );
  }
}

export default CreateSavings;
