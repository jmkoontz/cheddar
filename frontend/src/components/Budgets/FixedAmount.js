import React, { useState, useEffect } from "react";
import { Button, Label, Input } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import '../../css/Budgets.css';
import FormBody from "./FormBody";

function FixedAmount(props) {

  const [dataEnter, setDataEnter] = useState(false); // Boolean to determine if user entered all their data
  const [amount, setAmount] = useState(); // Variable to hold the amount
  const [timeframe, setTimeframe] = useState(); // Variable to hold the timeframe

  /**
   * Function to calculate how much debt to pay a month
   */
  const calculatePayment = () => {
    let monthlyIncome = amount / timeframe;

    // Make a tmp object to store the calculated amount
    let tmpObj = {
      name: "Income",
      amount: monthlyIncome,
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
              <Label for="sum">Enter Your Sum of Money or Valued Objects</Label>
              <Input onChange={handleAmountChange} name="sum" id="sum" placeholder="Ex: $10000" />
              <Label for="timeframe">Enter Your Timeframe</Label>
              <Input onChange={handleTimeChange} name="timeframe" id="timeframe" placeholder="Enter number of weeks" />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button color="success" onClick={calculatePayment}>Enter Data</Button>
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

export default FixedAmount;
