import React from 'react';
import CanvasJSReact from '../../assets/canvasjs.react';
import axios from 'axios';
import keys from '../../config/keys.js';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Investments extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidMount(){
        console.log("IT WORKS");
        axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=MSFT&apikey="+keys.AlphaVantageAPIKey)
        .then(res => {
            var obj = res.data["Weekly Time Series"]["2019-09-25"];
            var dateKeys = Object.keys(res.data["Weekly Time Series"]);
            var points = [];
            var i = 0;
            for(i=0;i<dateKeys.length;i++){
                points.push({x: dateKeys.length-i-2, y: Math.floor(res.data["Weekly Time Series"][dateKeys[i]]["4. close"])});
                //alert(points[i].x + " " + points[i].y);
            }
            var dataArr = []
            dataArr.push({type: "line", dataPoints: points})
            this.setState({
                data: dataArr,
            });
        })
    }

    render () {
        const options = {
            title: {
                text: "Weekly Microsoft Stocks"
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
        if(this.state.data.length >0){
            console.log(this.state.data[0].dataPoints[0].x);
        }
        return (
            <div className="BigDivArea">
                <h3>Investments!</h3>
                <div>
                    <CanvasJSChart options = {options}
                        /* onRef = {ref => this.chart = ref} */
                    />
                </div>
            </div>
        );
    }
}

export default Investments;