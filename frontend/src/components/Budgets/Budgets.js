import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Pie from "./Pie";
import '../../css/Budgets.css';

function Budgets() {

  const getGraphData = () => {
    let x = 0;
    let nums = [40, 120, 500, 20, 65, 10];
    let categories = ["Gas", "Utilities", "Food And Groceries", "Other", "Housing", "Savings"];
    let arr = [];
    while (x < 6) {
      let obj = {
        date: categories[x],
        value: nums[x],
      };
      arr.push(obj)
      x++;
    }
    // arr is an array of objects with the value 
    return arr;
  };

  const initBudget = () => {
    let obj = {
      "budgetCategories": [],
    "name": "",
    "type": "",
    "income": "",
    "timeFrame": "100",
    "favorite": null
    }
    return obj;
  };

  // User data
  const [userID, setUID] = useState("325623");
  // Budget state data
  const [data, setData] = useState(getGraphData()); // TODO change to pieData
  const [budget, setBudget] = useState(initBudget()); // Favorite budget
  const [budgetList, setBudgetList] = useState(null); // TODO this will contain the list of budgets a user has
  // Creation modal states
  const [modal, setModal] = useState(false); // Triggers the modal opening and closing
  const [dropdown, toggleDropDown] = useState(false); // Toggles the drop down opening and closing
  const [selectedDrop, setDropDown] = useState("Select a Category"); // Holds current value of the new category to add
  const [categoryArr, setCategoryArr] = useState([]); // TODO implement preset budget expenses here
  
  const removeCategory = (index) => {
    if (index == 0 && categoryArr.length == 1) {
      setCategoryArr([]);
    } else {
      let replace = [];
      for (let x = 0; x < categoryArr.length; x++) {
        if (x != index) {
          replace.push(categoryArr[x]);
        }
      }

      setCategoryArr(replace);
    }
  }

  /**
   * Helper method to reset the drop down menu text and add a new expense to the category array
   */
  const resetDropDown = () => {
    setCategoryArr([...categoryArr, selectedDrop]); // TODO allow users to set a category
    setDropDown("Select a Category");
  }

  /**
   * Makes the axios call to retrieve all budgets
   */
  const getBudgets = () => {
    axios.get(`http://localhost:8080/Cheddar/Budgets/${userID}`)
    .then(function (response) {
        // handle success
        setBudgetList(response.data.budgets);

        for (let x = 0; x < response.data.budgets.length; x++) {
          console.log(x);
          if (response.data.budgets[x].favorite === true) {
            setBudget(response.data.budgets[x]);
            break;
          }
        }
      })
      .catch((error) => {
        console.log("Didn't get those budgets sir");
        //TODO: error handling for budgets failing to load
        // if (error.response && error.response.data) {
        //   console.log(error.response.data.error);
        //   if (error.response.data.error.message.errmsg && error.response.data.error.message.errmsg.includes("duplicate")) {
        //     //self.createIt();
        //   }
        // } else {
        //   console.log(error);
        // }
      });
  };

  /**
   * Makes the axios call to the backend to generate a new budget
   */
  const createBudget = () => {
    //let obj = ;

    axios.post(`http://localhost:8080/Cheddar/Budgets/${userID}`,
      {
        budget: data,
      }).then(() => {
        // Show alert telling user they were successful

      }).catch((error) => {
        // if (error.response && error.response.data) {
        //   console.log(error.response.data.error);
        //   if (error.response.data.error.message.errmsg && error.response.data.error.message.errmsg.includes("duplicate")) {
        //     //self.createIt();
        //   }
        // } else {
        //   console.log(error);
        // }
      });
  };

  useEffect(
    () => {
      getGraphData();
      getBudgets();
    },
    [userID]
  );


  return (
    <div className="App">

      <span className="label" id="title">{budget.name}</span>
      <div className="addSpace">
        <Pie
          data={budget.budgetCategories}
          width={500}
          height={500}
          innerRadius={150}
          outerRadius={250}
        />
      </div>
      <Button onClick={() => setModal(true)}>Add a Budget+</Button>
      <div>
        <Modal isOpen={modal} toggle={() => setModal(false)}>
          <ModalHeader toggle={() => setModal(false)}>Create a Budget</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input type="name" name="name" id="name" placeholder="Ex: Monthly Budget" />
              </FormGroup>
              <FormGroup>
                <Label for="income">Income</Label>
                <Input type="income" name="income" id="income" placeholder="Ex: $1000" />
              </FormGroup>

              {categoryArr.map((item, index) =>

                <FormGroup key={index}>
                  <Label for="item">{item}</Label>
                  <Row>
                    <Col sm={10}>
                      <Input id='item' placeholder="Amount" />
                    </Col>
                    <Col sm={2}>
                      <Button block onClick={() => removeCategory(index)} color="danger">-</Button>
                    </Col>
                  </Row>
                </FormGroup>
              )}

            </Form>
            <Row>
              <Col sm={4}>
                {selectedDrop === "Select a Category"
                  ?
                  <Button onClick={resetDropDown} className={"addSpace"} color="primary" disabled>Add Category</Button>
                  :
                  <Button onClick={resetDropDown} className={"addSpace"} color="primary">Add Category</Button>
                }
              </Col>
              <Col>
                <Dropdown isOpen={dropdown} toggle={() => toggleDropDown(!dropdown)}>
                  <DropdownToggle caret>
                    {selectedDrop}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => setDropDown("Entertainment")}>Entertainment</DropdownItem>
                    <DropdownItem onClick={() => setDropDown("Food and Groceries")}>Food and Groceries</DropdownItem>
                    <DropdownItem onClick={() => setDropDown("Savings")}>Savings</DropdownItem>
                    <DropdownItem onClick={() => setDropDown("Debt")}>Debt</DropdownItem>
                    <DropdownItem onClick={() => setDropDown("Housing")}>Housing</DropdownItem>
                    <DropdownItem onClick={() => setDropDown("Gas")}>Gas</DropdownItem>
                    <DropdownItem onClick={() => setDropDown("Utilies")}>Utilies</DropdownItem>
                    <DropdownItem onClick={() => setDropDown("Other")}>Other</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => setModal(false)}>Submit</Button>
            <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default Budgets;