import React from 'react';
import Calendar from "../Calendar/Calendar";
import Button from 'react-bootstrap/Button';
import EventListModal from "../Calendar/EventListModal";
import StocksGraph from '../Investments/StocksGraph';
import '../Investments/Investments.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

import './Overview.css';

class Overview extends React.Component {
  constructor (props) {
    super(props);

    this.eventListModal = React.createRef();
    this.calendar = React.createRef();
    this.state = {
        uid: sessionStorage.getItem('user'),
    };
  }

  componentDidMount() {
    const params = {uid: this.state.uid};
    axios.get("http://localhost:8080/Cheddar/Investments", {
        params: params,
            }).then(res => {
                /*var companies = this.state.companies;
                var i;
                var trackedCompanies = res.data.trackedCompanies;
                for(i=0;i<trackedCompanies.length;i++){
                    companies[trackedCompanies[i]]["tracked"]=true;
                }*/
                this.setState({
                    //companies: companies,
                    //selectedCompanies: res.data.trackedCompanies,
                    investments: res.data.investments,
                });
        //console.log(res);
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
                        <StocksGraph companyName="Microsoft"/>                
                    </Col>
                    <Col className="card">
                        Growth Graph Here
                    </Col>
                </Row>
            </Container>
        </div>
      </div>
    );
  }
}

export default Overview;