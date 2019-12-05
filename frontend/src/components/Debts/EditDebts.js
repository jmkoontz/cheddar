import React from 'react';
import { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import { Route, NavLink, Redirect, withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';
import buildUrl from "../../actions/connect";

class EditDebts extends React.Component {
  constructor(props){
    super(props);
    this.state = { userID: sessionStorage.getItem('user'), debtId: '', category: '', nickname: '', initial: '', currBalance: '', interestRate: '', minimumPayment: '', validInit: true, validCurr: true, validInterest: true, validMin: true, validCat: true};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      case "initial":
        this.setState({validInit: (value > 0)});
        break;
      case "currBalance":
        this.setState({validCurr: (value > 0)});
        break;
      case "interestRate":
        this.setState({validInterest: (value > 0 && value < 100)});
        break;
      case "minimumPayment":
        this.setState({validMin: (value > 0 && value < 100)});
        break;
      default:
        break;
      }
  }

  handleSubmit(event){
    //alert('A new goal \'' + this.state.title + '\' of $' + this.state.goalAmount + ' was submitted in ' + this.state.category + '\nYou plan to save $' + this.state.monthlyCont + ' a month until ' + this.state.month + ' ' + this.state.year);

    axios.put(buildUrl(`/Cheddar/Debts/${this.state.userID}/${this.state.debtId}`),
      {
        category: this.state.category,
        nickname: this.state.nickname,
        initial: this.state.initial,
        currBalance: this.state.currBalance,
        interestRate: this.state.interestRate,
        minimumPayment: this.state.minimumPayment
      })
      .then((response) => {
        console.log(response);
        event.preventDefault();
        alert("Debt successfully updated")
        History.push("/debts")
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleDelete(event){
    axios.delete(buildUrl(`/Cheddar/Debts/Debt/${this.state.userID}/${this.state.debtId}/`))
      .then((response) => {
        console.log(response);
        event.preventDefault();
        //alert("Savings plan successfully deleted")
        History.push("/debts")
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount(){
    this.getDebts();
  }

  getDebts = () => {
    const id = this.props.match.params.id;
    axios.get(buildUrl(`/Cheddar/Debts/${this.state.userID}/`))
      .then((response) => {
        for(let i in response.data){
          if(response.data[i]._id == id){
            console.log(response.data[i]);
            this.setState({debtId: response.data[i]._id, category: response.data[i].category, nickname: response.data[i].nickname, initial: response.data[i].initial, currBalance: response.data[i].currBalance, interestRate: response.data[i].interestRate, minimumPayment: response.data[i].minimumPayment})
          }
        }
      })
      .catch((error) => {
        console.error("Error getting Debts\n" + error);
      });
  }

  render () {
    return (
      <div className="BigDivArea">
        <h3 className="titleSpace">Edit Debt Repayment Plan</h3><br/>
        <form onSubmit={this.handleSubmit}>
        <label>
        <select name="category" value={this.state.category} onChange={this.handleChange}>
          <option value="Choose a category">Choose a category</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Loan">Loan</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Other">Other</option>
        </select>
        <br/>
          <label>
            <b>Initial Principle</b><br/>$
            <input name="initial" type="number" step="0.01" value={this.state.initial} onChange={this.handleChange} />
          </label>
        <br/>
        <label>
          <b>Current Balance</b><br/>$
          <input name="currBalance" type="number" step="0.01" value={this.state.currBalance} onChange={this.handleChange} />
        </label>
        <br/>
        <label>
          <b>Annual Interest Rate</b><br/>
          <input name="interestRate" type="number" step="0.01" value={this.state.interestRate} onChange={this.handleChange} />
        %</label><br/>
        <label>
          <b>Minimum Payment Percent</b><br/>
          <input name="minimumPayment" type="number" step="0.01" value={this.state.minimumPayment} onChange={this.handleChange} />
        %</label><br/>
        <b>Nickname</b> (<i>optional</i>)<br/>
          <input name="nickname" type="text" value={this.state.nickname} onChange={this.handleChange} />
        </label><br/>
        <ButtonGroup>
          <Button variant="secondary" onClick={() => History.push("/debts")}>
            Cancel
          </Button>
          <Button variant="primary" onClick={this.handleSubmit} disabled={!(this.state.validInit && this.state.validCurr && this.state.validInterest && this.state.validMin && this.state.validCat)}>
            Save Changes
          </Button>
        </ButtonGroup><br/><br/>
        <Button outline color="danger" size="sm" onClick={e =>
          window.confirm("Are you sure you wish to delete this Debt? This is a permanent action and cannot be undone.") &&
          this.handleDelete(e)}>
          Delete
        </Button>
        </form>
      </div>
    );
  }
}

export default EditDebts;
