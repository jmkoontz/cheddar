import React from 'react';
import { Component } from 'react';
import { Button, Progress } from 'reactstrap';
import { withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';
import Collapsible from 'react-collapsible';
import '../../css/Collapsible.css';

const SavingsPlan = ({_id, title, category, goalAmount, goalMonth, goalYear, monthlyCont, currSaved}) => (
    <div>
     <Collapsible trigger={title}
     triggerOpenedClassName="Collapsible__trigger--active"
     triggerWhenOpen={<Button outline color="secondary" onClick={() => History.push({pathname: `/editsavings/${_id}`})} type="button">Edit</Button>}
     lazyRender
     easing={'cubic-bezier(0.175, 0.885, 0.32, 2.275)'}>
      <h2>{title}</h2>
      <p>Save ${goalAmount.toLocaleString()} by {goalMonth} {goalYear}</p>
      {(currSaved / goalAmount) < 1
        ? <Progress animated value={(currSaved / goalAmount) * 100}>${currSaved.toLocaleString()}</Progress>
        : <Progress animated color="success" value={(currSaved / goalAmount) * 100}>${currSaved.toLocaleString()}</Progress>
      }
     </Collapsible>
    </div>
)

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

class Saving extends React.Component {
  constructor(props){
    super(props);
    this.state = { userID: sessionStorage.getItem('user'), show: false, savingsList: [], title: '', category: 'Choose a category', goalAmount: '', goalDate: {month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear()}, monthlyContribution: '', validAmount: false, validCont: false, validCat: false, validTitle: false}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick = () => {
    this.setState({show: true})
    //History.push("/createsavings");
  }

  handleClose = () =>{
    this.setState({show: false, title: '', category: 'Choose a category', goalAmount: '', goalDate: {month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear()}, monthlyContribution: ''})
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
    // TODO: check user inputs

    axios.post(`http://localhost:8080/Cheddar/Savings/${this.state.userID}`,
      {
        title: this.state.title,
        category: this.state.category,
        goalAmount: this.state.goalAmount,
        goalYear: this.state.year,
        goalMonth: this.state.month,
        monthlyContribution: this.state.monthlyContribution,
        currSaved: 0
      })
      .then((response) => {
        console.log(response);
        event.preventDefault();
        this.getSavings();
        this.setState({show: false, title: '', category: 'Choose a category', goalAmount: '', goalDate: {month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear()}, monthlyContribution: ''})
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
    this.setState({month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear()})
    this.getSavings();
  }

  render () {
    const years = Array.from(new Array(20),(val, index) => index + this.state.goalDate.year);
    const savings = this.state.savingsList
    return (
      <div className="BigDivArea">
        <h3>Savings Goals</h3>
          {(savings.length > 0 && savings[0])
            ? savings.map(plan => <SavingsPlan {...plan} />)
            : <p>You have no savings plans. Why don't you add one below</p>}
        <br/>
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
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit} disabled={!(this.state.validAmount && this.state.validCont && this.state.validCat && this.state.validTitle)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default Saving;
