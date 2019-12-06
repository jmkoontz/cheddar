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
  Table,
  Popover,
  PopoverHeader,
  PopoverBody, ButtonGroup
} from 'reactstrap';
import {InputGroup, InputGroupAddon} from 'reactstrap';
import '../Accounts/SignIn.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons";

class CategoryTable extends Component {

  constructor(props){
    super(props);

    this.state = {
      category_name: props.category_name,
      assets: [],

      modal_visible: false,
      totalAssetValue: 0,

      tipsOn: false,
      tipsClosed: false,
    };
    this.checkIfExample();
  }

  checkIfExample(){
    if(this.state.category_name === 'Crypto'){
      let asset_name = 'Bitcoin';
      let asset_value = '10000';
      let asset = {
        asset_name: asset_name,
        asset_value: asset_value,
      };
      this.state.assets.push(asset);
      this.props.addToAssetValue(asset_value);

      asset_name = 'Ethereum';
      asset_value = '1000';
      asset = {
        asset_name: asset_name,
        asset_value: asset_value,
      };
      this.state.assets.push(asset);
      this.props.addToAssetValue(asset_value);
    }

    if(this.state.category_name === 'Real-Life Currency'){
      let asset_name = 'U.S. Dollars';
      let asset_value = '3000';
      let asset = {
        asset_name: asset_name,
        asset_value: asset_value,
      };
      this.state.assets.push(asset);
      this.props.addToAssetValue(asset_value);

      asset_name = 'Japanese Yen';
      asset_value = '1000';
      asset = {
        asset_name: asset_name,
        asset_value: asset_value,
      };
      this.state.assets.push(asset);
      this.props.addToAssetValue(asset_value);

      asset_name = 'Euros';
      asset_value = '2000';
      asset = {
        asset_name: asset_name,
        asset_value: asset_value,
      };
      this.state.assets.push(asset);
      this.props.addToAssetValue(asset_value);
    }

    if(this.state.category_name === 'Physical Assets'){
      let asset_name = 'House';
      let asset_value = '140000';
      let asset = {
        asset_name: asset_name,
        asset_value: asset_value,
      };
      this.state.assets.push(asset);
      this.props.addToAssetValue(asset_value);

      asset_name = 'Tesla';
      asset_value = '80000';
      asset = {
        asset_name: asset_name,
        asset_value: asset_value,
      };
      this.state.assets.push(asset);
      this.props.addToAssetValue(asset_value);
    }

  }

  addNewAsset = (ev) => {
    ev.preventDefault();
    let asset_name = ev.target.asset_name.value;
    let asset_value = ev.target.amount.value;
    let asset = {
      asset_name: asset_name,
      asset_value: asset_value,
    };
    this.state.assets.push(asset);
    this.props.addToAssetValue(asset_value);
    this.closeModal();
    this.forceUpdate();
  };

  removeItem = (ref, i) => {
    let asset = ref.state.assets.splice(i, 1);
    let value = parseInt(asset[0].asset_value);
    value *= -1;
    this.props.addToAssetValue(value);
    ref.forceUpdate();
  };

  openModal = () => {
    this.setState({ modal_visible: true });
  };

  closeModal = () => {
    this.setState({ modal_visible: false });
  };

  componentDidMount() {
    this.setState({
      tipsOn: true,
    });
  }

  render (){

    return (
      <div>
        <Row>
          <h3>{this.state.category_name}</h3>
        </Row>
        <Row>
          <Button color='primary' size='md' onClick={this.openModal}>Add New Asset</Button>
          <Col md='9'/>
          <Button className='removeCategory' color='danger' onClick={() => this.props.removeCategory(this.state.category_name)}>Remove</Button>
        </Row>
        <div style={{height: '1em'}}/>

        <Modal isOpen={this.state.modal_visible} toggle={this.closeModal}>
          <ModalHeader toggle={this.closeModal}> Add A New Asset to {this.state.category_name} </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.addNewAsset}>
              <Row>
                <Col md='8'>
                  <Input type='text' id='asset_name' placeholder='Asset Name'/>
                </Col>
                <Col md='4'>
                  <InputGroup>
                    <InputGroupAddon addonType='prepend'>$</InputGroupAddon>
                    <Input type='number' id='amount' placeholder='Amount'/>
                  </InputGroup>
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
          {Object.keys(this.state.assets).map((key, i) => {
            return (
              <tr key={i}>
                <th scope='row'>{i+1}</th>
                <td>{this.state.assets[i].asset_name}</td>
                <td>${this.state.assets[i].asset_value}</td>
                <td><Button color='danger' onClick={() => this.removeItem(this, i)}>-</Button></td>
              </tr>
            );
          })}
          </tbody>
        </Table>

        <hr/>
      </div>
    );
  }

}

export default CategoryTable;