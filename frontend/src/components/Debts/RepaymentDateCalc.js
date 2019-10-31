import React from 'react';
import { Component } from 'react';
import { Button } from 'reactstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

class RepaymentDateCalc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userID: sessionStorage.getItem('user'), debt: '', debtList: [], debtId: '', month: '', year: '', monthlyContribution: ''}


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const target = event.target;

    const name = target.name;
    const value = target.value;
    if (name == "debtId") {
      this.setState({[name]: value}, () => { this.setDebtInfo(value) });
    }else if (name == "monthlyContribution") {
      this.setState({[name]: value}, () => { this.calculateDate(value) });
    }else{
      this.setState({[name]: value}, () => { this.calculatePayments(value) });
    }
  }

  calculateDate = (value) => {
    this.setState({month: '', year: ''})
    if(this.state.debt == ''){
      return;
    }
    const balance = this.state.debt.currBalance;
    const payments = this.state.monthlyContribution;
    const interest = ((this.state.debt.interestRate * 100 / 100.0) / 100) / 12 ;

    const months = -(Math.log(1 - ((balance * interest) / payments)) / Math.log(1 + interest));
    if(!months){
      return;
    }
    var calcYear = (new Date()).getFullYear() + Number((months / 12).toFixed())
    var calcMonth = (new Date()).getMonth() + Number((months % 12).toFixed())
    if(calcMonth > 12){
      calcMonth = calcMonth - 12;
      calcYear++;
    }
    this.setState({month: monthNames[calcMonth], year: calcYear})
    //console.log(this.state.month + ' ' + this.state.year);
  }

  calculatePayments = (value) => {
    this.setState({monthlyContribution: ''})
    if(this.state.debt == '' || this.state.month == '' || this.state.year == ''){
      return;
    }
    const balance = this.state.debt.currBalance;
    const interest = ((this.state.debt.interestRate * 100 / 100.0) / 100) / 12 ;
    const currMonth = (new Date()).getMonth() + 1;
    const currYear = (new Date()).getFullYear();
    const year = this.state.year;
    const month = monthNames.indexOf(this.state.month) + 1;
    if(year == currYear && month < currMonth){
      return;
    }
    const numMonths = (month - currMonth) + (year - currYear) * 12;
    const payments = (interest * balance * Math.pow(interest + 1, numMonths)) / (Math.pow(interest + 1, numMonths) - 1);
    //console.log(payments.toFixed(2));
    if(!payments){

      return;
    }
    this.setState({monthlyContribution: payments.toFixed(2)})
  }

  handleSubmit(event){

  }

  setDebtInfo = (value) => {
    if (value == '') {
      this.setState({debt: ''})
    }
    for(let i in this.state.debtList){
      if(this.state.debtList[i]._id == value){
        this.setState({debt: this.state.debtList[i]})
        //console.log(this.state.debtList[i]);
        return;
      }
    }
  }

  createSelect = () => {
    let items = [];
    items.push(<option value="">Choose a Debt</option>);
    for(let i in this.state.debtList){
      items.push(<option value={this.state.debtList[i]._id}>{(this.state.debtList[i].nickname)?`${this.state.debtList[i].category} - ${this.state.debtList[i].nickname}`:this.state.debtList[i].category}</option>);
    }
    return items;
  }

  getDebts = () => {
    axios.get(`http://localhost:8080/Cheddar/Debts/${this.state.userID}/`)
      .then((response) => {
        this.setState({debtList: response.data})
      })
      .catch((error) => {
        console.error("Error getting Debts\n" + error);
      });
  }

  componentDidMount(){
    this.getDebts();
    //this.setState({year: (new Date()).getFullYear()})
  }

  render () {
      const years = Array.from(new Array(50),(val, index) => index + (new Date()).getFullYear());
      return (
        <div className="BigDivArea">
        <h3 className="titleSpace">Repayment Date Calculator</h3>
        <form onSubmit={this.handleSubmit}>
          <select name="debtId" value={this.state.debtId} onChange={this.handleChange}>
            {this.createSelect()}
          </select><br/>
          {(this.state.debt != '')?<div><b>Current Balance</b>: ${this.state.debt.currBalance.toLocaleString()}<br/><b>Interest Rate</b>: {this.state.debt.interestRate}%<br/></div>:<div><br/></div>}
          <label>
          <b>Planned End Date</b><br/>
          <select name="month" value={this.state.month} onChange={this.handleChange}>
            <option value="">Month</option>
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
            <option value=''>Year</option>
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
          </label><br/>
        </form>
        <Button variant="secondary" onClick={() => this.setState({debt: '', debtId: '', month: '', year: '', monthlyContribution: ''})}>
          Clear
        </Button>
      </div>
    );
  }
}

export default RepaymentDateCalc
