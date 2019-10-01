import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from 'axios';
import '../../css/Budgets.css';
import BudgetTabs from "./BudgetTabs";
import StudentLoan from "./StudentLoan";
import FormBody from "./FormBody";

function Budgets() {

	// State to manage budgets loading
	const [loading, setLoading] = useState(true);
	// User data
	const [userID, setUID] = useState("773202");
	const [budgetList, setBudgetList] = useState([""]); // TODO this will contain the list of budgets a user has
	// Creation modal states
	const [modal, setModal] = useState(false); // Triggers the modal opening and closing
	const [dropdown, toggleDropDown] = useState(false); // Toggles the drop down opening and closing
	const [selectedDrop, setDropDown] = useState("Select a Category"); // Holds current value of the new category to add
	const [categoryArr, setCategoryArr] = useState([]);
	// Budget type drop down
	const [budgetType, setBudgetType] = useState(); // Currently selected budget type
	const [pickedCategory, setPickedCategory] = useState("Select a Budget Type"); // Dropdown menu selected item
	const [budgetDropDown, toggleBudgetDropDown] = useState(false); // Toggles the drop down opening and closing
	// Form states
	const [budgetName, setBudgetName] = useState("");
	// Tab controlls
	const [tab, setTab] = useState("0"); // Holds active tab
	// Budget creation error message
	const [errMsg, setErrMsg] = useState(""); // Error message
	const [creationError, setCreationAlert] = useState(false); // Toggles error alert

	/**
	 * Helper to close the creation modal
	 */
	const closeModal = () => {
		setModal(false);
		setCreationAlert(false);
	}

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

	const toggleAlert = () => {
		setErrMsg("");
		setCreationAlert(false);
	}

	// Server calls below here
  /**
   * Makes the axios call to retrieve all budgets
   */
	const getBudgets = () => {
		setLoading(true);
		axios.get(`http://localhost:8080/Cheddar/Budgets/${userID}`)
			.then(function (response) {
				// handle success
				setBudgetList(response.data);
				setLoading(false);

				for (let x = 0; x < response.data.length; x++) {
					if (response.data[x].favorite === true) {
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
		toggleAlert();

		// TODO remove hard coded values here
		let tmpIncome;
		for (let x = 0; x < categoryArr.length; x++) {
			if (categoryArr[x].name === "Income") {
				tmpIncome = categoryArr[x].amount;
			}
		}

		axios.post(`http://localhost:8080/Cheddar/Budgets/${userID}`,
			{
				name: budgetName,
				type: pickedCategory,
				income: tmpIncome,
				timeFrame: 100,
				favorite: false,
				budgetCategories: categoryArr
			}).then(function (response) {

				console.log(response);
				setModal(false);
				getBudgets();


			}).catch(function (error) {
				//setErrMsg(error);
				//setCreationAlert(true);
				console.log(error);
			});
	};

	useEffect(
		() => {
			getBudgets();
		},
		[userID]
	);

	const formInfo = {
		createBudget: createBudget,
		categoryArr: categoryArr,
		handleNameChange: handleNameChange,
		handleCategoryChange: handleCategoryChange,
		removeCategory: removeCategory,
		resetDropDown: resetDropDown,
		toggleDropDown: toggleDropDown,
		selectedDrop: selectedDrop,
		setDropDown: setDropDown,
		dropdown: dropdown,
		categoryArr: categoryArr,
		setCategoryArr: setCategoryArr

	};

	return (
		<div className="App">
			{loading
				?
				<div />
				:
				<BudgetTabs userID={userID} budgetList={budgetList} setTab={setTab} tab={tab} setModal={setModal} />
			}

			<Modal isOpen={modal} toggle={() => setModal(false)}>
				<ModalHeader toggle={() => setModal(false)}>Create a Budget</ModalHeader>
				<ModalBody>
					<Row>

						<Col sm={3}>
							<Dropdown isOpen={budgetDropDown} toggle={() => toggleBudgetDropDown(!budgetDropDown)}>
								<DropdownToggle caret>
									{pickedCategory}
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem onClick={() => setPickedCategory("Loan Payment")}>Loan Payment</DropdownItem>
									<DropdownItem onClick={() => setPickedCategory("Old people")}>Old People</DropdownItem>
									<DropdownItem onClick={() => setPickedCategory("Custom")}>Custom Budget</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</Col>
					</Row>
					{pickedCategory === "Select a Budget Type"
						?
						<div />
						:
						<div>
							<ModalBody>
								{creationError
									?
									<Alert color="danger" toggle={toggleAlert}>{errMsg}</Alert>
									:
									<div />
								}
								{pickedCategory === "Student"
									?
									<StudentLoan {...formInfo} />
									: pickedCategory === "Custom"
										?
										<FormBody {...formInfo} />
										:
										<div>
											{/* Other categories will go here */}
										</div>
								}


							</ModalBody>
						</div>
					}
				</ModalBody>

				{pickedCategory === "Select a Budget Type"
					?
					<ModalFooter>
						<Button color="secondary" onClick={() => closeModal()}>Cancel</Button>
					</ModalFooter>
					:
					<ModalFooter>
						<Button type="submit" color="primary" onClick={createBudget}>Submit</Button>
						<Button color="secondary" onClick={() => closeModal()}>Cancel</Button>
					</ModalFooter>
				}


			</Modal>

		</div>
	);
}

export default Budgets;