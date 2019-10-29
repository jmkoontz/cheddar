import React from 'react';
import Calendar from "../Calendar/Calendar";
import Button from 'react-bootstrap/Button';
import EventListModal from "../Calendar/EventListModal";
import StocksGraph from '../Investments/StocksGraph';
import '../Investments/Investments.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Overview.css';

class Overview extends React.Component {
  constructor (props) {
    super(props);

    this.eventListModal = React.createRef();
    this.calendar = React.createRef();
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