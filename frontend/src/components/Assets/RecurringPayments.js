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
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup, InputGroupAddon, FormGroup, Table,
} from 'reactstrap';
import CategoryTable from "./CategoryTable";
import '../Accounts/SignIn.css'
import History from "../../history";

class RecurringPayments extends Component {

  constructor(props){
    super(props);

    this.state = {
      modal: false,
      dropdown: false,
      timePeriod: "Monthly",

      show1: {
        payment_name: "Rent",
        amount: "1500",
        date: "2019-11-25",
        timePeriod: "Monthly"
      },

      show2: {
        payment_name: "Car Payment",
        amount: "250",
        date: "2019-11-20",
        timePeriod: "Monthly"
      },

      show3: {
        payment_name: "Netflix",
        amount: "10",
        date: "2019-11-30",
        timePeriod: "Monthly"
      },

      payments: [],

    };

    let payments = this.state.payments;
    payments.push(this.state.show1);
    payments.push(this.state.show2);
    payments.push(this.state.show3);
    this.setState({
      payments: payments,
    })
  }

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

  goToAssets = () => {
    History.push("/assets");
  };

  toggle = () => {
    this.setState({
      dropdown: !this.state.dropdown,
    });
  };

  selectTimePeriod = (ev) => {
    this.setState({
      timePeriod: ev.target.innerText,
    });
  };

  addNewPayment = (ev) => {
    ev.preventDefault();
    let payment_name = ev.target.payment_name.value;
    let amount = ev.target.amount.value;
    let timePeriod = this.state.timePeriod;
    let date = ev.target.date.value;

    let payment = {
      payment_name: payment_name,
      amount: amount,
      timePeriod: timePeriod,
      date: date
    };
    let payments = this.state.payments;
    payments.push(payment);
    this.setState({
      payments: payments,
      modal: false,
    });
    this.forceUpdate();
  };

  removeItem = (ref, i) => {
    let payments = ref.state.payments;
    ref.state.payments.splice(i, 1);
    ref.setState({
      payments: payments,
    });
    ref.forceUpdate();
  };

  render(){

    return (
      <div className='divArea'>
        <div style={{height: '1em'}}/>
        <h3>Recurring Payments</h3>

        <hr/>

        <Modal isOpen={this.state.modal} toggle={this.closeModal}>
          <ModalHeader toggle={this.closeModal}> Add A New Payment </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.addNewPayment}>
              <Row>
                <Col md='7'>
                  <Input type='text' id='payment_name' placeholder='Payment Name'/>
                </Col>
                <Col md='5'>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>$</InputGroupAddon>
                    <Input type='number' id='amount' placeholder='Amount'/>
                  </InputGroup>
                </Col>
              </Row>
              <div style={{height: '1em'}}/>
              <Row>
                <Col md='7'>
                  <Dropdown size='md' isOpen={this.state.dropdown} toggle={this.toggle}>
                    <DropdownToggle caret>{this.state.timePeriod}</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={this.selectTimePeriod}>Daily</DropdownItem>
                      <DropdownItem onClick={this.selectTimePeriod}>Monthly</DropdownItem>
                      <DropdownItem onClick={this.selectTimePeriod}>Yearly</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col md='5'>
                  <FormGroup>
                    <Input
                      type="date"
                      name="date"
                      id="date"
                      placeholder="date placeholder"
                    />
                  </FormGroup>
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
            <Button size='sm' onClick={this.goToAssets}>Go To Assets</Button>
            <Col>
              <Button className='signInButton' size='sm' onClick={this.openModal}>Add New Recurring Payment</Button>
            </Col>
          </Row>
        </div>
        <hr/>

        <Table dark>
          <thead>
          <tr>
            <th>#</th>
            <th>Payment</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Time Period</th>
            <th>Edit</th>
            <th>Remove Payment</th>
          </tr>
          </thead>
          <tbody>
          {Object.keys(this.state.payments).map((key, i) => {
            return (
              <tr key={i}>
                <th scope='row'>{i+1}</th>
                <td>{this.state.payments[i].payment_name}</td>
                <td>${this.state.payments[i].amount}</td>
                <td>{this.state.payments[i].date}</td>
                <td>{this.state.payments[i].timePeriod}</td>
                <td><Button color='info'>O</Button></td>
                <td><Button color='danger' onClick={() => this.removeItem(this, i)}>-</Button></td>
              </tr>
            );
          })}
          </tbody>
        </Table>

      </div>
    );
  }

}

export default RecurringPayments;