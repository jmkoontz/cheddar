import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, Input, Form, Button, Alert, Row, Col, Table} from 'reactstrap';
import '../Accounts/SignIn.css'

class CategoryTable extends Component {

  constructor(props){
    super(props);

    this.state = {
      category_name: props.category_name,
      assets: []
    };

    let asset1 = {
      asset_name: 'Car',
      asset_value: 1000,
    };
    let asset2 = {
      asset_name: 'Car',
      asset_value: 1000,
    };

    this.addNewAsset(asset1);
    this.addNewAsset(asset2);
  }

  addNewAsset = (asset) => {
    this.state.assets.push(asset);
  };

  renderTable = () => {
    let i = 0;
    let j = 1;
    let table = [];
    let self = this;
    this.state.assets.forEach(function() {
      table.push(
        <tr key={i}>
          <th scope='row'>{j}</th>
          <td>{self.state.assets[i].asset_name}</td>
          <td>{self.state.assets[i].asset_value}</td>
          <td>{self.getRemoveButton(i)}</td>
        </tr>
      );
      i++;
      j++;
    });
    return table;
  };

  getRemoveButton(i){
    return (
      <Button color='danger'>-</Button>
    );
  };

  render (){
    return (
      <div>
        <Row>
          <h3>Phyical Assets</h3>
          <Col md='8'/>
          <Button className='assetButton'>Add New Asset</Button>
        </Row>
        <div style={{height: '1em'}}/>

        <Table dark>
          <thead>
          <tr>
            <th>#</th>
            <th>Asset</th>
            <th>Value</th>
            <th>Remove Asset</th>
          </tr>
          </thead>
          <tbody>
          {this.renderTable()}
          </tbody>
        </Table>
      </div>
    );
  }

}

export default CategoryTable;