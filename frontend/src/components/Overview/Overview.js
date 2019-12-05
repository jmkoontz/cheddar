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
import {Card, CardTitle, CardBody} from 'reactstrap';
import TipSequence from '../TipSequence/TipSequence';
import buildUrl from '../../actions/connect';

import './Overview.css';
import NotificationModal from "../Calendar/NotificationModal";
import Tip from "../Tip/Tip";

class Overview extends React.Component {
  constructor (props) {
    super(props);

    this.eventListModal = React.createRef();
    this.notificationModal = React.createRef();
    this.calendar = React.createRef();
    this.state = {
      uid: sessionStorage.getItem('user'),
      data: {},
      selectedCompanies: [],
      key: process.env.AlphaVantageAPIKey,
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
    };
  }

  componentDidMount() {
    const test = {uid: this.state.uid};
    console.log(this.state.uid);
    axios.get(buildUrl("/Cheddar/Investments"), {
      params: test,
    }).then(res => {
      var companies = this.state.companies;
      var i;
      
      var trackedCompanies = res.data.trackedCompanies;
      if(typeof(trackedCompanies) == typeof(undefined)){
          trackedCompanies = [];
      }
      for(i=0;i<trackedCompanies.length;i++){
        companies[trackedCompanies[i]]["tracked"]=true;
      }
      this.setState({
        companies: companies,
        selectedCompanies: trackedCompanies,
        investments: res.data.investments,
      },() => {
        var comps = this.state.selectedCompanies;
        console.log(comps);
        let i =0;
        for(i = 0;i < comps.length; i++){
          this.getData(comps[i]);
          console.log(comps[i]);
        }
      });
    });
  }

  getData = async (companyName) => {
    let res = await axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ this.state.companies[companyName]["id"]+"&apikey="+this.state.key+"&outputsize=full");
    var data = this.state.data;
    data[companyName] = res;
    this.setState({
      data: data,
    });
  };

  emptyStocksGraph = () => {
    if(this.state.selectedCompanies.length == 0){
      return null;
    }
    else{
      return (<Loader/>)
    }
  };

  emptyGrowthGraph = () => {
    if(this.state.investments.length == 0){
      return null;
    }
    else{
      return (<Loader/>)
    }
  };

  getData = async (companyName) => {
    let res;
    res = await axios.get("https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol="+ this.state.companies[companyName]["id"]+"&apikey="+this.state.key+"&outputsize=full");
    if(res.data.Note && res.data.Note.includes("API call frequency")){
      //change API keys
      if(this.state.key == process.env.AlphaVantageAPIKey){
        this.setState({
          key: process.env.AlphaVantageAPIKey2,
        },() => {this.getData(companyName)});
      }
      else if(this.state.key == process.env.AlphaVantageAPIKey2){
        this.setState({
          key: process.env.AlphaVantageAPIKey3,
        },() => {this.getData(companyName)});
      }
      else if(this.state.key == process.env.AlphaVantageAPIKey3){
        this.setState({
          key: process.env.AlphaVantageAPIKey4,
        },() => {this.getData(companyName)});
      }
      else if(this.state.key == process.env.AlphaVantageAPIKey4){
        this.setState({
          key: process.env.AlphaVantageAPIKey5,
        },() => {this.getData(companyName)});
      }
      else if(this.state.key == process.env.AlphaVantageAPIKey5){
        this.setState({
          key: process.env.AlphaVantageAPIKey6,
        },() => {this.getData(companyName)});
      }
      else if(this.state.key == process.env.AlphaVantageAPIKey6){
        this.setState({
          key: process.env.AlphaVantageAPIKey,
        },() => {this.getData(companyName)});
      }
      //alert("Changing Keys");
    }
    else{
      var data = this.state.data;
      data[companyName] = res;
      this.setState({
        data: data,
      });
    }
  };


  render () {
    return (
      <div className="BigDivArea">
        <h3 className="titleSpace" id={"overview-title"}>Financial Overview</h3>

        <Container>
          <Row>
            <Col xs={9}>
              <div id={'calendar-button-row'}>
                <Button className={'calendar-button'} id={'expenses-list-button'} onClick={() => {this.eventListModal.current.open()}}>All Expenses</Button>
                <Button id={"notification-schedule-button"} className={'calendar-button'} onClick={() => {this.notificationModal.current.open()}}>Set Notifications</Button>
                <Tip text={"Set a schedule for your notifications"} target={"notification-schedule-button"}/>
              </div>

              <EventListModal
                ref={this.eventListModal}
                onClose={() => {this.calendar.current.displayEvents()}}
              />
              <NotificationModal
                ref={this.notificationModal}
                onClose={() => {this.calendar.current.displayEvents()}}
              />

              <Calendar ref={this.calendar}/>
            </Col>

            <Col xs={3} id={"info-column"}>
              <Row>
                <Card body>
                  <CardTitle>
                    Your Top Asset
                  </CardTitle>
                  <CardBody>
                    House: $140000
                  </CardBody>
                </Card>
              </Row>

              <Row>
                <Card body>
                  <CardTitle className='card-title'>
                    Your Top Recurring Payment
                  </CardTitle>
                  <CardBody>
                    Rent: $1500 due on 2019-11-25
                  </CardBody>
                </Card>
              </Row>
            </Col>
          </Row>
        </Container>

        <div className="investments-overview" id={"investments-overview"}>
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
                            <StocksGraph frequencyCounter={5} data={this.state.data[name]} key={name+"Graph"} companyName={name}/>
                          </div>
                        )
                      }
                      else{
                        return(
                          null
                        )
                      }

                    }) : this.emptyStocksGraph()
                }
              </Col>
              <Col className="card">
                {
                  (Object.keys(this.state.data).length >= this.state.selectedCompanies.length && this.state.investments.length > 0) ?
                    this.state.investments.map((investment,index)=>{
                      if(investment["favorite"] == true){
                        return(
                          <GrowthGraph frequencyCounter={5} investment={investment} companyName={investment["company"]} data={this.state.data[investment["company"]]} key={investment["company"]+"GrowthGraph"} companyName={investment["company"]}/>
                        )
                      }
                      else{
                        return null
                      }

                    }) : this.emptyGrowthGraph()
                }
              </Col>
            </Row>
          </Container>
        </div>

        <TipSequence
          page={"overview"}
          tips={[
            {
              text: "The overview page is your one stop shop for discovering the basics of your financial life!",
              target: "overview-title"
            }, {
              text: "Add future expenses to the calendar to know what is coming up next",
              target: "calendar-container",
              placement: "left"
            }, {
              text: "View a formatted list of all expenses on the calendar",
              target: "expenses-list-button",
              placement: "left"
            }, {
              text: "Set a schedule to be notified of your different expenses",
              target: "notification-schedule-button",
              placement: "left"
            }, {
              text: "Check some of the biggest financial numbers that you should be aware of",
              target: "info-column"
            }, {
              text: "Get a concise overview of your investment performance",
              target: "investments-overview"
            }
          ]}
        />

      </div>
    );
  }
}

export default Overview;