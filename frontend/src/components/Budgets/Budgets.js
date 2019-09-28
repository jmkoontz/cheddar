import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import axios from 'axios';
import '../../css/Budgets.css';
import BudgetTabs from "./BudgetTabs";

function Budgets() {

  // User data
  const [userID, setUID] = useState("773202");
  //const [data, setData] = useState(budget.budgetCategories); // TODO change to pieData
  const [budgetList, setBudgetList] = useState([]); // TODO this will contain the list of budgets a user has
  // Creation modal states
  const [modal, setModal] = useState(false); // Triggers the modal opening and closing
  const [dropdown, toggleDropDown] = useState(false); // Toggles the drop down opening and closing
  const [selectedDrop, setDropDown] = useState("Select a Category"); // Holds current value of the new category to add
  const [categoryArr, setCategoryArr] = useState([]);
  // Form states
  const [income, setIncome] = useState();
  const [budgetName, setBudgetName] = useState("");
  // Tab controlls
  const [tab, setTab] = useState("0"); // Holds active tab


  /**
   * Helper method to remove a category from the creation modal
   * @param {int} index : ID of the category to remove
   */
  const removeCategory = (index) => {
    setCategoryArr(categoryArr.filter((s, sidx) => index !== sidx));
  }

  /**
   * Handles user input from the modal form and updates the state
   * @param {*} index 
   */
  const handleCategoryChange = (event) => {
    let newObj = {
      "name": categoryArr[event.target.id].name,
      "amount": parseInt(event.target.value),
      "transactions": []
    };
    let arr = categoryArr;

    for (let x = 0; x < arr.length; x++) {
      if (x === parseInt(event.target.id)) {
        arr[x] = newObj;
      }
    }
    console.log(arr);
    setCategoryArr(arr);
  }

  /**
   * Helper method to handle user changes to name
   */
  const handleNameChange = (event) => {
    setBudgetName(event.target.value);
  }

  /**
   * Helper method to handle user changes to income
   */
  const handleIncomeChange = (event) => {
    setIncome(parseInt(event.target.value));
  }

  /**
   * Helper method to reset the drop down menu text and add a new expense to the category array
   */
  const resetDropDown = () => {
    let obj = {
      "name": selectedDrop,
      "amount": 0,
      "transactions": []
    };
    setCategoryArr([...categoryArr, obj]); // TODO allow users to set a category
    setDropDown("Select a Category");
  }

  // Server calls below here
  /**
   * Makes the axios call to retrieve all budgets
   */
  const getBudgets = () => {
    axios.get(`http://localhost:8080/Cheddar/Budgets/${userID}`)
      .then(function (response) {
        // handle success
        setBudgetList(response.data.budgets);

        for (let x = 0; x < response.data.budgets.length; x++) {
          if (response.data.budgets[x].favorite === true) {
            //setBudget(response.data.budgets[x]);
            setTab(x.toString());
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
    // TODO remove hard coded values here

    axios.post(`http://localhost:8080/Cheddar/Budgets/${userID}`,
      {
        name: budgetName,
        type: "secondary",
        income: income,
        timeFrame: 100,
        favorite: false,
        budgetCategories: categoryArr
      }).then(function (response) {

        console.log(response);
        getBudgets();

      }).catch(function (error) {
        console.log(error);

      });
  };

  useEffect(
    () => {
      getBudgets();
    },
    [userID]
  );


  return (
    <div className="App">
      <BudgetTabs budgetList={budgetList} setTab={setTab} tab={tab} setModal={setModal} />

      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}>Create a Budget</ModalHeader>
        <ModalBody>
          <Form onSubmit={createBudget}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input onChange={handleNameChange} type="text" id="name" placeholder="Ex: Monthly Budget" />
            </FormGroup>
            <FormGroup>
              <Label for="income">Income</Label>
              <Input onChange={handleIncomeChange} id="income" placeholder="Ex: $1000" />
            </FormGroup>

            {categoryArr.map((item, index) =>
              <FormGroup key={index}>
                <Label for={"" + index}>{item.name}</Label>
                <Row>
                  <Col sm={10}>
                    <Input
                      onChange={handleCategoryChange}
                      type="text"
                      id={index}
                      placeholder="Amount"
                    />
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
          <Button type="submit" color="primary" onClick={createBudget}>Submit</Button>
          <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default Budgets;