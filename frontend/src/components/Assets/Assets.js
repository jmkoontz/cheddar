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
  Nav,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink, NavItem,
  Popover, PopoverHeader, PopoverBody, ButtonGroup, Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import CategoryTable from "./CategoryTable";
import '../Accounts/SignIn.css'
import History from "../../history";
import axios from "axios";
import buildUrl from "../../actions/connect";

class Assets extends Component {

  constructor(props){
    super(props);

    this.state = {
      category_names: [],
      modal: false,
      child: null,
      assetValue: 220000,

      showOtherCurrency: false,
      multiplier: 1,

      selectedCurrency: 'USD',
      currencyConverterOpen: false,

      userID: sessionStorage.getItem('user'),

      tipsOn: false,
      tipsClosed: false,
      tipIndex: 0,
      tipArray: [true, false, false],

      showToolTip2: false,
      showToolTip3: false,
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

  hide1 = () => {
    this.setState({
      show1: false,
      assetValue: this.state.assetValue -= 220000,
    });
  };

  hide2 = () => {
    this.setState({
      show2: false,
      assetValue: this.state.assetValue -= 11000,
    });
  };

  hide3 = () => {
    this.setState({
      show3: false,
      assetValue: this.state.assetValue -= 6000,
    });
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
      showOtherCurrency: true,
    });

    if(ev.target.innerText === 'USD'){
      this.setState({
        showOtherCurrency: false,
      });
    }
  };

  getAssetValue = () => {
    if(!this.state.showOtherCurrency){
      return "$" + this.state.assetValue;
    }

    switch(this.state.selectedCurrency){
      case 'EUR':
        return "€" + (this.state.assetValue * 0.9);

      case 'JPY':
        return "¥" + (this.state.assetValue * 108.04);

      case 'GBP':
        return "£" + (this.state.assetValue * 0.77);

      case 'AUD':
        return "A$" + (this.state.assetValue * 1.45);

      case 'CAD':
        return "C$" + (this.state.assetValue * 1.32);

      case 'CHF':
        return "Fr." + (this.state.assetValue * 0.99);

      case 'CNH':
        return "¥" + (this.state.assetValue * 7.04);

      case 'SEK':
        return "kr" + (this.state.assetValue * 9.63);

      case 'NZD':
        return "NZ$" + (this.state.assetValue * 1.56);
    }

  };

  goToRecurringPayments = () => {
    History.push("/recurring-payments");
  };

  goToAssets = () => {
    History.push("/assets");
  };

  disableTips = () => {
    let self = this;
    axios.put(buildUrl(`/Cheddar/DisableToolTips/${this.state.userID}/assets`))
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

  render(){

    return (
      <div className='divArea'>
        <div style={{height: '2em'}}/>
        <Nav justified='true' tabs>
          <NavItem>
            <NavLink active onClick={this.goToAssets}>
              <b>Assets</b>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={this.goToRecurringPayments}>
              <b>Recurring Payments</b>
            </NavLink>
          </NavItem>
        </Nav>

        <div style={{height: '2em'}}/>

        <Row>
          <Label className='asset-label'>Total Asset Value: {this.getAssetValue()}</Label>
        </Row>
        <Row>
          <Dropdown isOpen={this.state.currencyConverterOpen} toggle={this.currencyToggle}>
            <DropdownToggle caret>{this.state.selectedCurrency}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={this.selectCurrency}>USD</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>EUR</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>JPY</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>GBP</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>AUD</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>CAD</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>CHF</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>CNH</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>SEK</DropdownItem>
              <DropdownItem onClick={this.selectCurrency}>NZD</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Modal isOpen={this.state.modal} toggle={this.closeModal}>
            <ModalHeader toggle={this.closeModal}> Add A New Category </ModalHeader>
            <ModalBody>
              <Form onSubmit={this.addNewCategory}>
                <Row>
                  <Col md='11'>
                    <Input type='text' id='category_name' placeholder='Category Name'/>
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

          <div className='right'>
            <Col>
              <Button id={"Popover1"} color='primary' size='md' onClick={this.openModal}>Add New Category</Button>
            </Col>
          </div>
        </Row>

        {this.state.tipsOn
        ?
          <Popover placement="bottom" isOpen={this.state.tipArray[this.state.tipIndex] && this.state.tipIndex === 0}
                   target={"Popover1"}>
            <PopoverHeader>1/3 Tool Tip:</PopoverHeader>
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
                  <p>Click 'Add New Category' button to add a new table to the page.</p>
                  <Row>
                    <Col sm={6}>
                      <ButtonGroup>
                        <Button onClick={() => this.popNext(0)}>
                          <FontAwesomeIcon icon={faAngleRight}/>
                        </Button>
                      </ButtonGroup>
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

        <hr/>

        <Row>
          <h3>Physical Assets</h3>
        </Row>
        <Row>
          <Button id="Popover2" color='primary' size='md'>Add New Asset</Button>
          <Col md='9'/>
          <Button id="Popover3" className='removeCategory' color='danger'>Remove</Button>
        </Row>
        <div style={{height: '1em'}}/>

        <Table striped size='md'>
          <thead>
          <tr>
            <th>#</th>
            <th>Asset</th>
            <th>Value</th>
            <th>Remove Asset</th>
          </tr>
          </thead>
          <tbody>

          <tr key={0}>
            <th scope='row'>{1}</th>
            <td>House</td>
            <td>$140000</td>
            <td><Button color='danger'>-</Button></td>
          </tr>

          <tr key={1}>
            <th scope='row'>{2}</th>
            <td>Tesla</td>
            <td>$80000</td>
            <td><Button color='danger'>-</Button></td>
          </tr>

          </tbody>
        </Table>

        {this.state.tipsOn
          ?
          <Popover placement="bottom" isOpen={this.state.tipArray[this.state.tipIndex] && this.state.tipIndex === 1}
                   target={"Popover2"}>
            <PopoverHeader>2/3 Tool Tip:</PopoverHeader>
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
                  <p>Click the 'Add' button to add a new asset to this category.</p>
                  <Row>
                    <Col sm={6}>
                      <ButtonGroup>
                        <Button onClick={() => this.popPrev(1)}>
                          <FontAwesomeIcon icon={faAngleLeft}/>
                        </Button>
                        <Button onClick={() => this.popNext(1)}>
                          <FontAwesomeIcon icon={faAngleRight}/>
                        </Button>
                      </ButtonGroup>
                    </Col>
                    <Col sm={6}>
                      <Button onClick={() => this.popClose(1)}>Close</Button>
                    </Col>
                  </Row>
                </div>
              }
            </PopoverBody>
          </Popover>
          :
          null
        }

        {this.state.tipsOn
          ?
          <Popover placement="bottom" isOpen={this.state.tipArray[this.state.tipIndex] && this.state.tipIndex === 2}
                   target={"Popover3"}>
            <PopoverHeader>3/3 Tool Tip:</PopoverHeader>
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
                  <p>Click the 'Remove' button to remove this category.</p>
                  <Row>
                    <Col sm={6}>
                      <ButtonGroup>
                        <Button onClick={() => this.popPrev(2)}>
                          <FontAwesomeIcon icon={faAngleLeft}/>
                        </Button>
                      </ButtonGroup>
                    </Col>
                    <Col sm={6}>
                      <Button onClick={() => this.popClose(2)}>Close</Button>
                    </Col>
                  </Row>
                </div>
              }
            </PopoverBody>
          </Popover>
          :
          null
        }

        {this.state.show2
          ?
          <CategoryTable addToAssetValue={this.addToAssetValue} removeCategory={this.hide2} category_name={'Crypto'}/>
          :
          null
        }

        {this.state.show3
          ?
          <CategoryTable addToAssetValue={this.addToAssetValue} removeCategory={this.hide3} category_name={'Real-Life Currency'}/>
          :
          null
        }

        {this.state.category_names.map((name, i) => {
          return (
            <div key={i}>
              <CategoryTable addToAssetValue={this.addToAssetValue} removeCategory={this.removeCategory} category_name={name}/>
            </div>
          );
        })}

      </div>
    );
  }

}

export default Assets;