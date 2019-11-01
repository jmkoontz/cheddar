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
import History from "../../history";

class Assets extends Component {

  constructor(props){
    super(props);

    this.state = {
      category_names: [],
      modal: false,
      child: null,
      assetValue: 0,

      showOtherCurrency: false,
      multiplier: 1,

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
    };
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

  /*convertCurrency = () => {
    convertCurrency(1, 'USD', 'BRL').then(response => response);
    console.log(response);
  };*/

  goToRecurringPayments = () => {
    History.push("/recurring-payments");
  };

  render(){

    return (
      <div className='divArea'>
        <h3 className="titleSpace">Assets</h3>
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
        </Row>

        <hr/>

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
                <Col md='3'/>
                <Button className='signInButton' size='sm'>Add</Button>
              </Row>
            </Form>
          </ModalBody>
        </Modal>

        <div className='right'>
          <Row>
            <Button size='sm' onClick={this.goToRecurringPayments}>Go To Recurring Payments</Button>
            <Col>
              <Button className='signInButton' size='sm' onClick={this.openModal}>Add New Category</Button>
            </Col>
          </Row>
        </div>
        <hr/>

        {this.state.show1
        ?
          <CategoryTable addToAssetValue={this.addToAssetValue} removeCategory={this.hide1} category_name={'Physical Assets'}/>
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