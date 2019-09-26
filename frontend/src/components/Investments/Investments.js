import React from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import axios from 'axios';
import keys from '../../config/keys.js';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
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
        }
    }


    componentDidMount(){
        if(this.state.defaultRate == "Daily"){
            axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ this.state.company+"&apikey="+keys.AlphaVantageAPIKey)
            .then(res => {
                //var obj = res.data["Weekly Time Series"]["2019-09-25"];
                var dateKeys = Object.keys(res.data["Time Series (Daily)"]);
                var points = [];
                var i = 0;
                for(i=0;i<31;i++){
                    points.push({x: new Date(dateKeys[i]), y: Math.floor(res.data["Time Series (Daily)"][dateKeys[i]]["4. close"])});
                    //alert(points[i].x + " " + points[i].y);
                }
                var dataArr = []
                dataArr.push({type: "line", dataPoints: points})
                this.setState({
                    data: dataArr,
                });
            })
        }
        else if(this.state.defaultRate == "Weekly") {
            axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="+ this.state.company+"&apikey="+keys.AlphaVantageAPIKey)
            .then(res => {
                //var obj = res.data["Weekly Time Series"]["2019-09-25"];
                var dateKeys = Object.keys(res.data["Weekly Adjusted Time Series"]);
                var points = [];
                var i = 0;
                for(i=0;i<31;i++){
                    points.push({x: new Date(dateKeys[i]), y: Math.floor(res.data["Weekly Adjusted Time Series"][dateKeys[i]]["4. close"])});
                    //alert(points[i].x + " " + points[i].y);
                }
                var dataArr = []
                dataArr.push({type: "line", dataPoints: points})
                this.setState({
                    data: dataArr,
                });
            })
        }
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
        });
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="+ this.state.company+"&apikey="+keys.AlphaVantageAPIKey)
            .then(res => {
                //var obj = res.data["Weekly Time Series"]["2019-09-25"];
                var dateKeys = Object.keys(res.data["Weekly Adjusted Time Series"]);
                var points = [];
                var i = 0;
                for(i=0;i<31;i++){
                    points.push({x: new Date(dateKeys[i]), y: Math.floor(res.data["Weekly Adjusted Time Series"][dateKeys[i]]["4. close"])});
                    //alert(points[i].x + " " + points[i].y);
                }
                var dataArr = []
                dataArr.push({type: "line", dataPoints: points})
                this.setState({
                    data: dataArr,
                });
            });
        console.log(param);
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
            /*data: [{				
            type: "column",
            dataPoints: [
            { label: "Apple",  y: 10  },
            { label: "Orange", y: 15  },
            { label: "Banana", y: 25  },
            { label: "Mango",  y: 30  },
            { label: "Grape",  y: 28  }
            ]
            }]*/
        }

        
        return (
            <div className="BigDivArea">
                <h3>Investments!</h3>
                <div>
                    <CanvasJSChart options = {options}
                        /* onRef = {ref => this.chart = ref} */
                    />
                </div>
                <DropdownButton id="dropdown-basic-button" onSelect={this.test} title="Company">
                    <Dropdown.Item eventKey="AMZN">Amazon</Dropdown.Item>
                    <Dropdown.Item eventKey="AAPL">Apple</Dropdown.Item>
                    <Dropdown.Item eventKey="MSFT">Microsoft</Dropdown.Item>
                    <Dropdown.Item eventKey="GOOG">Google</Dropdown.Item>
                    
                </DropdownButton>
            </div>
        );
    }
}

export default Investments;