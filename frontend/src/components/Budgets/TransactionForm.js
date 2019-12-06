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
  const [transactionCate, setTransactionCate] = useState(""); // The category for a new transaction
  const [transactionName, setTransactionName] = useState(); // The name for a new transaction
  const [transactionAmount, setTransactionAmount] = useState(); // The amount for a new transaction
  const [date, setDate] = useState(new Date());
  const [retirementHistory, setRetirementHistory] = useState([]);
  const [totalRetirement, setTotalRetirement] = useState(0);


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
      alert("Creating Transaction");
      alert(transactionCate);
      console.log("CREATING TRANSACTION");
      if(transactionCate === "Retirement"){
          let contribution = {};
            contribution["date"] = date;
            contribution["amount"] = transactionAmount;
            
            var history = retirementHistory;
            history.push(contribution);

            axios.post("http://localhost:8080/Cheddar/Retirement/Contribution", {
                "uid": props.userID,
                "history": history,
                "previousTotal": totalRetirement,
                }).then(res => {
                    var amount = transactionAmount;
                    setRetirementHistory(history);
                    setTotalRetirement(parseInt(totalRetirement) + parseInt(amount));

                    //console.log(res);
                });
      }
    axios.post(`http://localhost:8080/Cheddar/Budgets/Budget/Transaction/${props.userID}/${props.curBudget.name}/${transactionCate}`,
      {
        name: transactionName,
        amount: transactionAmount,
        date: date
      }).then(function (response) {
        // handle success
        for (let x = 0; x < response.data.budgets.length; x++) {

          if (response.data.budgets[x].name === props.curBudget.name) {
            let obj = props.curBudget;

            obj.budgetCategories = response.data.budgets[x].budgetCategories;
          }
        }

        props.getTransactions();
        setTransactionName('');
        setTransactionCate('');
        setTransactionAmount('');
        setDate(new Date());
      })
      .catch((error) => {
        console.log("Transaction call did not work");
      });
  }

  useEffect(
    
    () => {
        getHistory();
    },
    [props]
  );

 const getHistory = async () => {
      var test = {uid: props.userID};
        var res = await axios.get("http://localhost:8080/Cheddar/Retirement", {
            params: test,
        });
            alert(res.data.history);
            setRetirementHistory(res.data.history);
            setTotalRetirement(res.data.total);
       
  }

  return (
    <div >
      <Card className="heavyPadTop cardSize">
        <CardHeader>
          <p className={"addSpace"}>Enter New Transaction</p>
        </CardHeader>
        <CardBody>
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
                  <Input id="name" value={transactionName} onChange={handleNChange} />
                </FormGroup>
              </Col>
              <Col sm={3}>
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input type="number" value={transactionAmount} id="amount" onChange={handleAmtChange} />
                </FormGroup>
              </Col>
              <Col sm={3} className="buttonFix">
                <FormGroup>
                  <Label for="date">Date</Label>
                  <DatePicker
                    id="date"
                    selected={date}
                    onChange={d => setDate(d)}
                    minDate={new Date(props.currentStartDate)}
                    maxDate={new Date()}
                    showDisabledMonthNavigation
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </CardBody>
        <CardFooter>

          {transactionCate === ""
            ?
            <Button onClick={createTransaction} color="primary" disabled>Submit</Button>
            :
            <Button onClick={createTransaction} color="primary" >Submit</Button>
          }

        </CardFooter>
      </Card>
    </div>
  );
}

export default TransactionForm;
