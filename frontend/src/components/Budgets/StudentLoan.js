import React, { useState, useEffect } from "react";
import { Button, Label, Input } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import '../../css/Budgets.css';
import FormBody from "./FormBody";

function StudentLoan(props) {

  const [dataEnter, setDataEnter] = useState(false); // Boolean to determine if user entered all their data
  const [amount, setAmount] = useState(); // Variable to hold the amount
  const [timeframe, setTimeframe] = useState(); // Variable to hold the timeframe

  /**
   * Function to calculate how much debt to pay a month
   */
  const calculatePayment = () => {
    let monthlyPayment = amount / timeframe;

    // Make a tmp object to store the calculated amount
    let tmpObj = {
      name: "Loan",
      amount: monthlyPayment,
      preset: true
    }

    props.setCategoryArr([...props.categoryArr, tmpObj]); // Create a new category using a method from the parent
    setDataEnter(true); // Tell the page to now show the rest of the form
    props.setButtonDisplay(true);
  }

  /**
   * Helper method to handle user changes to amount
   */
  const handleAmountChange = (event) => {
    setAmount(parseFloat(event.target.value));
  }

  /**
   * Helper method to handle user changes to timeframe
   */
  const handleTimeChange = (event) => {
    setTimeframe(parseFloat(event.target.value));
  }

  useEffect(
    () => {

    },
    [props]
  );

  return (
    <div>
      {!dataEnter
        ?
        <div>
          <Row className="addSpace">
            <Col>
              <Label for="loan">Loan Amount</Label>
              <Input onChange={handleAmountChange} type="number" name="loan" id="loan" placeholder="Ex: 10000" />
              <Label for="timeframe">Timeframe of Loan</Label>
              <Input onChange={handleTimeChange} type="number" name="timeframe" id="timeframe" placeholder="Enter number of months" />
            </Col>
          </Row>
          <Row>
            <Col>
              {amount && timeframe
                ?
                <Button color="success" onClick={calculatePayment}>Calculate Loan Payment</Button>
                :
                <Button color="success" onClick={calculatePayment} disabled>Calculate Loan Payment</Button>
              }

            </Col>
          </Row>
        </div>
        :
        <div>
          <FormBody {...props} />
        </div>
      }
    </div >
  );
};

export default StudentLoan;