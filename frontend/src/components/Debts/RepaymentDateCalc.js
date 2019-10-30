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
    this.state = {userID: sessionStorage.getItem('user'), debtList: [], debtId: '', month: '', year: (new Date()).getFullYear(), monthlyContribution: ''}


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event){
    const target = event.target;

    const name = target.name;
    const value = target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event){

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
    this.setState({year: (new Date()).getFullYear()})
  }

  render () {
      const years = Array.from(new Array(50),(val, index) => index + this.state.year);
      return (
        <div className="BigDivArea">
        <h3>Repayment Date Calculator</h3>
        <form onSubmit={this.handleSubmit}>
          <select name="debtID" value={this.state.category} onChange={this.handleChange}>
            {this.createSelect()}
          </select><br/>
          <label>
          <b>Planned End Date</b><br/>
          <select name="month" value={this.state.month} onChange={this.handleChange}>
            <option value="">Choose a Month</option>
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
          </label><br/>
        </form>
      </div>
    );
  }
}

export default RepaymentDateCalc
