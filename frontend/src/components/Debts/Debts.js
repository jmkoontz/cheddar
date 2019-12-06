import React from 'react';
import { Component } from 'react';
import { Button, Progress, Container, Row, Col  } from 'reactstrap';
import { withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';
import Collapsible from 'react-collapsible';
import '../../css/Collapsible.css';
import CanvasJSReact from '../../assets/canvasjs.react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import buildUrl from "../../actions/connect";
import TipSequence from "../TipSequence/TipSequence";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DebtModel = ({_id, category, nickname, initial, currBalance, interestRate, minimumPayment, favorite}) => (
  <div>
    <Collapsible trigger={category}
    triggerOpenedClassName="Collapsible__trigger--active"
    triggerWhenOpen={<div className="triggerTop" id="trigger_title"><Button outline color="secondary" onClick={() => History.push({pathname: `/editdebts/${_id}`})} className="editBtn" id="edit" type="button">Edit</Button>
                      <Button outline color={(favorite)?"primary":"secondary"} type="button" onClick={() => {
                          if(favorite){
                            axios.put(buildUrl('/Cheddar/Debts/Unfavorite/'+sessionStorage.getItem('user')+'/'+_id))
                              .then(() => {
                                window.location.reload(false);
                              })
                            .catch((error) => {
                              console.log(error);
                            })
                          }else{
                            axios.put(buildUrl('/Cheddar/Debts/Favorite/'+sessionStorage.getItem('user')+'/'+_id))
                              .then(() => {
                                window.location.reload(false);
                              })
                            .catch((error) => {
                              console.log(error);
                            })
                          }
                        }} className="favButton" id="favorite"><FavoriteIcon />
                      </Button>
                    </div>}
    lazyRender
    easing={'cubic-bezier(0.175, 0.885, 0.32, 2.275)'}>
      <h2>{nickname}</h2>
      <p>Current Balance: ${currBalance.toLocaleString()}<br/>Initial Principle: ${initial.toLocaleString()}<br/>Interest Rate: {interestRate}%</p>
      {(1 - (currBalance / initial)) < 1
        ? <Progress animated value={(1 - (currBalance / initial)) * 100}>{((1 - (currBalance / initial)) * 100).toFixed(1)}%</Progress>
        : <Progress animated color="success" value={(1 - (currBalance / initial)) * 100}>{((1 - (currBalance / initial)) * 100).toFixed(1)}%</Progress>
      }
    </Collapsible>
  </div>
)

class Debts extends React.Component {
  constructor(props){
    super(props);
    this.state = { userID: sessionStorage.getItem('user'), graphData: [], show: false, debtList: [], category: '', nickname: '', initial: '', currBalance: '', interestRate: '', minimumPayment: '', validInit: false, validCurr: false, validInterest: false, validMin: false, validCat: false}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick = () => {
    this.setState({show: true})
    //History.push("/createsavings");
  }

  handleClose = () =>{
    this.setState({show: false, graphData: [], category: '', nickname: '', initial: '', currBalance: '', interestRate: '', minimumPayment: '', validInit: false, validCurr: false, validInterest: false, validMin: false, validCat: false});
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
        this.getLineData();
        break;
      case "interestRate":
        this.setState({validInterest: (value > 0 && value < 100)});
        this.getLineData();
        break;
      case "minimumPayment":
        this.setState({validMin: (value > 0 && value < 100)});
        this.getLineData();
        break;
      default:
        break;
      }
  }

  handleSubmit(event){
    //alert('A new goal \'' + this.state.title + '\' of $' + this.state.goalAmount + ' was submitted in ' + this.state.category + '\nYou plan to save $' + this.state.monthlyCont + ' a month until ' + this.state.month + ' ' + this.state.year);
    axios.post(buildUrl(`/Cheddar/Debts/${this.state.userID}`),
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
        this.getDebts();
        this.setState({show: false, graphData: [], category: '', nickname: '', initial: '', currBalance: '', interestRate: '', minimumPayment: '', validInit: false, validCurr: false, validInterest: false, validMin: false, validCat: false});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getDebts = () => {
    axios.get(buildUrl(`/Cheddar/Debts/${this.state.userID}/`))
      .then((response) => {
        this.setState({debtList: response.data})
      })
      .catch((error) => {
        console.error("Error getting Debts\n" + error);
      });
  }

  getLineData = () => {
    if(this.state.minimumPayment == '' || this.state.interestRate == '' || this.state.currBalance == ''){
      return;
    }
    var data = [];
    const minimumPay = (Number(this.state.minimumPayment) / 100);
    const interest = (Number(this.state.interestRate) / 12) / 100;
    var amount = Number(this.state.currBalance);
    console.log(minimumPay + ' ' + interest + ' ' + amount);
    while(amount > 0){
      data.push({y: amount});
      //console.log(amount);
      if((amount * minimumPay) < 15)
        amount = amount - 15;
      else {
        amount = amount - (amount * minimumPay)
      }
      amount = amount + (amount * interest)
    }
    this.setState({graphData: data});
  }

  componentDidMount(){
    this.getDebts();
  }

  render () {
    const debts = this.state.debtList;
    const options = {
      animationEnabled: true,
    	theme: "light2",
    	title:{
    		text: "Time to Pay Off Debt"
    	},
      axisX:{
       title: "Months",
       minimum: 0
      },
      axisY:{
        prefix: "$"
      },
    	data: [{
    		type: "line",
        dataPoints: this.state.graphData
      }]
   };
    return (
      <div className="BigDivArea">
        <h3 className="titleSpace" id="page-header">Debt Repayment Plan</h3><br/>
        {(debts.length > 0 && debts[0])
          ? debts.map(plan => <DebtModel {...plan} />)
          : <p>Keep track of all the debts you may have here. Start by adding one below</p>}
         <span className="input-group-btn">
              <Button outline color="secondary" onClick={this.handleClick} type="button" id="add-button">Add +</Button>
        </span>
          <Button outline color="info" onClick={() => History.push("/repaymentcalc")} type="button" id="repayment">Calculate Repayment Date</Button>

        <Modal show={this.state.show} onHide={this.handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title>Add a Debt</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Container>
          <Row>
          <Col xs="4">
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
              </label>
              </form>
              </Col>
              <Col xs="6">
              <div className="Graph">
              {(this.state.validInterest && this.state.validMin && this.state.validCurr)?
                  <CanvasJSChart options = {options}
                      /* onRef = {ref => this.chart = ref} */
                  />
                : null
              }
              </div>
              </Col>
              </Row>
              </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit} disabled={!(this.state.validInit && this.state.validCurr && this.state.validInterest && this.state.validMin && this.state.validCat)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <TipSequence
                    page={"debts"}
                    tips={[
                        {
                        text: "The debts page is where you can keep track of all your current debts and watch as they disappear",
                        target: "page-header"
                        }, {
                        text: "Click the \"Add\" button to begin add a new debt to track",
                        target: "add-button",
                        }, {
                        text: "Click this bar to show more information about a debt",
                        target: "trigger_title",
                        }, {
                        text: "Click the \"Edit\" button to edit a tracked debt",
                        target: "edit",
                        }, {
                        text: "Click the \"Favorite\" button to have that debt appear on the overview page",
                        target: "favorite",
                        }, {
                        text: "Click the \"Repayment\" button to go to the calculator page and see how long it would take you to pay off a debt",
                        target: "repayment",
                        },
                        
                        
                    ]}
                />
      </div>
    );
  }
}

export default Debts;
