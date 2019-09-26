import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Pie from "./Pie";
import '../../css/Budgets.css';

function Budgets() {

  const setGraphData = () => {
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

  // Budget state data
  const [data, setData] = useState(setGraphData()); // TODO change this to the current budget's data

  // Creating new budget states
  const [modal, setModal] = useState(false); // Triggers the modal opening and closing
  const [dropdown, toggleDropDown] = useState(false); // Toggles the drop down opening and closing
  const [selectedDrop, setDropDown] = useState("Select a Category"); // Holds current value of the new category to add
  const [categoryArr, setCategoryArr] = useState([]); // TODO implement preset budget expenses here
  const [budgetList, setBudgetList] = useState([data]); // TODO this will contain the list of budgets a user has

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
    setCategoryArr([...categoryArr, selectedDrop]);
    setDropDown("Select a Category");
  }

  /**
   * Makes the axios call to the backend to generate a new budget
   */
  const createBudget = () => {
    axios.post(`https://portfolio-408-main.herokuapp.com/Portfol.io/Games`,
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
      setGraphData();
    },
    [categoryArr]
  );
  

  return (
    <div className="App">

      <span className="label" id="title">August Budget</span>
      <div className="addSpace">
        <Pie
          data={data}
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
                <Button onClick={resetDropDown} className={"addSpace"} color="primary">Add Category</Button>
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