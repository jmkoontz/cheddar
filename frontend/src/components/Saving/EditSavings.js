import React from 'react';
import { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { Route, NavLink, Redirect, withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';

class EditSavings extends React.Component {
  constructor(props){
    super(props);
    this.state = {userID: sessionStorage.getItem('user'), savingsId: '', title: '', category: 'Choose a category', goalAmount: '', goalDate: {month: '', year: (new Date()).getFullYear()}, monthlyContribution: '', validAmount: true, validCont: true, validCat: true, validTitle: true};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value}, () => { this.validateField(name, value) });
  }

  validateField(name, value){
    switch(name) {
      case "category":
        this.setState({validCat: (value != "Choose a category")});
        break;
      case "title":
        this.setState({validTitle: (value != "")});
        break;
      case "goalAmount":
        this.setState({validAmount: (value > 0)});
        break;
      case "monthlyContribution":
        this.setState({validCont: (value > 0)});
        break;
      default:
        break;
      }
  }

  handleSubmit(event){
    //alert('A new goal \'' + this.state.title + '\' of $' + this.state.goalAmount + ' was submitted in ' + this.state.category + '\nYou plan to save $' + this.state.monthlyContribution + ' a month until ' + this.state.month + ' ' + this.state.year);
    axios.put(`http://localhost:8080/Cheddar/Savings/${this.state.userID}/${this.state.savingsId}`,
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
        alert("Savings plan successfully updated")
        History.push("/saving")
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleDelete(event){
    axios.delete(`http://localhost:8080/Cheddar/Savings/Saving/${this.state.userID}/${this.state.savingsId}/`)
      .then((response) => {
        console.log(response);
        event.preventDefault();
        //alert("Savings plan successfully deleted")
        History.push("/saving")
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount(){
    this.getSavingsPlan();
  }

  getSavingsPlan = () => {
    const id = this.props.match.params.id;
    //console.log(id);

    axios.get(`http://localhost:8080/Cheddar/Savings/${this.state.userID}/`)
      .then((response) => {
        //this.setState({savingsList: response.data})
        //console.log(response.data);
        for(let i in response.data){
          if(response.data[i]._id == id){
            console.log(response.data[i]);
            this.setState({savingsId: response.data[i]._id, title: response.data[i].title, category: response.data[i].category, goalAmount: response.data[i].goalAmount, month: response.data[i].goalMonth, year: response.data[i].goalYear, monthlyContribution: response.data[i].monthlyContribution})
          }
        }
        //console.log(this.state.savingsList)
      })
      .catch((error) => {
        console.error("Error getting Savings\n" + error);
      });
  }

  render () {
    const years = Array.from(new Array(20),(val, index) => index + this.state.goalDate.year);
    return (
      <div className="BigDivArea">
        <h3 className="titleSpace">Edit Savings Goal</h3>

        <form onSubmit={this.handleSubmit}>
        <label>
          <b>Title</b><br/>
          <input name="title" type="text" value={this.state.title} onChange={this.handleChange} />
        </label><br/>
        <select name="category" value={this.state.category} onChange={this.handleChange}>
          <option value="Choose a category">Choose a category</option>
          <option value="Pay off Credit Card Debt">Pay off Credit Card Debt</option>
          <option value="Pay off Loans">Pay off Loans</option>
          <option value="Save for Emergency">Save for Emeregency</option>
          <option value="Save for a Trip">Save for a Trip</option>
          <option value="Save for a Purchase">Save for a Purchase</option>
          <option value="Other">Other</option>
        </select>
        <br/>
          <label>
            <b>Goal Amount</b><br/>$
            <input name="goalAmount" type="number" step="0.01" value={this.state.goalAmount} onChange={this.handleChange} />
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
          <input name="monthlyContribution" type="number" step="0.01" value={this.state.monthlyContribution} onChange={this.handleChange} />
        </label><br/>
        <ButtonGroup>
          <Button variant="secondary" onClick={() => History.push("/saving")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.handleSubmit} disabled={!(this.state.validAmount && this.state.validCont && this.state.validCat && this.state.validTitle)}>
            Save Changes
          </Button>
        </ButtonGroup><br/><br/>
        <Button outline color="danger" size="sm" onClick={e =>
          window.confirm("Are you sure you wish to delete this Savings Goal? This is a permanent action and cannot be undone.") &&
          this.handleDelete(e)}>
          Delete
        </Button>
        </form>
      </div>
    );
  }
}

export default EditSavings;
