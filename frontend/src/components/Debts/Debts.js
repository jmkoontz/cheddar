import React from 'react';
import { Component } from 'react';
import { Button } from 'reactstrap';
import { withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';

const DebtModel = ({category, nickname, initial, currBalance, interestRate}) => (
  <div>
    {nickname && <h2>{nickname}</h2>}
    <h3>{category}</h3>
    <p>Current Balance: ${currBalance}<br/>Interest Rate: {interestRate}%</p><br/>
  </div>
)

class Debts extends React.Component {
  constructor(props){
    super(props);
    this.state = { userID: sessionStorage.getItem('user'), show: false, debtList: [], category: '', nickname: '', initial: '', currBalance: '', interestRate: '', validInit: false, validCurr: false, validInterest: false, validCat: false}

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
      default:
        break;
      }
  }

  handleSubmit(event){
    //alert('A new goal \'' + this.state.title + '\' of $' + this.state.goalAmount + ' was submitted in ' + this.state.category + '\nYou plan to save $' + this.state.monthlyCont + ' a month until ' + this.state.month + ' ' + this.state.year);
    axios.post(`http://localhost:8080/Cheddar/Debts/${this.state.userID}`,
      {
        category: this.state.category,
        nickname: this.state.nickname,
        initial: this.state.initial,
        currBalance: this.state.currBalance,
        interestRate: this.state.interestRate
      })
      .then((response) => {
        console.log(response);
        event.preventDefault();
        this.getDebts();
        this.setState({show: false})
      })
      .catch((error) => {
        console.error(error);
      });
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
  }

  render () {
    const debts = this.state.debtList;
    return (
      <div className="BigDivArea">
        <h3>Debt Repayment Plan</h3>
        {(debts.length > 0 && debts[0])
          ? debts.map(plan => <DebtModel {...plan} />)
          : <p>Keep track of all the debts you may have here. Start by adding one below</p>}
         <span className="input-group-btn">
              <Button outline color="secondary" onClick={this.handleClick} type="button">Add +</Button>
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
                <option value="Real Estate">Real Estate</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Loan">Loan</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Other">Other</option>
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
                <b>Interest Rate</b><br/>
                <input name="interestRate" type="number" step="0.01" value={this.state.interestRate} onChange={this.handleChange} />
              %</label><br/>
              <b>Nickname</b> (<i>optional</i>)<br/>
                <input name="nickname" type="text" value={this.state.nickname} onChange={this.handleChange} />
              </label>
              </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit} disabled={!(this.state.validInit && this.state.validCurr && this.state.validInterest && this.state.validCat)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Debts;
