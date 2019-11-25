import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
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
	const [userID, setUID] = useState(sessionStorage.getItem('user'));
	const [budgetList, setBudgetList] = useState([""]); // TODO this will contain the list of budgets a user has
	// Creation modal states
	const [modal, setModal] = useState(false); // Triggers the modal opening and closing
	const [dropdown, toggleDropDown] = useState(false); // Toggles the drop down opening and closing
	const [selectedDrop, setDropDown] = useState("Select a Category"); // Holds current value of the new category to add
	const [categoryArr, setCategoryArr] = useState([]);
	const [buttonDisplay, setButtonDisplay] = useState(false); // Tells the modal to display the button
	const [editModal, setEditModal] = useState(false); // Boolean to say if I'm editing the budget
	// Budget type drop down
	const [budgetName, setBudgetName] = useState(""); // Name of budget to create
	const [endDate, setEndDate] = useState();	// end date for fixed amount budgets
	const [pickedCategory, setPickedCategory] = useState("Select a Budget Type"); // Dropdown menu selected item
	const [income, setIncome] = useState(0);	// income for budget
	const [pickedTimeFrame, setPickedTimeFrame] = useState("monthly");
	const [budgetDropDown, toggleBudgetDropDown] = useState(false); // Toggles the drop down opening and closing
	const [timeFrameDropDown, toggleTimeFrameDropDown] = useState(false);
	// Page states
	const [newData, setNewData] = useState(false); // Toggles prop changes
	// Tab controlls
	const [tab, setTab] = useState("0"); // Holds active tab
	const [curBudget, setCurBudget] = useState(); // Currently shown budget
	const [favorite, setFavorite] = useState();	// Sets the user's favorite budget
	// Budget creation error message
	const [errMsg, setErrMsg] = useState(""); // Error message
	const [creationError, setCreationAlert] = useState(false); // Toggles error alert

	/**
	 * Helper to close the creation modal
	 */
	const closeModal = () => {
		setModal(false);
		setCreationAlert(false);
		setCategoryArr([]);
		setPickedCategory("Select a Budget Type");
		setPickedTimeFrame("monthly");
		setBudgetName("");
	}

  /**
   * Helper method to remove a category from the creation modal
   * @param {int} index : ID of the category to remove
   */
	const removeCategory = (index) => {
		setCategoryArr(categoryArr.filter((s, sidx) => index !== sidx));
	}

  /**
   * Helper method to reset the drop down menu text and add a new expense to the category array
   */
	const resetDropDown = () => {
		let obj = {
			"name": selectedDrop,
			"amount": 0,
			"transactions": [],
			"percentage": 0
		};
		setCategoryArr([...categoryArr, obj]); // TODO allow users to set a category
		setDropDown("Select a Category");
	}

	/**
	 * Helper function for failed budget creation
	 */
	const toggleAlert = () => {
		setErrMsg("");
		setCreationAlert(false);
	}

	/**
	 * Helper to set the next budget and tab
	 * @param {String: contains the tab index} newTab
	 */
	const setNewTab = (newTab) => {
		setTab(newTab);
		setCurBudget(budgetList[parseInt(newTab)]);
		setFavorite(budgetList[parseInt(newTab)].favorite);
	}

	/**
	 * Helper to set the first budget tab to open
	 * @param {Object: a budget} budg
	 * @param {String: tab to be set} x
	 */
	const setFirstBudget = (budg, x) => {
		setTab(x);
		setCurBudget(budg);
		if (budg) {
			setFavorite(budg.favorite);
		}

	}

	/**
	 * Helper function which opens the modal to edit a budget
	 */
	const openEditModal = () => {
		setModal(true);
		setEditModal(true);
		setPickedCategory(curBudget.type);
		setBudgetName(curBudget.name);

		setIncome(curBudget.income);
		setCategoryArr(curBudget.budgetCategories);

		// let tmpIncome = {
		// 	name: "Income",
		// 	amount: curBudget.income
		// }
		//
		// if (curBudget.type === "Fixed Amount")
		// 	tmpIncome.name = "Amount (Lump Sum)";
		//
		// setCategoryArr([tmpIncome, ...curBudget.budgetCategories]);
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

				let flag = false;
				for (let x = 0; x < response.data.length; x++) {
					if (response.data[x].favorite === true) {
						//setBudget(response.data.budgets[x]);
						flag = true;
						setFirstBudget(response.data[x], x.toString());
						break;
					}
				}

				if (!flag) {
					setFirstBudget(response.data[0], "0");
				}
				setLoading(false);
			})
			.catch((error) => {
				console.log(error);
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

		// let tmpIncome;
		// let index = 0;
		// for (let x = 0; x < categoryArr.length; x++) {
		// 	if (categoryArr[x].name === "Income" || categoryArr[x].name === "Amount (Lump Sum)") {
		// 		index = x;
		// 		tmpIncome = categoryArr[x].amount;
		// 	}
		// 	categoryArr[x].transactions = [];
		// }
		//
		// let removedIncomeArr = categoryArr.filter((s, sidx) => index !== sidx);

		delete categoryArr.percentage;

		let tmpPickedCategory = pickedCategory;
		if (pickedCategory === 'Standard')
			tmpPickedCategory = 'Custom';

		axios.post(`http://localhost:8080/Cheddar/Budgets/${userID}`,
			{
				name: budgetName,
				type: tmpPickedCategory,
				endDate: endDate,
				income: income,
				timeFrame: pickedTimeFrame,
				favorite: false,
				budgetCategories: categoryArr
			}).then(function (response) {

				setModal(false);
				setCategoryArr([]);
				setButtonDisplay(false);
				getBudgets();


			}).catch(function (error) {
				if (error.response && error.response.data) {
					console.log(error.response.data);
					// setErrMsg(error);
					// setCreationAlert(true);
				}
			});
	};

	/**
	* Makes the axios call to the backend to delete a budget
	*/
	const deleteBudget = (name) => {
		axios.delete(`http://localhost:8080/Cheddar/Budgets/Budget/${userID}/${name}`,
		).then(function (response) {

			setModal(false);
			setCategoryArr([]);
			setButtonDisplay(false);
			setCurBudget();
			getBudgets();

		}).catch(function (error) {
			//setErrMsg(error);
			//setCreationAlert(true);
			console.log(error);
		});
	}

	/**
   * Makes the axios call to the backend to edit a budget
   */
	const editBudget = () => {
		let tmpName;
		if (budgetName === curBudget.name) {
			tmpName = "";
		} else {
			tmpName = budgetName;
		}

		delete categoryArr.percentage;

		// let tmpIncome;
		// let index = 0;
		// for (let x = 0; x < categoryArr.length; x++) {
		// 	if (categoryArr[x].name === "Income" || categoryArr[x].name === "Amount (Lump Sum)") {
		// 		index = x;
		// 		tmpIncome = categoryArr[x].amount;
		// 	}
		// }
		//
		// let removedIncomeArr = categoryArr.filter((s, sidx) => index !== sidx);

		axios.put(`http://localhost:8080/Cheddar/Budgets/${userID}/${curBudget.name}`,
			{
				name: tmpName,
				income: income,
				budgetCategories: categoryArr
			}).then(function (response) {

				setEditModal(false);
				setModal(false);
				setButtonDisplay(false);
				setCategoryArr([]);
				setCurBudget();
				getBudgets();

			}).catch(function (error) {
				//setErrMsg(error);
				//setCreationAlert(true);
				console.log(error);
			});
	}

	useEffect(
		() => {
			getBudgets();
		}, [userID]
	);

	const formInfo = {
		editBudget: editBudget,
		deleteBudget: deleteBudget,
		createBudget: createBudget,
		//handleNameChange: handleNameChange,
		//handleCategoryChange: handleCategoryChange,
		budgetName: budgetName,
		setBudgetName: setBudgetName,
		endDate: endDate,
		setEndDate: setEndDate,
		removeCategory: removeCategory,
		resetDropDown: resetDropDown,
		toggleDropDown: toggleDropDown,
		selectedDrop: selectedDrop,
		setDropDown: setDropDown,
		dropdown: dropdown,
		income: income,
		setIncome: setIncome,
		categoryArr: categoryArr,
		setCategoryArr: setCategoryArr,
		tab: tab,
		setNewTab: setNewTab,
		curBudget: curBudget,
		userID: userID,
		budgetList: budgetList,
		setModal: setModal,
		newData: newData,
		setNewData: setNewData,
		setButtonDisplay: setButtonDisplay,
		pickedCategory: pickedCategory,
		editModal: editModal,
		setEditModal: setEditModal,
		openEditModal: openEditModal,
		setFavorite: setFavorite,
		favorite: favorite,
		getBudgets: getBudgets,
		setCurBudget: setCurBudget

	};

	return (
		<div className="App">
			{loading
				?
				<div />
				:
				<BudgetTabs {...formInfo} />
			}

			<Modal isOpen={modal} toggle={() => setModal(false)}>
				{editModal
					?
					<ModalHeader toggle={() => { setModal(false); setEditModal(false); }}>Edit a Budget</ModalHeader>
					:
					<ModalHeader toggle={() => setModal(false)}>Create a Budget</ModalHeader>
				}
				<ModalBody>
					<Row>
						<Col sm={5}>
							<Dropdown isOpen={budgetDropDown} toggle={() => toggleBudgetDropDown(!budgetDropDown)}>
								<DropdownToggle disabled={editModal} className="smallText" caret>
									{pickedCategory}
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem onClick={() => setPickedCategory("Standard")}>Standard Budget</DropdownItem>
									<DropdownItem onClick={() => setPickedCategory("Fixed Amount")}>Fixed Amount</DropdownItem>
									<DropdownItem onClick={() => setPickedCategory("Percentage-Based")}>Percentage-Based</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</Col>
						<Col sm={3} />
						<Col sm={3}>
							<Dropdown isOpen={timeFrameDropDown} toggle={() => toggleTimeFrameDropDown(!timeFrameDropDown)}>
								<DropdownToggle hidden={pickedCategory === 'Fixed Amount'} disabled={editModal}
										className="smallText" caret>
									{pickedTimeFrame.charAt(0).toUpperCase() + pickedTimeFrame.slice(1)}
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem onClick={() => setPickedTimeFrame("monthly")}>Monthly</DropdownItem>
									<DropdownItem onClick={() => setPickedTimeFrame("biweekly")}>Biweekly</DropdownItem>
									<DropdownItem onClick={() => setPickedTimeFrame("weekly")}>Weekly</DropdownItem>
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
								<FormBody {...formInfo} type={pickedCategory} />
								{/*pickedCategory === "Percentage-Based"
									?
									<FormBody {...formInfo} type={pickedCategory} />
									: pickedCategory === "Standard" || pickedCategory === "Custom"
										?
										<FormBody {...formInfo} />
										: pickedCategory === "Fixed Amount"
											?
											<FormBody {...formInfo} type={pickedCategory} />
											:
											<div>
											</div>
								*/}
							</ModalBody>
						</div>
					}
				</ModalBody>

				{!buttonDisplay
					?
					<ModalFooter>
						<Button color="secondary" onClick={() => closeModal()}>Cancel</Button>
					</ModalFooter>
					:
					<ModalFooter>
						{editModal
							?
							<Button type="submit" color="primary" onClick={() => editBudget()}>Submit Changes</Button>
							:
							<Button type="submit" color="primary" onClick={createBudget}>Submit</Button>
						}
						<Button color="secondary" onClick={() => { closeModal(); setEditModal(false); }}>Cancel</Button>
					</ModalFooter>
				}


			</Modal>


		</div>
	);
}

export default Budgets;
