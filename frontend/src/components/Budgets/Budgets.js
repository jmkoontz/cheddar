import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactDOM from "react-dom";
import * as d3 from "d3";
import Pie from "./Pie";
import '../../css/Budgets.css';

function Budgets() {
  const generateData = (value, length = 5) =>
    d3.range(length).map((item, index) => ({
      date: index,
      value: value === null || value === undefined ? Math.random() * 100 : value
    }));

  const setGraphData = () => {
    let x = 0;
    let nums = [40, 120, 500, 20, 65, 10];
    let arr = [];
    while (x < 6) {
      let obj = {
        date: x,
        value: nums[x],
      };
      arr.push(obj)
      x++;
    }
    return arr;
  };

  const changeData = () => {
    setData(generateData());
  };

  const [data, setData] = useState(setGraphData());
  const [modal, setModal] = useState(false);
  const [category, toggleCategory] = useState(false);
  const [dropdown, toggleDropDown] = useState(false);
  const [selectedDrop, setDropDown] = useState("Select a Category");
  const [categoryArr, setCategoryArr] = useState([]);

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
      // let tmp = categoryArr;
      // tmp.splice(index, 1)
      // console.log(tmp);
      setCategoryArr(replace);
      // console.log(categoryArr);
    }
  }

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
          width={600}
          height={600}
          innerRadius={200}
          outerRadius={300}
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
                <Input type="name" name="name" id="name" placeholder="My Budget" />
              </FormGroup>
              <FormGroup>
                <Label for="income">Income</Label>
                <Input type="income" name="income" id="income" placeholder="$1000" />
              </FormGroup>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input type="name" name="name" id="name" placeholder="My Budget" />
              </FormGroup>
              <FormGroup>
                <Label for="expense">Expense</Label>
                <Input type="expense" name="expense" id="expense" placeholder="My Budget" />
              </FormGroup>

              {categoryArr.map((item, index) =>
                <FormGroup key={index}>
                  <Label for="item">{item}</Label>
                  <Input id='item' placeholder="Amount" />
                  <Button onClick={() => removeCategory(index)} color="danger">-</Button>
                </FormGroup>
              )}


            </Form>
            <Row>
              <Col sm={4}>
                <Button onClick={() => setCategoryArr([...categoryArr, selectedDrop])} className={"addSpace"} color="primary">Add Category</Button>
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