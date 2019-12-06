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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Table,
  Nav,
  NavItem,
  NavLink, Popover, PopoverHeader, PopoverBody, ButtonGroup,
} from 'reactstrap';
import CategoryTable from "./CategoryTable";
import '../Accounts/SignIn.css'
import History from "../../history";
import axios from "axios";
import buildUrl from "../../actions/connect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons";

class RecurringPayments extends Component {

  constructor(props){
    super(props);

    this.state = {
      modal: false,
      dropdown: false,
      timePeriod: "Monthly",
      editTimePeriod: "Monthly",

      editModal: false,
      editPayment: {
        payment_name: null,
        amount: null,
        date: null,
        timePeriod: null,
      },
      editIndex: null,

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

      userID: sessionStorage.getItem('user'),
      tipsOn: false,
      tipsClosed: false,
      tipIndex: 0,
      tipArray: [true, false, false],

    };

    let payments = this.state.payments;
    payments.push(this.state.show1);
    payments.push(this.state.show2);
    payments.push(this.state.show3);
    this.setState({
      payments: payments,
    })
  }

  disableTips = () => {
    let self = this;
    axios.put(buildUrl(`/Cheddar/DisableToolTips/${this.state.userID}/recurring-payments`))
      .then((response) => {
        self.setState({
          tipsClosed: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  popClose = (index) => {
    this.setState({tipsClosed: true});
  };

  // helper for closing a tool tip, takes the index of the tool tip to toggle
  popFinish = (index) => {
    let tmpArray = this.state.tipArray;
    tmpArray[index] = !tmpArray[index];
    this.setState({tipArray: tmpArray});
    this.setState({tipsClosed: false});
    this.disableTips();
  };

  // helper for opening the previous tool tip, takes the index of the tool tip to toggle
  popPrev = (index) => {
    let newIndex = index - 1;
    let tmpArray = this.state.tipArray;
    tmpArray[index] = !tmpArray[index];
    tmpArray[newIndex] = !tmpArray[newIndex];
    this.setState({tipArray: tmpArray});
    this.setState({tipIndex: newIndex});
  };

  // helper for opening the next tool tip, takes the index of the tool tip to toggle
  popNext = (index) => {
    let newIndex = index + 1;
    let tmpArray = this.state.tipArray;
    tmpArray[index] = !tmpArray[index];
    tmpArray[newIndex] = !tmpArray[newIndex];
    this.setState({tipArray: tmpArray});
    this.setState({tipIndex: newIndex});
  };

  setTipsClosed = (closed) => {
    this.setState({
      tipsClosed: closed,
    });
  };

  componentDidMount() {
    this.setState({
      tipsOn: true,
    });
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

  toggleEditModal = () => {
    this.setState({
      editModal: !this.state.editModal,
    });
  };

  goToAssets = () => {
    History.push("/assets");
  };

  goToRecurringPayments = () => {
    History.push("/recurring-payments");
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

  selectEditTimePeriod = (ev) => {
    this.setState({
      editTimePeriod: ev.target.innerText,
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

  editItem = (ref, i) => {
    ref.setState({
      editModal: true,
      editPayment: this.state.payments[i],
      editIndex: i,
    })
  };

  confirmEdit = (ev) => {
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
    let oldPayment = payments[this.state.editIndex];

    if(payment.payment_name === ''){
      payment.payment_name = oldPayment.payment_name;
    }

    if(payment.amount === ''){
      payment.amount = oldPayment.amount;
    }

    if(payment.date === ''){
      payment.date = oldPayment.date;
    }

    payments[this.state.editIndex] = payment;
    this.setState({
      payments: payments,
      editModal: false,
    });
  };

  render(){

    return (
      <div className='divArea'>
        <div style={{height: '2em'}}/>
        <Nav justified='center' tabs>
          <NavItem>
            <NavLink onClick={this.goToAssets}>
              <b>Assets</b>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active onClick={this.goToRecurringPayments}>
              <b>Recurring Payments</b>
            </NavLink>
          </NavItem>
        </Nav>

        <div style={{height: '2em'}}/>

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
                <Col md='5'/>
                <Button color='primary' size='md'>Add</Button>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.editModal} toggle={this.toggleEditModal}>
          <ModalHeader toggle={this.toggleEditModal}> Edit A Payment </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.confirmEdit}>
              <Row>
                <Col md='7'>
                  <Input type='text' id='payment_name' placeholder={this.state.editPayment.payment_name}/>
                </Col>
                <Col md='5'>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>$</InputGroupAddon>
                    <Input type='number' id='amount' placeholder={this.state.editPayment.amount}/>
                  </InputGroup>
                </Col>
              </Row>
              <div style={{height: '1em'}}/>
              <Row>
                <Col md='7'>
                  <Dropdown size='md' isOpen={this.state.dropdown} toggle={this.toggle}>
                    <DropdownToggle caret>{this.state.editTimePeriod}</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={this.selectEditTimePeriod}>Daily</DropdownItem>
                      <DropdownItem onClick={this.selectEditTimePeriod}>Monthly</DropdownItem>
                      <DropdownItem onClick={this.selectEditTimePeriod}>Yearly</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Col>
                <Col md='5'>
                  <FormGroup>
                    <Input
                      type="date"
                      name="date"
                      id="date"
                      placeholder={this.state.editPayment.date}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div style={{height: '1em'}}/>
              <Row>
                <Col md='5'/>
                <Button color='primary' size='md'>Confirm Edit</Button>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <div className='right'>
          <Row>
            <Col>
              <Button id="Popover1" color='primary' size='md' onClick={this.openModal}>Add New Recurring Payment</Button>
            </Col>
          </Row>
        </div>
        <hr/>

        <Table striped size='md'>
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
                <td><Button color='info' onClick={() => this.editItem(this, i)}>O</Button></td>
                <td><Button color='danger' onClick={() => this.removeItem(this, i)}>-</Button></td>
              </tr>
            );
          })}
          </tbody>
        </Table>

        {this.state.tipsOn
          ?
          <Popover placement="bottom" isOpen={this.state.tipArray[this.state.tipIndex] && this.state.tipIndex === 0}
                   target={"Popover1"}>
            <PopoverHeader>1/1 Tool Tip:</PopoverHeader>
            <PopoverBody>
              {this.state.tipsClosed
                ?
                <div>
                  <p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings. Are
                    you sure you want to continue?</p>
                  <Row>
                    <Col>
                      <Button onClick={() => this.setTipsClosed(!this.state.tipsClosed)} color="primary">Go Back</Button>
                    </Col>
                    <Col>
                      <Button onClick={() => this.popFinish(this.state.tipIndex)} color="danger">Finish</Button>
                    </Col>
                  </Row>
                </div>
                :
                <div>
                  <p>Click this button to add a new recurring payment to your list.</p>
                  <Row>
                    <Col sm={6}>
                    </Col>
                    <Col sm={6}>
                      <Button onClick={() => this.popClose(0)}>Close</Button>
                    </Col>
                  </Row>
                </div>
              }
            </PopoverBody>
          </Popover>
          :
          null
        }

      </div>
    );
  }

}

export default RecurringPayments;