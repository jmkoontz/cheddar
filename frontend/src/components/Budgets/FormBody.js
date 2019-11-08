import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import '../../css/Budgets.css';
import DropDownHelper from './DropDownHelper';

function FormBody(props) {

  const [dropDownObj, setDropDownObj] = useState({ hello: "wordl", name: "butt" });
  const [localCategories, setLocalCategories] = useState(props.categoryArr);  // Holds a local copy of the category array
  const [budName, setBudName] = useState(props.budgetName);
  const [catName, setCatName] = useState(""); // name of custom category

  /**
     * Handles user input from the modal form and updates the state
     * @param {*} index
     */
  const handleCategoryChange = (event) => {
    let newObj = localCategories[event.target.id];

    // Null check
    if (parseInt(event.target.value)) {
      newObj.amount = parseInt(event.target.value);
    } else {
      newObj.amount = 0;
    }


    let arr = [];

    for (let x = 0; x < localCategories.length; x++) {
      if (x === parseInt(event.target.id)) {
        arr[x] = newObj;
      } else {
        arr[x] = localCategories[x];
      }
    }
    setLocalCategories(arr);
    props.setCategoryArr(arr);
  }

  /**
  * Helper method to handle user changes to name
  */
  const handleNameChange = (event) => {
    setBudName(event.target.value);
    props.setBudgetName(event.target.value);
  }

  // change category name in add category dropdown
  const handleCategoryNameChange = (event) => {
    setCatName(event.target.value);
  }

  // handle change in custom category name when editing
  const handleCategoryNameEdit = (index, event) => {
    localCategories[index].name = event.target.value;
    setLocalCategories(JSON.parse(JSON.stringify(localCategories)));
    props.setCategoryArr(localCategories);
  }

  // create custom category
  const handleCustomCategory = (event) => {
    props.setDropDown(catName);
    props.toggleDropDown(!props.dropdown);
  }

  // check if category is a custom category
  const isCustomCategory = (name) => {
    const presetNames = ['Income', 'Entertainment', 'Food and Groceries', 'Savings',
      'Debt', 'Housing', 'Gas', 'Utilities'];

    return !presetNames.includes(name);
  }

  useEffect(
    () => {
      if (props.pickedCategory === "Custom") {
        props.setButtonDisplay(true);
      }
      setLocalCategories(props.categoryArr);
    },
    [props.categoryArr]
  );

  return (
    <div>
      <Form onSubmit={props.createBudget}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input onChange={handleNameChange} type="text" id="name" placeholder="Ex: Monthly Budget" value={budName} />
        </FormGroup>

        {localCategories.map((item, index) =>
          <FormGroup key={index}>
            {props.editModal && isCustomCategory(item.name)
              ?
              <Row>
                <Col sm={4}>
                  <Input onChange={(ev) => handleCategoryNameEdit(index, ev)} type="text" value={item.name} />
                </Col>
              </Row>
              :
              <Label for={"" + index}>{item.name}</Label>
            }
            <Row>
              <Col sm={10}>
                <Input
                  onChange={handleCategoryChange}
                  type="text"
                  id={index}
                  placeholder="Amount"
                  required="required"
                  value={item.amount}
                />
              </Col>
              <Col sm={2}>
                <Button block onClick={() => props.removeCategory(index)} color="danger">-</Button>
              </Col>
            </Row>
          </FormGroup>
        )}

      </Form>
      <Row>
        <Col sm={4}>
          {props.selectedDrop === "Select a Category"
            ?
            <Button onClick={props.resetDropDown} className={"addSpace"} color="primary" disabled>Add Category</Button>
            :
            <Button onClick={() => {props.resetDropDown(); setCatName("")}} className={"addSpace"} color="primary">Add Category</Button>
          }
        </Col>
        <Col className="buttonFix">
          {/* <DropDownHelper {...props} dropDownObj={dropDownObj}/> */}
          <Dropdown isOpen={props.dropdown} toggle={() => props.toggleDropDown(!props.dropdown)}>
            <DropdownToggle caret>
              {props.selectedDrop}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => props.setDropDown("Income")}>Income</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Entertainment")}>Entertainment</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Food and Groceries")}>Food and Groceries</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Savings")}>Savings</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Debt")}>Debt</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Housing")}>Housing</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Gas")}>Gas</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Utilities")}>Utilities</DropdownItem>
              <InputGroup>
                <Input onChange={handleCategoryNameChange} type="text" placeholder="Custom" value={catName} />
                <InputGroupAddon addonType="append">
                  <Button disabled={catName.length === 0} onClick={handleCustomCategory}>Submit</Button>
                </InputGroupAddon>
              </InputGroup>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>

    </div >
  );
};

export default FormBody;
