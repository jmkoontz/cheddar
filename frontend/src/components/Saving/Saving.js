import React, {useState} from 'react';
import { Component } from 'react';
import { Button, Progress, Container, Row, Col } from 'reactstrap';
import { withRouter } from "react-router-dom";
import History from "../../history";
import Modal from 'react-bootstrap/Modal'
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Collapsible from 'react-collapsible';
import '../../css/Collapsible.css';
import '../../css/SavingsModal.css'
import CanvasJSReact from '../../assets/canvasjs.react';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Notifications from "../Notifications/Notifications";
import buildUrl from "../../actions/connect";
import TipSequence from '../TipSequence/TipSequence';


var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const SavingsPlan = ({_id, title, category, goalAmount, goalMonth, goalYear, monthlyCont, currSaved, favorite}) => (
    <div>
     <Collapsible trigger={title}
      id="trigger_title"
     triggerOpenedClassName="Collapsible__trigger--active"
     triggerWhenOpen={<div className="triggerTop"><Button outline color="secondary" onClick={() => History.push({pathname: `/editsavings/${_id}`})} className="editBtn" id="edit" type="button">Edit</Button>
                          <Button outline color={(favorite)?"primary":"secondary"} type="button" onClick={() => {
                              if(favorite){
                                axios.put(buildUrl('/Cheddar/Savings/Unfavorite/' + sessionStorage.getItem('user') + '/' + _id))
                                .then(() => {
                                  window.location.reload(false);
                                })
                          			.catch((error) => {
                          				console.log(error);
                          			})
                              }else{
                                axios.put(buildUrl('/Cheddar/Savings/Favorite/' + sessionStorage.getItem('user') +'/' +_id))
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

function AlertFunction() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="warning" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>You have no Emergency Saving Plan</Alert.Heading>
        <p>
          We recommended you create a savings plan of at least six months of net living expenses to cover any financial surprises life throws your way. We can help you save here. Start by adding a Emergency plan above.
        </p>
        <br/>
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => {
            axios.put(buildUrl('/Cheddar/DisableToolTips/' + sessionStorage.getItem('user') + '/recommendSavings'))
            .catch((error) => {
              console.error(error);
            });
            setShow(false);
          }}
        >
          Don't Notify Me About This Again
        </Button>
      </Alert>
    );
  }
  return null;
}

class Saving extends React.Component {
  constructor(props){
    super(props);
    this.state = { userID: sessionStorage.getItem('user'), graphData: [], show: false, savingsList: [], title: '', category: 'Choose a category', goalAmount: '', goalDate: {month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear()}, monthlyContribution: '', recommendPlan: false, validAmount: false, validCont: false, validCat: false, validTitle: false}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.notifications = React.createRef();
  }

  handleClick = () => {
    this.setState({show: true})
    //History.push("/createsavings");
  }

  handleClose = () =>{
    this.setState({graphData: [], show: false, title: '', category: 'Choose a category', goalAmount: '', month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear(), monthlyContribution: '', validAmount: false, validCont: false, validCat: false, validTitle: false})
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
        this.getLineData();
        break;
      case "monthlyContribution":
        this.setState({validCont: (value > 0)});
        this.getLineData();
        break;
      default:
        break;
      }
  }

  handleSubmit(event){
    //alert('A new goal \'' + this.state.title + '\' of $' + this.state.goalAmount + ' was submitted in ' + this.state.category + '\nYou plan to save $' + this.state.monthlyContribution + ' a month until ' + this.state.month + ' ' + this.state.year);
    // TODO: check user inputs

    axios.post(buildUrl(`/Cheddar/Savings/${this.state.userID}`),
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
        if(this.state.category == "Save for Emergency"){
          axios.put(buildUrl('/Cheddar/DisableToolTips/' +this.state.userID + '/recommendSavings'))
          .then(()=>{
            this.getSavings();
            this.getRecommendStatus();
            this.setState({graphData: [], show: false, title: '', category: 'Choose a category', goalAmount: '', month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear(), monthlyContribution: '', validAmount: false, validCont: false, validCat: false, validTitle: false})
          })
          .catch((error) => {
            console.error(error);
          });
        } else{
          this.getSavings();
          this.setState({graphData: [], show: false, title: '', category: 'Choose a category', goalAmount: '', month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear(), monthlyContribution: '', validAmount: false, validCont: false, validCat: false, validTitle: false})
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getSavings = () => {
    axios.get(buildUrl(`/Cheddar/Savings/${this.state.userID}/`))
      .then((response) => {
        this.setState({savingsList: response.data})
        this.getNotifications();
        //console.log(response);
        //console.log(this.state.savingsList)
      })
      .catch((error) => {
        console.error("Error getting Savings\n" + error);
      });
  }

  getLineData = () => {
    if(this.state.goalAmount == '' || this.state.monthlyContribution == ''){
      this.setState({month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear()})
      return;
    }
    var data = [];
    const goal = Number(this.state.goalAmount);
    const contribution = Number(this.state.monthlyContribution);
    var amount = 0;
    if(goal < contribution || contribution == 0){
      return;
    }
    while(amount <= goal){
      data.push({y: amount});
      //console.log(amount);
      amount = amount + contribution;
    }
    this.setState({graphData: data});
    this.setEndDate(data.length - 1);
  }

  setEndDate = (totalMonths) => {
    var yrs = Math.floor(totalMonths / 12);
    var mnths = totalMonths % 12;
    console.log("Months: " + mnths + " Years: " + yrs + " (" + totalMonths + ")");
    mnths += (new Date()).getMonth();
    if(mnths > 12){
      mnths -= 12;
      yrs++;
    }
    if(yrs >= 75){
      yrs = 74;
    }
    yrs += (new Date()).getFullYear();
    console.log(mnths + " " + yrs);
    console.log( monthNames[mnths - 1] + " " + yrs);
    //if(this.state.year < yrs || (this.state.year == yrs && monthNames.indexOf(this.state.month) < mnths)){
        this.setState({month: monthNames[mnths - 1], year: yrs})
    //}
  }

  getNotifications = () => {
    let savings = this.state.savingsList;
    let currYear = (new Date()).getFullYear();
    let currMonth = (new Date()).getMonth();
    for(let i in savings){
      if(savings[i].goalYear == currYear && monthNames.indexOf(savings[i].goalMonth) <= currMonth){
        if(savings[i].currSaved < savings[i].goalAmount){
          this.notifications.current.add({
            message: savings[i].title,
            type: "info",
            title: "You have missed a goal:"
          })
        }
      }
    }
  }

  getRecommendStatus = () => {
    axios.get(buildUrl('/Cheddar/ToolTips/' + sessionStorage.getItem('user')))
      .then((response) => {
        this.setState({ recommendPlan: response.data["recommendSavings"] });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount(){
    this.setState({month: monthNames[(new Date()).getMonth()], year: (new Date()).getFullYear()})
    this.getSavings();
    this.getRecommendStatus();
  }



  render () {
    const years = Array.from(new Array(75),(val, index) => index + this.state.goalDate.year);
    const savings = this.state.savingsList;
    var status = this.state.recommendPlan;
    const options = {
      animationEnabled: true,
    	theme: "light2",
    	title:{
    		text: "Time to Reach Goal"
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
        <h3 className="titleSpace" id="page-header">Savings Goals</h3>
          {(savings.length > 0 && savings[0])
            ? savings.map(plan => <SavingsPlan {...plan} />)
            : <p>You have no savings plans. Why don't you add one below</p>}
        <br/>
         <span className="input-group-btn">
              <Button outline color="secondary" id="add-button" onClick={this.handleClick} type="button">Add +</Button>
        </span>

        <Notifications
          ref={this.notifications}
        />

        {this.state.recommendPlan && <AlertFunction />}

        <Modal show={this.state.show} onHide={this.handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton>
            <Modal.Title>Create New Savings Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Container>
          <Row>
          <Col xs="4">
              <form onSubmit={this.handleSubmit} className="form">
              <label>
                <b>Title</b><br/>
                <input name="title" type="text" value={this.state.title} onChange={this.handleChange} />
              </label><br/>
              <select name="category" value={this.state.category} onChange={this.handleChange}>
                <option value="Choose a category">Choose a category</option>
                <option value="Pay off Credit Card Debt">Pay off Credit Card Debt</option>
                <option value="Pay off Loans">Pay off Loans</option>
                <option value="Save for Emergency">Save for Emergency</option>
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
                <b>Monthly Contribution</b><br/>$
                <input name="monthlyContribution" type="number" step="0.01" value={this.state.monthlyContribution} onChange={this.handleChange} />
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

              </form>
              </Col>
              <Col xs="6">
              <div className="Graph">
              {(this.state.validAmount && this.state.validCont)?
                <div>
                  <CanvasJSChart options = {options}
                      /* onRef = {ref => this.chart = ref} */
                  />
                </div>
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
            <Button variant="primary" onClick={this.handleSubmit} disabled={!(this.state.validAmount && this.state.validCont && this.state.validCat && this.state.validTitle)}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        <TipSequence
            page={"saving"}
            tips={[
                {
                text: "The savings page is the place to create and view savings plans for new purchases or to save for life's surprises.",
                target: "page-header"
                }, {
                text: "Click the \"Add\" button to begin creating a new savings plan",
                target: "add-button",
                }, {
                text: "Click the \"Edit\" button to edit a savings plan",
                target: "edit",
                }, {
                text: "Click the \"Favorite\" button to have that savings plan appear on the overview page",
                target: "favorite",
                },
                        
                        
            ]}
        />
      </div>
    );
  }
}

export default Saving;
