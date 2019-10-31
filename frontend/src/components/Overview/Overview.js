import React from 'react';
import Calendar from "../Calendar/Calendar";
import Button from 'react-bootstrap/Button';
import EventListModal from "../Calendar/EventListModal";
import StocksGraph from '../Investments/StocksGraph';
import GrowthGraph from '../Investments/GrowthGraph';
import '../Investments/Investments.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Loader from '../Loader/Loader';

import './Overview.css';

class Overview extends React.Component {
  constructor (props) {
    super(props);

    this.eventListModal = React.createRef();
    this.calendar = React.createRef();
    this.state = {
        uid: sessionStorage.getItem('user'),
        data: {},
        selectedCompanies: [],
        companies: {
            "Amazon": {"id":"AMZN","tracked":false},
            "Apple": {"id":"AAPL","tracked":false},
            "Google": {"id":"GOOG","tracked":false},
            "Microsoft": {"id":"MSFT","tracked":false},
        },
        investments: [],
    };
  }

  componentDidMount() {
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
                    },() => {
                        var comps = this.state.selectedCompanies;
                        console.log(comps);
                        let i =0;
                        for(i = 0;i < comps.length; i++){
                            console.log(comps[i]);
                            this.getData(comps[i]);
                        }
                    });
            //console.log(res);
        });
    }

    getData = async (companyName) => {
        let res = await axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ this.state.companies[companyName]["id"]+"&apikey="+this.state.key+"&outputsize=full");
        var data = this.state.data;
        data[companyName] = res;
        this.setState({
            data: data,
        });
    } 
  render () {
    return (
      <div className="BigDivArea">
        <h3>Financial Overview</h3>

        <Button id={'events-button'} onClick={() => {this.eventListModal.current.open()}}>All Expenses</Button>
        <EventListModal
          ref={this.eventListModal}
          onClose={() => {this.calendar.current.displayEvents()}}
        />

        <Calendar ref={this.calendar}/>
        <div className="overview"> 
            <Container fluid="true">
                <Row>
                    <Col className="card">
                    {
                                (Object.keys(this.state.data).length >= this.state.selectedCompanies.length && this.state.selectedCompanies.length > 0) ?
                                this.state.selectedCompanies.map((name,index)=>{
                                    console.log("HERE");
                                    console.log("NAME: " + name);
                                    console.log(this.state.data);
                                    let i=0;
                                    var isFavorite = false;
                                    for(i=0;i<this.state.investments.length;i++){
                                        if(this.state.investments[i]["company"] == name && this.state.investments[i]["favorite"]==true){
                                            isFavorite = true;
                                        }
                                    }
                                    if(isFavorite == true){
                                        isFavorite = false;
                                        return(
                                            <div>
                                                <StocksGraph data={this.state.data[name]} key={name+"Graph"} companyName={name}/>
                                            </div>
                                        )
                                    }
                                    else{
                                        return(
                                            null
                                        )
                                    }
                                    
                                }) : <Loader/>
                            }              
                    </Col>
                    <Col className="card">
                    {
                                (Object.keys(this.state.data).length >= this.state.selectedCompanies.length && this.state.investments.length > 0) ?
                                this.state.investments.map((investment,index)=>{
                                    if(investment["favorite"] == true){
                                        return(
                                            <GrowthGraph investment={investment} companyName={investment["company"]} data={this.state.data[investment["company"]]} key={investment["company"]+"GrowthGraph"} companyName={investment["company"]}/>
                                        )
                                    }
                                    else{
                                        return null
                                    }
                                    
                                }) : <Loader/>
                            }
                    </Col>
                </Row>
            </Container>
        </div>
      </div>
    );
  }
}

export default Overview;