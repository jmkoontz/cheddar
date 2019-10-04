import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Input, Form, Button, Alert, Row, Col, Table} from 'reactstrap';
import CategoryTable from "./CategoryTable";
import '../Accounts/SignIn.css'

class Assets extends Component {

  constructor(props){
    super(props);

    this.state = {
      categories: [],

    };

  }

  addNewCategory = () => {

  };

  addNewAsset = () => {

  };

  render(){

    return (
      <div className='BigDivArea'>
        <div style={{height: '1em'}}/>
        <h3>Assets</h3>
        <hr/>

        <div className='left'>
        <Row>
          <Col>
            <Button className='signInButton' size='sm'>Add New Asset</Button>
          </Col>

        </Row>
          <div style={{height: '1em'}}/>
        <Row>
          <Col>
            <Button className='signInButton' size='sm'>Add New Category</Button>
          </Col>
        </Row>
        </div>

        <hr/>

        <CategoryTable/>
        <hr/>

        <CategoryTable/>
        <hr/>
        <CategoryTable/>
        <hr/>

      </div>
    );
  }

}

export default Assets;