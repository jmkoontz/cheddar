import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Card, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import '../../css/Transactions.css';

function SelectBudgetForm(props) {

  const [userID, setUID] = useState(sessionStorage.getItem('user'));
  // Handle drop down
  const [drop, setDrop] = useState(false); // Boolean to control dropdown
  const [budgetDrop, setBudgetDrop] = useState(false) // Boolean for budget selection drop down
  const [transactionCategory, setTransactionCategory] = useState("Select a Category"); // The category for a new transaction
  const [transactionName, setTransactionName] = useState(""); // The name for a new transaction
  const [transactionAmount, setTransactionAmount] = useState(""); // The amount for a new transaction
  const [budgetName, setBudgetName] = useState("Select a Budget"); // Holds the current budget to call for new transaction
  const [budget, setBudget] = useState(null); // Budget for a new transaction
  const [date, setDate] = useState(new Date());
  // Budgets
  const [budgetList, setBudgetList] = useState([]);


  /**
   * Helper method to handle user changes to name
   */
  const handleNChange = (event) => {
    setTransactionName(event.target.value);
  }

	/**
   * Helper method to handle user changes to amount
   */
  const handleAmtChange = (event) => {
    setTransactionAmount(event.target.value);
  }

  const createTransaction = () => {
    console.log(userID + " " + budgetName + " " + transactionCategory)
    axios.post(`http://localhost:8080/Cheddar/Budgets/Budget/Transaction/${userID}/${budgetName}/${transactionCategory}`,
      {
        name: transactionName,
        amount: transactionAmount,
        date: date
      }).then(function (response) {
        // handle success
        console.log("Success");

        // Update the transaction state
        props.getBudgetTransactions(budgetName);
        setTransactionName('');
        setTransactionCategory('');
        setTransactionAmount('');
        setDate(new Date());

      })
      .catch((error) => {
        console.log("Transaction call did not work");
      });
  }

  useEffect(
    () => {
      setBudgetList(props.rawBudgetList);
      console.log(props.rawBudgetList);
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
              <Col sm={4}>
                <Label for="budgetName">Budget</Label>
                <Dropdown id="budgetName" isOpen={budgetDrop} toggle={() => setBudgetDrop(!budgetDrop)}>
                  <DropdownToggle caret>
                    {budgetName}
                  </DropdownToggle>
                  <DropdownMenu>
                    {props.rawBudgetList.length > 0 && props.rawBudgetList.map((item, index) =>
                      <DropdownItem key={index} onClick={() => { setBudgetName(item.name); setBudget(item); }}>{item.name}</DropdownItem>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col sm={4}>
                <FormGroup>
                  <Row>
                    <Label for="category">Category</Label>
                  </Row>
                  <Row>
                    <Dropdown id="category" isOpen={drop} toggle={() => setDrop(!drop)}>
                      {budget
                        ?
                        <div >
                          <DropdownToggle caret>
                            {transactionCategory}
                          </DropdownToggle>
                          <DropdownMenu>
                            {props.rawBudgetList.length > 0 && budget.budgetCategories.map((item, index) =>
                              <DropdownItem key={index} onClick={() => setTransactionCategory(item.name)}>{item.name}</DropdownItem>
                            )}
                          </DropdownMenu>
                        </div>
                        :
                        <DropdownToggle >Please Select a Budget</DropdownToggle>
                      }

                    </Dropdown>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input id="name" onChange={handleNChange} />
                </FormGroup>
              </Col>
              <Col sm={3}>
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input type="number" id="amount" onChange={handleAmtChange} />
                </FormGroup>
              </Col>
              <Col sm={3} className="buttonFix">
                <FormGroup>
                  <Label for="date">Date</Label>
                  <DatePicker
                    id="date"
                    selected={date}
                    onChange={d => setDate(d)}
                    maxDate={new Date()}
                  />
                </FormGroup>

              </Col>
            </Row>

          </Form>
        </CardBody>
        <CardFooter>

          {transactionCategory === "Select a Category" || transactionName === "" || budgetName === "Select a Budget" ||  transactionAmount === "" || budget === null
            ?
            <Button onClick={createTransaction} color="primary" disabled>Submit</Button>
            :
            <Button onClick={createTransaction} color="primary" >Submit</Button>
          }

        </CardFooter>
      </Card>
    </div >
  );

};

export default SelectBudgetForm;