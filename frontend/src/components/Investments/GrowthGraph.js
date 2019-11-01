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
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class GrowthGraph extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: [],
            defaultRate: "Weekly",
            company: "MSFT",
            companyName: this.props.companyName,
            frequency: "TIME_SERIES_WEEKLY_ADJUSTED",
            key: keys.AlphaVantageAPIKey,
            show: false,
            show2: false,
            companies: {
                "Amazon": {"id":"AMZN","tracked":false},
                "Apple": {"id":"AAPL","tracked":false},
                "Google": {"id":"GOOG","tracked":false},
                "Microsoft": {"id":"MSFT","tracked":false},
                "American Eagle Outfitters": {"id":"AEO","tracked":false},
                "Starbucks": {"id":"SBUX","tracked":false},
                "Facebook": {"id":"FB","tracked":false},
                "AT&T": {"id":"T","tracked":false},
                "Netflix": {"id":"NFLX","tracked":false},
                "Ford Motor Company": {"id":"F","tracked":false},
                "Target": {"id":"TGT","tracked":false},
                "Bank of America": {"id":"BAC","tracked":false},
                "Exxon Mobil": {"id":"XOM","tracked":false},
                "Tesla Inc": {"id":"TSLA","tracked":false},
                "Yum! Brands Inc": {"id":"YUM","tracked":false},
            },
            investments: [],
            selectedCompanies: [],
            showInfo: false,
            uid: sessionStorage.getItem('user'),
            enteredInvestment: 0,
            enteredInvestmentDate: "",
            newInvestment: {},
            companyOptions: {},
            investment: this.props.investment,
        }
        console.log("GROWTH GRAPHS");
    }

    componentDidMount(){
        console.log(this.props.data);
        let res = this.props.data;
        var dateKeys = Object.keys(res.data["Time Series (Daily)"]);
        var points = [];
        var i = 0;
        for(i=0;i<(52*5);i++){
            if(dateKeys[i] == this.state.investment["startDate"]){
                break;
            }
            else if(i%5 == 0){
                points.push({x: new Date(dateKeys[i] + " EST"), y: Math.floor((res.data["Time Series (Daily)"][dateKeys[i]]["4. close"])*this.state.investment["shares"])});
            }
        }
        var dataArr = []
        dataArr.push({type: "line", dataPoints: points});
        console.log(dataArr);
        const options = {
            title: {
                text: "Weekly investment growth for "+this.state.companyName+" (1 year)"
            },
            axisX: {
                valueFormatString: "MM/DD/YY",
                title: "Date",
            },
            axisY:{
                title: "Stock closing price ($)",
            },
            data: dataArr,
        }
        var companyOptions = this.state.companyOptions;
        companyOptions[this.state.companyName] = options;
        this.setState({
            companyOptions: companyOptions,
        });
    }

    

    render() {
        return(
            
            <div>
                <CanvasJSChart options={this.state.companyOptions[this.props.companyName]} />
            </div>

                                
        )
    }

}

export default GrowthGraph;