import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import '../../css/Budgets.css';
import BudgetTabs from "./BudgetTabs";

function FormBody(props) {

	useEffect(
		() => {
			
		},
		[props]
  );
  
  return (
    <div>
      <Form onSubmit={props.createBudget}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input onChange={props.handleNameChange} type="text" id="name" placeholder="Ex: Monthly Budget" />
        </FormGroup>

        {props.categoryArr.map((item, index) =>
          <FormGroup key={index}>
            <Label for={"" + index}>{item.name}</Label>
            <Row>
              <Col sm={10}>
                <Input
                  onChange={props.handleCategoryChange}
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
            <Button onClick={props.resetDropDown} className={"addSpace"} color="primary">Add Category</Button>
          }
        </Col>
        <Col>
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
              <DropdownItem onClick={() => props.setDropDown("Utilies")}>Utilies</DropdownItem>
              <DropdownItem onClick={() => props.setDropDown("Other")}>Other</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>

    </div >
  );
};

export default FormBody;
