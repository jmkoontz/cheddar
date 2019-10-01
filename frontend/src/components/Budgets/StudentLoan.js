import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
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
      name: "Debt",
      amount: monthlyPayment
    }

    props.setCategoryArr([...props.categoryArr, tmpObj]); // Create a new category using a method from the parent
    setDataEnter(true); // Tell the page to now show the rest of the form
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
            <Label for="loan">Loan Amount</Label>
            <Input onChange={handleAmountChange} name="loan" id="loan" placeholder="10000" />
            <Label for="timeframe">Timeframe of Loan</Label>
            <Input onChange={handleTimeChange} name="timeframe" id="timeframe" placeholder="Enter number of months" />
          </Row>
          <Row>
            <Button color="success" onClick={calculatePayment}>Enter Data</Button>
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