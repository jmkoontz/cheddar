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
import './Investments.css';
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
import Loader from "../Loader/Loader";

const tips = (
    <Modal.Body>
                    <div>
                    1. Goals<br/>
                        Make sure you have a long term goal in mind. Know why you are deciding to invest.
                    </div>
                    <div>
                    2. Understand the risk<br/>
                        It is very possible you may lose the money you invest. Investing in a more established
                        and stable firm can be safer than a startup. However, nothing is guarunteed. Do not
                        invest if you are not willing to lose it.
                        </div>
                    <div>
                    3. Be rational and logical<br/>
                        If you decide to buy or sell stock, make sure you are doing so on the basis of fact and
                        not emotion. It can be exciting to gain money or upsetting when you lose, however
                        it is important to be rational and make logical decisions.
                        </div>
                    <div>
                    4. Stick to the basics<br/>
                        When first starting out it will help to learn about different types of investments,
                        definitions of metrics, and fundamental methods of stock selection and timing.
                        </div>
                    <div>
                    5. Diversify risk<br/>
                        Do not invest solely in one company. Be open to investing in various markets. When
                        one market is not doing well, it is possible another is which can help balance out
                        losses from the poorly performing markets.
                        </div>
                    <div>
                    6. Avoid Leverage<br/>
                        Do not invest money you do not have. Starting out, it can be dangerous when stocks
                        decrease in a way that is unexpected. Avoid investing loaned money until you have
                        become a well established investor.
                        </div>
                    <div>    
                        <br/>
                    Source: https://www.moneycrashers.com/stock-market-investing-tips-guide-checklist/

                    Lewis, Michael, et al. “6 Stock Market Investing Tips &amp; Guide for Beginners - Checklist.
                        ” Money Crashers, 10 July 2019, www.moneycrashers.com/stock-market-investing-tips
                        -guide-checklist/.
                        </div>
                </Modal.Body>
);

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Investments extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
            defaultRate: "Weekly",
            company: "MSFT",
            companyName: "Microsoft",
            frequency: "TIME_SERIES_WEEKLY_ADJUSTED",
            key: keys.AlphaVantageAPIKey,
            show: false,
            show2: false,
            companies: {
                "Amazon": {"id":"AMZN","tracked":false},
                "Apple": {"id":"AAPL","tracked":false},
                "Google": {"id":"GOOG","tracked":false},
                "Microsoft": {"id":"MSFT","tracked":false},
            },
            investments: [],
            selectedCompanies: [],
            showInfo: false,
            uid: sessionStorage.getItem('user'),
            enteredInvestment: 0,
            enteredInvestmentDate: "",
            newInvestment: {},
        }
    }


    componentDidMount(){
        const test = {uid: this.state.uid};
        console.log(this.state.uid);
        axios.get("http://localhost:8080/Cheddar/Investments", {
            params: test,
                }).then(res => {
                    var companies = this.state.companies;
                    var i;
                    var trackedCompanies = res.data.trackedCompanies;
                    for(i=0;i<trackedCompanies.length;i++){
                        companies[trackedCompanies[i]]["tracked"]=true;
                    }
                    this.setState({
                        companies: companies,
                        selectedCompanies: res.data.trackedCompanies,
                        investments: res.data.investments,
                    });
            //console.log(res);
        });
        if(this.state.defaultRate == "Daily"){
            if(this.state.frequency != "TIME_SERIES_DAILY_ADJUSTED"){
                this.setState({frequency: "TIME_SERIES_DAILY_ADJUSTED"},
                    () =>{
                        this.makeApiRequest();
                    }
                );
            }
            else{
                this.makeApiRequest();
            }            
        }
        else if(this.state.defaultRate == "Weekly") {
            if(this.state.frequency != "TIME_SERIES_WEEKLY_ADJUSTED"){
                this.setState({frequency: "TIME_SERIES_WEEKLY_ADJUSTED"},
                    () =>{
                        this.makeApiRequest();
                    }
                );
            }
            else{
                this.makeApiRequest();
            }       
        }
    }

    shouldComponentUpdate(nextProps,nextState){
        
        if(this.state.key != nextState.key){
            return false;
        }
        else if(this.state.key == nextState.key){
            return true;
        }
    }

    //This function makes an api request to the AlphaVantage API and sets state to contain datapoints for graph
     makeApiRequest = () => {
        axios.get("https://www.alphavantage.co/query?function="+this.state.frequency+"&symbol="+ this.state.company+"&apikey="+this.state.key)
            .then(res => {
                try{
                    var dateKeys = Object.keys(res.data["Weekly Adjusted Time Series"]);
                    var points = [];
                    var i = 0;
                    for(i=0;i<52;i++){
                        points.push({x: new Date(dateKeys[i]), y: Math.floor(res.data["Weekly Adjusted Time Series"][dateKeys[i]]["4. close"])});
                    }
                    var dataArr = []
                    dataArr.push({type: "line", dataPoints: points})
                    this.setState({
                        data: dataArr,
                        updateInvestedAmount: 0,
                        updateInvestmentDate: "",
                    });
                    return true;
                }
                catch(error){ //catch typeError
                    try{    
                        //Check if type error is due to too frequent API calls
                        if(res.data.Note.includes("API call frequency")){
                            //change API keys
                            if(this.state.key == keys.AlphaVantageAPIKey){
                                this.setState({
                                    key: keys.AlphaVantageAPIKey2,
                                });
                            }
                            else{
                                this.setState({
                                    key: keys.AlphaVantageAPIKey,
                                });
                            }
                            //alert("Changing Keys");
                        }
                        
                        return false;
                    }
                    catch(error2){
                        alert("Something went very wrong API");
                        return false;
                    }
                }
            });
    }

    test = (param) => {
        var name = "";
        switch(param){
            case "Microsoft":
                name = "MSFT";
                break;
            case "Apple":
                name = "AAPL";
                break;
            case "Amazon":
                name = "AMZN";
                break;
            case "Google":
                name = "GOOG";
                break;
        }
        this.setState({
            company: name,
            companyName: param,
        },() => {
            this.makeApiRequest();
        });
        console.log(param);
    }

    showModal = () => {
        var show = this.state.show;
        this.setState({
            show: !this.state.show,
        });
    }

    showModal2 = () => {
        this.setState({
            show2: !this.state.show2,
        });
    }

    showInfoModal = () => {
        this.setState({
            showInfo: !this.state.showInfo,
        });
    }

    addSelectedCompany = (company) => {
        var originalCompanies = this.state.companies;
        var companies = this.state.selectedCompanies;
        
        if(originalCompanies[company]["tracked"] == true){
            originalCompanies[company]["tracked"] = false;
            if(companies.includes(company)){
                companies.splice(companies.indexOf(company),1);
            }
            axios.post("http://localhost:8080/Cheddar/Investments/TrackedCompanies", {
                "uid": this.state.uid,
                "updatedCompanies": companies,
                }).then(res => {
                    this.setState({
                        companies: originalCompanies,
                        selectedCompanies: companies,
                    });
            });
        }
        else{
            originalCompanies[company]["tracked"] = true;
            if(!companies.includes(company)){
                companies.push(company);
            }

            axios.post("http://localhost:8080/Cheddar/Investments/TrackedCompanies", {
                "uid": this.state.uid,
                updatedCompanies: companies,
                }).then(res => {
                    this.setState({
                        selectedCompanies: companies,
                        companies: originalCompanies,
                    });
            });
            //console.log(res);
        }
        
    }

    updateInvestedAmount = (amount) => {
        console.log(amount.target.value);
        this.setState({
            enteredInvestment: amount.target.value,
        });
    }

    updateInvestmentDate = (date) => {
        console.log(date.target.value);
        this.setState({
            enteredInvestmentDate: date.target.value,
        });
    }

    updateInvestment = () => {
        let investment = {};
        investment["type"] = "stock";
        investment["startingInvestment"] = this.state.enteredInvestment;
        investment["startDate"] = this.state.enteredInvestmentDate;
        investment["company"] = this.state.companyName;
        this.setState({
            newInvestment: investment,
            enteredInvestment: 0,
            enteredInvestmentDate: "",
        },()=>{console.log(this.state.newInvestment)});
        let i = 0;
        var proceed = true;
        for(i=0;i<this.state.investments.length;i++){
            if(this.state.investments[i]){
                if(this.state.investments[i].company && this.state.investments[i].company == this.state.companyName){
                    proceed = false;
                }
            }
        }
        if(proceed){
            console.log(this.state.investments.filter(e => e.company === this.state.companyName).length);
            this.state.investments.push(investment);
            axios.post("http://localhost:8080/Cheddar/Investments", {
                "uid": this.state.uid,
                "investments": this.state.investments,
            }).then(res => {
                this.showInfoModal();
            });
        }
        else{
            alert("Investment already exists");
        }
        
    }

    

    render () {
        const options = {
            title: {
                text: "Weekly "+this.state.companyName+" Closings for 1 Year"
            },
            axisX: {
                valueFormatString: "MM/DD/YY",
                title: "Date",
            },
            data: this.state.data,
        }

        
        return (
            <div className="parent">
                <h3>Track Investments</h3>
                
                <Container fluid="true">
                    <Row>
                        <Col>
                            <Button className="add-company-button" variant="primary" onClick={this.showModal}>Add Company</Button>
                        </Col>
                        <Col className="text-right">
                            <Button variant="link" onClick={this.showModal2}>Tips</Button>
                        </Col>
                    </Row>
                </Container>

                <div className="cardContainer">
                    <Container fluid="true">
                        <Row>
                            <Col className="card">
                                { this.state.data.length > 0 ?
                                    <CanvasJSChart options={options}
                                    // onRef = {ref => this.chart = ref}
                                    />
                                    : <Loader/>
                                }
                                <Button onClick={() => { this.setState({showInfo: true})}}>Add/Edit Investment</Button>
                            </Col>
                            <Col className="card">
                                Growth Graph Here
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Modal show={this.state.show2} onHide={this.showModal2} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Stocks Tips
                        </Modal.Title>
                    </Modal.Header>
                    {tips}
                </Modal>

                <Modal show={this.state.show} onHide={this.showModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Select Companies
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formBasicCheckbox">
                                {
                                    Object.keys(this.state.companies).map((name) => {
                                        var checkedd = false;
                                        if(this.state.companies[name]["tracked"] == true){
                                            checkedd = true;
                                        }
                                        return (<Form.Check key={name+this.state.companies[name]["id"]} type="checkbox" label={name} checked={checkedd} onChange={() => this.addSelectedCompany(name)}/>)
                                    })
                                }
                            </Form.Group>
                            <Button variant="primary" onClick={this.showModal}>
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showInfo} onHide={this.showInfoModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Enter Investment Information for {this.state.companyName}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formBasic">
                                <Form.Label>Invested Amount</Form.Label>
                                <Form.Control as="input" type="number" defaultValue={this.state.updateInvestedAmount} onChange={(event)=>{this.updateInvestedAmount(event)}}/>
                                <Form.Label>Date Invested</Form.Label>
                                <Form.Control as="input" type="date" defaultValue={this.state.updateInvestmentDate} onChange={(event)=>{this.updateInvestmentDate(event)}}/>
                            </Form.Group>
                            <Button variant="primary" onClick={() => this.updateInvestment()}>
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
                <DropdownButton id="dropdown-basic-button" title={this.state.companyName}>
                    {this.state.selectedCompanies.map((name,index)=>{
                        return (<Dropdown.Item key={this.state.companies[name]+index} onClick={() => this.test(name)}>{name}</Dropdown.Item>)
                    })}
                </DropdownButton>
            </div>
        );
    }
}

export default Investments;

/*
<Container>
    <Row>
        <Col>
            <CanvasJSChart options = {options}
                // onRef = {ref => this.chart = ref} 
            />
        </Col>
        <Col>
            <CanvasJSChart options = {options}
                // onRef = {ref => this.chart = ref} 
            />
        </Col>
        <Col>
            <CanvasJSChart options = {options}
                // onRef = {ref => this.chart = ref} 
            />
        </Col>
    </Row>
    <Row>
        <Col>
            <CanvasJSChart options = {options}
                // onRef = {ref => this.chart = ref} 
            />
        </Col>
        <Col>
            <CanvasJSChart options = {options}
                // onRef = {ref => this.chart = ref} 
            />
        </Col>
        <Col>
        </Col>
    </Row>
</Container>





<Modal show={this.state.show} onHide={this.showModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="formBasicCheckbox">
                        {Object.keys(this.state.companies).map((name)=>{
                            return (<Form.Check type="checkbox" label={name} onClick={() => this.addSelectedCompany(name)}/>)
                        })}
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.showModal}>
                        Submit
                    </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.showModal}>Close</Button>
                </Modal.Footer>
                </Modal>
*/