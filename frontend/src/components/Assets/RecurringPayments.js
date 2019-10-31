import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  Button,
  Row,
  Col,
  Label,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import CategoryTable from "./CategoryTable";
import '../Accounts/SignIn.css'

class RecurringPayments extends Component {

  constructor(props){
    super(props);

    this.state = {
      category_names: [],
      modal: false,
      child: null,
      assetValue: 0,

      selectedCurrency: 'USD',
      currencyConverterOpen: false,

      show1: true,
      show2: true,
      show3: true,
    };
  }

  addToAssetValue = (val) => {
    this.setState({
      assetValue: this.state.assetValue += parseInt(val),
    })
  };

  addNewCategory = (ev) => {
    ev.preventDefault();
    let category_name = ev.target.category_name.value;
    this.state.category_names.push(category_name);
    this.closeModal();
    this.forceUpdate();
  };

  removeCategory = (cat_name) => {
    let array = this.state.category_names;
    console.log(array);
    let i = 0;
    this.state.category_names.map(name => {
      if(name === cat_name){
        array = array.filter(e => e !== cat_name);
      }
      i++;
    });
    this.setState({
      category_names: array,
    });
    console.log(array);
  };

  openModal = () => {
    this.setState({
      modal: true,
    });
  };

  closeModal = () => {
    this.setState({
      modal: false,
    });
  };

  currencyToggle = () => {
    this.setState({
      currencyConverterOpen: !this.state.currencyConverterOpen,
    });
  };

  selectCurrency = (ev) => {
    this.setState({
      selectedCurrency: ev.target.innerText,
    });
  };

  /*convertCurrency = () => {
    convertCurrency(1, 'USD', 'BRL').then(response => response);
    console.log(response);
  };*/

  render(){

    return (
      <div className='divArea'>
        <div style={{height: '1em'}}/>
        <h3>Recurring Payments</h3>

        <hr/>

        <Modal isOpen={this.state.modal} toggle={this.closeModal}>
          <ModalHeader toggle={this.closeModal}> Add A New Payment </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.addNewCategory}>
              <Row>
                <Col md='11'>
                  <Input type='text' id='payment_name' placeholder='Recurring Payment Name'/>
                </Col>
              </Row>
              <div style={{height: '1em'}}/>
              <Row>
                <Col md='3'/>
                <Button className='signInButton' size='sm'>Add</Button>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <div className='right'>
          <Row>
            <Col>
              <Button className='signInButton' size='sm' onClick={this.openModal}>Add New Recurring Payment </Button>
            </Col>
          </Row>
        </div>
        <hr/>

      </div>
    );
  }

}

export default RecurringPayments;