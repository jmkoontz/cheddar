import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Label, Input, InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DatePicker from 'react-datepicker';

import '../../css/Budgets.css';
import DropDownHelper from './DropDownHelper';

function FormBody(props) {

  const [dropDownObj, setDropDownObj] = useState();
  const [localIncome, setLocalIncome] = useState(props.income); // holds a local copy of income
  const [localCategories, setLocalCategories] = useState(props.categoryArr);  // Holds a local copy of the category array
  const [budName, setBudName] = useState(props.budgetName);
  const [catName, setCatName] = useState(""); // name of custom category
  const [totalPercentage, setTotalPercentage] = useState(0); // total percentage allocated

  // handle change in income
  const handleIncomeChange = (event) => {
    if (!parseInt(event.target.value) && event.target.value.length !== 0) return;

    if (event.target.value.length === 0)
      event.target.value = 0;

    const tmpIncome = parseInt(event.target.value);

    if (props.type === 'Percentage-Based') {
      for (let i in localCategories) {
        const percentage = localCategories[i].percentage / 100.0;
        localCategories[i].amount = percentage * tmpIncome;
      }

      setLocalCategories(JSON.parse(JSON.stringify(localCategories)));
      props.setCategoryArr(localCategories);
    }

    props.setIncome(tmpIncome);
  };

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

  // handle percentage change for category of percentage-based budget
  const handlePercentageChange = (index, event) => {
    if (!parseInt(event.target.value) && event.target.value.length !== 0) return;

    if (event.target.value.length === 0)
      event.target.value = 0;

    const oldPercentage = localCategories[index].percentage;
    const tmpPercentage = parseFloat(event.target.value);
    const tmpTotalPercentage = totalPercentage + tmpPercentage - oldPercentage;

    console.log(oldPercentage + ', ' + tmpPercentage + ', ' + tmpTotalPercentage + ', ' + totalPercentage)
    if (tmpPercentage > 100) return;

    localCategories[index].percentage = tmpPercentage;
    localCategories[index].amount = parseFloat((tmpPercentage * props.income / 100.0).toFixed(2)); // TODO fix extra decimal issue

    // update savings category
    if (index !== 0) {
      setTotalPercentage(tmpTotalPercentage);
      localCategories[0].percentage = Math.max(100 - tmpTotalPercentage, 0);
      localCategories[0].amount = parseFloat((localCategories[0].percentage * props.income / 100.0).toFixed(2));
    }

    setLocalCategories(JSON.parse(JSON.stringify(localCategories)));
    props.setCategoryArr(localCategories);
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
    console.log(localCategories[index].name)
  }

  // create custom category
  const handleCustomCategory = (event) => {
    props.setDropDown(catName);
    props.toggleDropDown(!props.dropdown);
  }

  // check if category is a custom category
  const isCustomCategory = (name) => {
    const presetNames = ['Entertainment', 'Food and Groceries', 'Savings', 'Debt',
        'Housing', 'Gas', 'Utilities','Retirement'];

    return !presetNames.includes(name);
  }

  useEffect(
    () => {
      props.setButtonDisplay(true);
      setLocalCategories(props.categoryArr);

      // calculate percentage allocated when editing
      if (props.type === 'Percentage-Based' && props.editModal) {
        let tmpTotalPercentage = 0;
        for (let i in props.categoryArr) {
          if (props.categoryArr[i].name !== 'Savings')
            tmpTotalPercentage += props.categoryArr[i].percentage;
        }
        setTotalPercentage(tmpTotalPercentage);
      }
    },
    [props.categoryArr]
  );

  useEffect(
    () => {
      setBudName(props.budgetName);
    },
    [props.budgetName]
  );

  return (
    <div>
      <Form onSubmit={props.createBudget}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input onChange={handleNameChange} type="text" id="name" placeholder="Ex: Monthly Budget" value={budName} />
        </FormGroup>

        {props.type === "Fixed Amount"
          ?
          <FormGroup>
            <Label for="date">End Date</Label>
            <Col className="removePadding">
              <DatePicker id="date" selected={props.endDate} onChange={d => props.setEndDate(new Date(d))}
                  minDate={new Date()} required={true} />
            </Col>
          </FormGroup>
          :
          null
        }

        <FormGroup>
          {props.type === "Fixed Amount"
            ?
            <Label for="income">Amount (Lump Sum)</Label>
            :
            <Label for="income">Income</Label>
          }
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>$</InputGroupText>
            </InputGroupAddon>
            <Input onChange={handleIncomeChange} type="text" id="income"
                required="required" value={props.income} />
          </InputGroup>
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
            {props.type === "Percentage-Based"
              ?
              <Row>
                <Col sm={4}>
                  <InputGroup>
                    <Input onChange={(ev) => handlePercentageChange(index, ev)} type="text" id={index}
                        required="required" value={item.percentage} disabled={item.name === "Savings"} />
                    <InputGroupAddon addonType="append">
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
                <Col sm={6}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <Input disabled onChange={handleCategoryChange} type="text" id={index}
                        required="required" value={item.amount} />
                  </InputGroup>
                </Col>
                <Col sm={2}>
                  <Button block onClick={() => props.removeCategory(index)}
                      color="danger" hidden={item.name === "Savings"}>-
                  </Button>
                </Col>
              </Row>
              :
              <Row>
                <Col sm={10}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <Input onChange={handleCategoryChange} type="text" id={index}
                        required="required" value={item.amount} />
                  </InputGroup>
                </Col>
                <Col sm={2}>
                  <Button block onClick={() => props.removeCategory(index)} color="danger">-</Button>
                </Col>
              </Row>
            }
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
          <Dropdown isOpen={props.dropdown} toggle={() => props.toggleDropDown(!props.dropdown)}>
            <DropdownToggle caret>
              {props.selectedDrop}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => props.setDropDown("Entertainment")}>Entertainment</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Food and Groceries")}>Food and Groceries</DropdownItem>
              <DropdownItem hidden={props.type === "Percentage-Based"} onClick={() => props.setDropDown("Savings")}>Savings</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Debt")}>Debt</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Housing")}>Housing</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Gas")}>Gas</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Utilities")}>Utilities</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Retirement")}>Retirement</DropdownItem>
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
    </div>
  );
};

export default FormBody;
