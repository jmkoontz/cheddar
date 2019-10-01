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
            companies: {
                "Amazon": "AMZN",
                "Apple": "AAPL",
                "Google": "GOOG",
                "Microsoft": "MSFT",
            },
            selectedCompanies: [],
        }
    }


    componentDidMount(){
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
                    for(i=0;i<31;i++){
                        points.push({x: new Date(dateKeys[i]), y: Math.floor(res.data["Weekly Adjusted Time Series"][dateKeys[i]]["4. close"])});
                    }
                    var dataArr = []
                    dataArr.push({type: "line", dataPoints: points})
                    this.setState({
                        data: dataArr,
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
            case "MSFT":
                name = "Microsoft";
                break;
            case "AAPL":
                name = "Apple";
                break;
            case "AMZN":
                name = "Amazon";
                break;
            case "GOOG":
                name = "Google";
                break;
        }
        this.setState({
            company: param,
            companyName: name,
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

    addSelectedCompany = (company) => {
        var companies = this.state.selectedCompanies;
        companies.push(company);
        this.setState({
            selectedCompanies: companies,
        },()=>{alert(this.state.selectedCompanies)});
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
            <div className="BigDivArea parent">
                <h3>Investments!</h3>
                <div className="add-button-container">
                    <Button className="add-button" variant="primary" onClick={this.showModal}>Add</Button>
                </div>
                <div className="cardContainer visible-border">
                    <CanvasJSChart options = {options}
                        // onRef = {ref => this.chart = ref} 
                    />
                </div>
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
                    <Button variant="primary" onClick={this.showModal}>
                        Submit
                    </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.showModal}>Close</Button>
                </Modal.Footer>
                </Modal>
                <DropdownButton id="dropdown-basic-button" onSelect={this.test} title={this.state.companyName}>
                {this.state.selectedCompanies.map((name)=>{
                    return (<Dropdown.Item eventKey={this.state.companies[name]}>{name}</Dropdown.Item>)
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