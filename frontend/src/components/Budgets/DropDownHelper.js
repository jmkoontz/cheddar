import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import '../../css/Budgets.css';

function DropDownHelper(props) {
  return (
    <div>
      Hello
    </div>
  // <Dropdown isOpen={props.dropdown} toggle={() => props.toggleDropDown(!props.dropdown)}>
  //   <DropdownToggle caret>
  //     {props.selectedDrop}
  //   </DropdownToggle>
  //   <DropdownMenu>
  //     <DropdownItem onClick={() => props.setDropDown("Income")}>Income</DropdownItem>
  //     <DropdownItem onClick={() => props.setDropDown("Entertainment")}>Entertainment</DropdownItem>
  //     <DropdownItem onClick={() => props.setDropDown("Food and Groceries")}>Food and Groceries</DropdownItem>
  //     <DropdownItem onClick={() => props.setDropDown("Savings")}>Savings</DropdownItem>
  //     <DropdownItem onClick={() => props.setDropDown("Debt")}>Debt</DropdownItem>
  //     <DropdownItem onClick={() => props.setDropDown("Housing")}>Housing</DropdownItem>
  //     <DropdownItem onClick={() => props.setDropDown("Gas")}>Gas</DropdownItem>
  //     <DropdownItem onClick={() => props.setDropDown("Utilies")}>Utilities</DropdownItem>
  //     <DropdownItem onClick={() => props.setDropDown("Other")}>Other</DropdownItem>
  //   </DropdownMenu>
  // </Dropdown>
  );

}
export default DropDownHelper;