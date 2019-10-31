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

  render(){

    return (
      <div className='divArea'>
        <h3 className="titleSpace">Assets</h3>
        <Row>
          <Label className='asset-label'>Total Asset Value: ${this.state.assetValue}</Label>
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