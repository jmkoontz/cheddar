import React from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import axios from 'axios';
import keys from '../../config/keys.js';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Table from 'react-bootstrap/Table';
import './Investments.css';
import './Retirement.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import { isNullOrUndefined } from 'util';



var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
const date = new Date();
class Retirement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            addedAmount: 0,
            addedDate: String,
            uid: sessionStorage.getItem('user'),
            totalRetirement: 0,
            retirementHistory: [],
            buttonText: "Add Retirement Plan",
            showModal: false,
            prevContribution: {
                amount: 0,
                date: "",
            },
            totalInvestment: 0,
            showTotalInvestment: false,
            showHIstory: true,
        }
    }


    componentDidMount(){
        const test = {uid: this.state.uid};
        axios.get("http://localhost:8080/Cheddar/Retirement", {
            params: test,
        }).then(res => {
            var buttonText;
            if(res.data.total>0){
                buttonText = "Add Contribution";
            }
            else{
                buttonText = this.state.buttonText;
            }
            if(res.data.history.length<1){
                this.setState({
                    totalRetirement: res.data.total,
                    retirementHistory: res.data.history,
                    buttonText: buttonText,
                });
            }
            else{
                var length = res.data.history.length;
                var prevContribution = this.state.prevContribution;
                if(res.data.history.length > 1){
                    prevContribution = res.data.history[length-1];
                }
                this.setState({
                    totalRetirement: res.data.total,
                    retirementHistory: res.data.history,
                    buttonText: buttonText,
                    prevContribution: prevContribution,
                });
            }
        });
        axios.get("http://localhost:8080/Cheddar/Investments/TotalInvestment", {
            params: test,
                }).then(res => {
                    this.setState({
                        totalInvestment: res.data.totalInvestment
                    },()=>{console.log("TOTAL INVESTMENT: " + this.state.totalInvestment)});
            //console.log(res);
        });
    }

    updateAddedAmount = (amount) => {
        this.setState({
            addedAmount: amount.target.value,
        });
    }

    updateAddedDate = (date) => {
        this.setState({
            addedDate: date.target.value,
        });
    }

    addContribution = () => {
        console.log(typeof(this.state.addedDate));
        if(typeof(this.state.addedDate) !== 'string' || this.state.addedDate === null || this.state.addedDate == "" || this.state.addedAmount === undefined || this.state.addedAmount === null || this.state.addedAmount == 0 || this.state.addedAmount < 0){
            alert("Invalid Input\n Please fix input and try again");
            this.setState({
                addedAmount: 0,
                addedDate: "",
            });
        }
        else{
            let contribution = {};
            contribution["date"] = this.state.addedDate;
            contribution["amount"] = this.state.addedAmount;
            
            var history = this.state.retirementHistory;
            history.push(contribution);

            axios.post("http://localhost:8080/Cheddar/Retirement/Contribution", {
                    "uid": this.state.uid,
                    "history": history,
                    "previousTotal": this.state.totalRetirement,
                    }).then(res => {
                        var amount = this.state.addedAmount;
                        this.setState({
                            retirementHistory: history,
                            totalRetirement: parseInt(this.state.totalRetirement) + parseInt(amount),
                            addedAmount: 0,
                            addedDate: "",
                            prevContribution: contribution,
                        });
                        //console.log(res);
                });
            this.showModal();
        }
    }

    showModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    showTotalInvestment = () => {
        this.setState({
            showTotalInvestment: !this.state.showTotalInvestment,
        });
    }

    showDepositHistory = () => {
        this.setState({
            showDepositHistory: !this.state.showDepositHistory,
        });
    }

    render () {
        var data = [{
				type: "stackedBar",
				name: "Previous Total",
				dataPoints: [
					{y: this.state.totalRetirement - parseInt(this.state.prevContribution.amount), label: "Previous Total" },
				]
            },{
				type: "stackedBar",
				name: "Latest Contribution",
				dataPoints: [
					{y: parseInt(this.state.prevContribution.amount), label: "Recent Contribution"  },
				]
            },{
				type: "stackedBar",
				name: "Investments",
				dataPoints: [
					{y: this.state.totalInvestment, label: "Investments"  },
				]
            }];
        if(!this.state.showTotalInvestment){
            data.pop();
        }

        const options = {
			theme: "light2",
			title:{
				text: "Total Contributions"
			},

			axisX: {
                valueFormatString: "",
                interval: 0,
			},
			data: data,
        }
        console.log(options.data);
        return (
            <div className="BigDivArea">
                <h3 className="titleSpace">Retirement Plan</h3>
                <Button variant="primary" onClick={() => this.showModal()}>
                    {this.state.buttonText}
                </Button>
                <Form>
                    <Form.Check type="checkbox" label={"Include Investments"} onChange={() => {this.showTotalInvestment()}}/>
                </Form>
                <Form>
                    <Form.Check type="checkbox" defaultValue={this.state.showDepositHistory} label={"Show Deposit History"} onChange={() => {this.showDepositHistory()}}/>
                </Form>
                <Modal show={this.state.showModal} onHide={this.showModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    {this.state.buttonText}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasic">
                        <Form.Label>Contributed Amount</Form.Label>
                        <Form.Control as="input" type="number" defaultValue={this.state.addedAmount} onChange={(event)=>{this.updateAddedAmount(event)}}/>
                        <Form.Label>Date Contributed</Form.Label>
                        <Form.Control as="input" type="date" defaultValue={this.state.updateInvestmentDate} max={""+date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()} onChange={(event)=>{this.updateAddedDate(event)}}/>
                    </Form.Group>
                    <Button variant="primary" onClick={() => this.addContribution()}>
                        Submit
                    </Button>
                </Form>
                </Modal.Body>
                
                </Modal>
                <CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			    />
                <div className={this.state.showDepositHistory ? 'visible' : 'hidden'} >
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.retirementHistory.map((obj,index) => {
                            var number = index+1;
                            return (
                                <tr>
                                    <td>{number}</td>
                                    <td>{obj["date"]}</td>
                                    <td>{obj["amount"]}</td>
                                </tr>       
                            )
                        })
                    }
                    </tbody>
                </Table>
                </div>
            </div>
        );
    }
}

export default Retirement;

