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
      categories: [],
      modal: false,

    };

  }

  addNewCategory = (ev) => {
    ev.preventDefault();
    let category_name = ev.target.category_name.value;
    let name = {category_name: category_name};
    this.state.categories.push(new CategoryTable(name));
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

        {this.state.categories.map((table, i) => {
          console.log(table);
          return (
            
          );
        })}

      </div>
    );
  }

}

export default Assets;