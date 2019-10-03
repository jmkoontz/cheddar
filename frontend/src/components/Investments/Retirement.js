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



var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Retirement extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: [],
        }
    }


    componentDidMount(){
        
    }

    shouldComponentUpdate(nextProps,nextState){
        
    }

    render () {

        
        return (
            <div className="BigDivArea parent">
                <h3>Retirement!</h3>
            </div>
        );
    }
}

export default Retirement;

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