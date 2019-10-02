import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Card, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import '../../css/Budgets.css';

function TransactionForm(props) {

  // Handle drop down
  const [drop, setDrop] = useState(false); // Boolean to control dropdown
  const [transactionCate, setTransactionCate] = useState("Select a Category"); // The category for a new transaction
  const [transactionName, setTransactionName] = useState(); // The name for a new transaction
  const [transactionAmount, setTransactionAmount] = useState(); // The amount for a new transaction
  const [date, setDate] = useState(new Date());

  /**
   * Helper method to handle user changes to name
   */
  const handleNameChange = (event) => {
    setTransactionName(event.target.value);
  }

	/**
   * Helper method to handle user changes to amount
   */
  const handleAmountChange = (event) => {
    setTransactionAmount(event.target.value);
  }

  const createTransaction = () => {
    // let tmpObj = {
    //   name: transactionName,
    //   amount: transactionAmount,
    //   date: date,
    //   category: transactionCate
    // };

    axios.post(`http://localhost:8080/Cheddar/Budgets/Budget/Transaction/${props.userID}/${props.curBudget.name}/${transactionCate}`,
      {
        name: transactionName,
        amount: transactionAmount,
        date: date
      }).then(function (response) {
        // handle success
        console.log("Success");

        // Update the transaction state
        props.getTransactions();
        
      })
      .catch((error) => {
        console.log("Transaction call did not work");
      });
  }

  useEffect(
    () => {

    },
    [props]
  );

  return (
    <div >
      <Card className="heavyPadTop cardSize">
        <CardHeader>
          <p className={"addSpace"}>Enter New Transaction</p>
        </CardHeader>
        <CardBody >
          <Form className="textLeft">
            <Row>
              <Col sm={3}>
                <FormGroup>
                  <Row>
                    <Label for="category">Category</Label>
                  </Row>
                  <Row>
                    <Dropdown id="category" isOpen={drop} toggle={() => setDrop(!drop)}>
                      <DropdownToggle caret>
                        {transactionCate}
                      </DropdownToggle>
                      <DropdownMenu>
                        {props.curBudget.budgetCategories.map((item, index) =>
                          <DropdownItem key={index} onClick={() => setTransactionCate(item.name)}>{item.name}</DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </Row>
                </FormGroup>
              </Col>
              <Col sm={3}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input id="name" onChange={handleNameChange} />
                </FormGroup>
              </Col>
              <Col sm={3}>
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input id="amount" onChange={handleAmountChange} />
                </FormGroup>
              </Col>
              <Col sm={3} className="buttonFix">
                <FormGroup>
                  <Label for="date">Date</Label>
                  <DatePicker
                    id="date"
                    selected={date}
                    onChange={d => setDate(d)}
                  />
                </FormGroup>

              </Col>
            </Row>
            
          </Form>
        </CardBody>
        <CardFooter>
              
              {transactionCate === "Select a Category"
                ?
                <Button onClick={createTransaction} color="primary" disabled>Submit</Button>
                :
                <Button onClick={createTransaction} color="primary" >Submit</Button>
              }
              
            </CardFooter>
      </Card>
    </div>
  );

};

export default TransactionForm;