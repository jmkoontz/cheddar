import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card, CardHeader, CardBody, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import '../../css/Transactions.css';

function DateFinder(props) {

  const [localEnd, setLocalEnd] = useState(); // Ending date
  const [localStart, setLocalStart] = useState(); // Starting date
  const [budgetDrop, setBudgetDrop] = useState(); // Opens and closes budgets
  const [selectedBudget, setSelectedBudget] = useState("All Budgets");  // What budget to retrieve transactions from

  /**
   * Set state and prop start date
   */
  const setStart = (date) => {
    props.setStartDate(date);
    setLocalStart(date);
  }

  /**
    * Set state and prop end date
    */
  const setEnd = (date) => {
    props.setEndDate(date);
    setLocalEnd(date);
  }

  /**
   * Helper function to make transaction data call
   */
  const handleFetch = () => {

    if (selectedBudget === "All Budgets") {
      props.getTransactions();
    } else {
      props.getBudgetTransactions(selectedBudget)
    }
  }

  return (
    <Card>
      <CardHeader>
        Enter Date Range
			</CardHeader>
      <CardBody>
        <Row>
          <Col >
            <p>Start Date</p>
            <DatePicker
              id="date"
<<<<<<< HEAD
              selected={props.startDate}
=======
              selected={localStart}
>>>>>>> 21b01a8faecf8674d271f5ac17ec052078e57bf3
              onChange={d => setStart(new Date(d))}
              maxDate={new Date()}
              required={true}
            />
          </Col>
          <Col >
            <p>End Date</p>
            <DatePicker
              id="date"
<<<<<<< HEAD
              selected={props.endDate}
=======
              selected={localEnd}
>>>>>>> 21b01a8faecf8674d271f5ac17ec052078e57bf3
              onChange={d => setEnd(new Date(d))}
              maxDate={new Date()}
              required={true}
            />
          </Col>
        </Row>
        <Row className="padTop">
          <Col sm={3}>
            <p>Select a Budget:</p>
          </Col>
          <Col sm={3}>
            <Dropdown isOpen={budgetDrop} toggle={() => setBudgetDrop(!budgetDrop)}>
              <DropdownToggle caret>
                {selectedBudget}
              </DropdownToggle>
              {props.budgetList
              ?
              <DropdownMenu>
                {props.budgetList.map((item, index) =>
                  <DropdownItem key={index} onClick={() => setSelectedBudget(item.name)}>{item.name}</DropdownItem>
                )}
              </DropdownMenu>
              :
              <DropdownMenu/>
              }
            </Dropdown>
          </Col>
          <Col sm={6}>
<<<<<<< HEAD
            {props.startDate && props.endDate && props.endDate.getTime() > props.startDate.getTime()
=======
            {localStart && localEnd && localEnd.getTime() > localStart.getTime()
>>>>>>> 21b01a8faecf8674d271f5ac17ec052078e57bf3
              ?
              <Button onClick={handleFetch}>Get Transactions</Button>
              :
              <Button disabled>Get Transactions</Button>
            }

          </Col>
        </Row>

      </CardBody>
    </Card>
  );

};
export default DateFinder;