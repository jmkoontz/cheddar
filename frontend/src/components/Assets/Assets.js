import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Table,
  InputGroup,
  InputGroupAddon
} from 'reactstrap';
import CategoryTable from "./CategoryTable";
import '../Accounts/SignIn.css'

class Assets extends Component {

  constructor(props){
    super(props);

    this.state = {
      category_names: [],
      modal: false,
      child: null,
      assetValue: 0,
    };
  }

  addToAssetValue = (val) => {
    this.setState({
      assetValue: this.state.assetValue + parseInt(val),
    })
  };

  addNewCategory = (ev) => {
    ev.preventDefault();
    let category_name = ev.target.category_name.value;
    this.state.category_names.push(category_name);
    this.closeModal();
    this.forceUpdate();
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


  render(){

    return (
      <div className='divArea'>
        <div style={{height: '1em'}}/>
        <h3>Assets</h3>
        <h3>{this.state.assetValue}</h3>
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
            <Col>
              <Button className='signInButton' size='sm' onClick={this.openModal}>Add New Category</Button>
            </Col>
          </Row>
        </div>
        <hr/>

        {this.state.category_names.map((name, i) => {
          return (
            <div key={i}>
              <CategoryTable addToAssetValue={this.addToAssetValue} category_name={name}/>
            </div>
          );
        })}

      </div>
    );
  }

}

export default Assets;