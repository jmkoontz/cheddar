import React, { useEffect, useState } from "react";
import {
	Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader,
	ModalBody, ModalFooter, Button, ButtonGroup
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import RealSpending from './RealSpending';
import Pie from "./Pie";
import TransactionTable from './TransactionTable';
import axios from 'axios';
import '../../css/Budgets.css';

function BudgetTabs(props) {


	const [transactions, setTransactions] = useState([]);
	const [spendingByCategory, setSpendingByCategory] = useState([]);	// categories and spending

	const [tableMode, setTableMode] = useState('all');  // display all transactions or just one category
	const [tableCategory, setTableCategory] = useState(''); // category to display transactions for

	const [deleteName, setDeleteName] = useState("");
	const [deleteModal, setDeleteModal] = useState(false);	// Opens the modal to confirm if a user wants to delete a budget
	const [startDate, setStartDate] = useState();	// start date for transactions to display
	const [endDate, setEndDate] = useState();	// end date for transactions to display
	const [currentStartDate, setCurrentStartDate] = useState(); // start of date range currently displayed
	const [currentEndDate, setCurrentEndDate] = useState(); // end of date range currently displayed
	const [daysRemaining, setDaysRemaining] = useState();	// days remaining in current period
	const [budgetPeriodIndex, setBudgetPeriodIndex] = useState(-1);	// time period index for oldTransactions
	const [maxBudgetPeriodIndex, setMaxBudgetPeriodIndex] = useState(0);	// maximum index for oldTransactions

	// delete budget helper
	const deleteHelper = (name) => {
		setDeleteName(name);
		setDeleteModal(!deleteModal);
	}

	// server call to unfavorite a budget
	const unfavoriteBudget = () => {
		axios.put(`http://localhost:8080/Cheddar/Budgets/Unfavorite/${props.userID}/${props.curBudget.name}`)
			.then((response) => {
				// format the date for display
				// TODO, make the budgetList update, dont call getBudgets
				//props.setFavorite(false);
				props.getBudgets();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	// server call to favorite a budget
	const favoriteBudget = () => {
		axios.put(`http://localhost:8080/Cheddar/Budgets/Favorite/${props.userID}/${props.curBudget.name}`)
			.then((response) => {
				// format the date for display
				// TODO, make the budgetList update, dont call getBudgets
				props.getBudgets();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	// get all current transactions for a budget
	const getTransactions = () => {
		axios.get(`http://localhost:8080/Cheddar/Budgets/Budget/Transactions/${props.userID}/${props.curBudget.name}`)
			.then((response) => {
				// format the date for display
				for (let i in response.data) {
					let date = new Date(response.data[i].date);
					response.data[i].shortDate = getShortDate(date);
				}

				categorizeData(response.data, -1);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getOldTransactions = (index) => {
		axios.get(`http://localhost:8080/Cheddar/Budgets/Budget/OldTransactions/${props.userID}/${props.curBudget.name}/${index}`)
			.then((response) => {
				// format the date for display
				for (let i in response.data) {
					let date = new Date(response.data[i].date);
					response.data[i].shortDate = getShortDate(date);
				}

				// console.log(response.data)
				console.log(props.curBudget)
				categorizeData(response.data, index);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const categorizeData = (transacts, index) => {
		// Create the category objects
		setTransactions(transacts);
		let arrayOfObjects = [];
		let categories = props.curBudget.budgetCategories;

		// use old set of categories rather than current set
		if (index >= 0) {
			let tempCategories = [];
			for (let i in props.curBudget.budgetCategories) {
				if (props.curBudget.budgetCategories[i].oldTransactions[index]) {
					let tempCategory = {
						name: props.curBudget.budgetCategories[i].name,
						amount: props.curBudget.budgetCategories[i].oldTransactions[index].amount
					};

					tempCategories.push(tempCategory);
				}
			}

			categories = tempCategories;
			console.log(categories)
		}

		for (let x = 0; x < categories.length; x++) {
			// Generate a new category object
			let newCateObj = {
				name: categories[x].name,
				allocated: categories[x].amount,
				spent: 0,
				percentUsed: 0,
				transactions: []
			};

			arrayOfObjects = [...arrayOfObjects, newCateObj];
		}

		for (let x = 0; x < transacts.length; x++) {
			for (let y = 0; y < arrayOfObjects.length; y++) {
				if (transacts[x].category === arrayOfObjects[y].name) {
					// Accumulate spendings and transcation array
					let item = arrayOfObjects[y];
					item.spent += transacts[x].amount;
					item.percentUsed = (item.spent / item.allocated) * 100;
					item.transactions = [...item.transactions, transacts[x]];
				}
			}
		}


		setSpendingByCategory(arrayOfObjects);
	};

	// convert full date object to MM/DD/YYYY
	const getShortDate = (dateTime) => {
		return (dateTime.getMonth() + 1) + '/' + dateTime.getDate() + '/' + dateTime.getFullYear();
	};

	// switch between time periods for the current budget
	const toggleTimePeriod = (i) => {
		if (props.curBudget.type !== 'Custom')
			return;

		let start;
		let end;

		if (i < 0) {
			setStartDate(currentStartDate);
			setEndDate(currentEndDate);
			setBudgetPeriodIndex(i);
			getTransactions();
			return;
		}

		if (props.curBudget.budgetCategories && props.curBudget.budgetCategories[0]) {
			if (props.curBudget.budgetCategories[0].oldTransactions && props.curBudget.budgetCategories[0].oldTransactions[i]) {
				start = getShortDate(new Date(props.curBudget.budgetCategories[0].oldTransactions[i].startDate));
				end = getShortDate(new Date(props.curBudget.budgetCategories[0].oldTransactions[i].endDate));
			}
		}

		setStartDate(start);
		setEndDate(end);
		setBudgetPeriodIndex(i);
		getOldTransactions(i);
	};

	// get current date range for budget
	const getCurrentDateRange = () => {
		// handles legacy budgets
		if (!props.curBudget.nextUpdate)
			return;

		const currentDate = new Date(Date.now());
		let nextUpdateDate = new Date(props.curBudget.nextUpdate);
		let start;
		let end = new Date(nextUpdateDate);
		end.setUTCDate(end.getUTCDate() - 1);

		if (props.curBudget.timeFrame === 'monthly') {
			start = new Date(currentDate.getFullYear(), currentDate.getUTCMonth(), 1);
		} else if (props.curBudget.timeFrame === 'biweekly') {
			const twoWeeksOffset = 1000 * 60 * 60 * 24 * 14;
			start = new Date(Date.parse(nextUpdateDate) - twoWeeksOffset);
		} else if (props.curBudget.timeFrame === 'weekly') {
			const oneWeekOffset = 1000 * 60 * 60 * 24 * 7;
			start = new Date(Date.parse(nextUpdateDate) - oneWeekOffset);
		}

		setStartDate(getShortDate(start));
		setEndDate(getShortDate(end));
		setCurrentStartDate(getShortDate(start));
		setCurrentEndDate(getShortDate(end));
		setDaysRemaining(calculateDateDifference(getShortDate(end)));
	};

	// calculate number of days remaining in current period
	const calculateDateDifference = (date) => {
		const diff = Date.parse(date) - Date.now();
		return Math.round(diff / (1000 * 60 * 60 * 24)) + 2;	// +2: 1 day to round up, 1 to count last day
	};

	// get and set the maximum index of old budget periods
	const getMaxBudgetPeriodIndex = () => {
		let max = -1;
		for (let i in props.curBudget.budgetCategories) {
			if (props.curBudget.budgetCategories[i].oldTransactions.length - 1 > max)
				max = props.curBudget.budgetCategories[i].oldTransactions.length - 1;
		}

		setMaxBudgetPeriodIndex(max);
	};

	useEffect(
		() => {
			setTransactions([]);
			setSpendingByCategory([]);

			if (props.curBudget) {
				getTransactions();

				if (props.curBudget.type === 'Custom') {
					getCurrentDateRange();
					getMaxBudgetPeriodIndex();
				}
			}

			setBudgetPeriodIndex(-1);
		},
		[props.curBudget]
	);

	const propData = {
		categorizeData: categorizeData,
		getTransactions: getTransactions,
		transactions: transactions,
		tableMode: tableMode,
		tableCategory: tableCategory,
		spendingByCategory: spendingByCategory,
		setSpendingByCategory: setSpendingByCategory
	}

	return (
		<div>
			<Row>
				<Col sm={3} />
				<Col sm={6}>
					<h3 className={"addSpace"}>Select a Budget</h3>
				</Col>
				<Col sm={3} />
			</Row>
			<Row>
				<Col sm={3} />
				<Col sm={6} >
					<Nav tabs>
						{props.budgetList.map((item, index) =>
							<div key={index}>
								<NavItem>
									<NavLink onClick={() => props.setNewTab(index.toString())}>
										{item.name}
									</NavLink>
								</NavItem>
							</div>
						)}
						<NavItem >
							<Button outline color="secondary" onClick={() => { props.setModal(true) }}>Add +</Button>
						</NavItem>
					</Nav>
				</Col>
				<Col sm={3} />
			</Row>
			<TabContent className="padTop" activeTab={props.tab}>
				{props.budgetList.map((item, index) =>
					<TabPane tabId={index.toString()} key={index}>
						{item.type === 'Custom'
							?
							<Row>
								<Col sm={4} />
								<Col sm={4}>
									<Row>
										<Col>
											<ButtonGroup>
												<Button onClick={() => toggleTimePeriod(budgetPeriodIndex + 1)} disabled={budgetPeriodIndex >= maxBudgetPeriodIndex}>
													<FontAwesomeIcon icon={faAngleLeft} />
												</Button>
												<Button disabled>{startDate} - {endDate}</Button>
												<Button onClick={() => toggleTimePeriod(budgetPeriodIndex - 1)} disabled={budgetPeriodIndex < 0}>
													<FontAwesomeIcon icon={faAngleRight} />
												</Button>
											</ButtonGroup>
										</Col>
									</Row>
									<Row hidden={budgetPeriodIndex >= 0}>
										<Col>
											{daysRemaining === 1
												?
												<p>{daysRemaining} day remaining</p>
												:
												<p>{daysRemaining} days remaining</p>
											}
										</Col>
									</Row>
								</Col>
								<Col sm={4} />
							</Row>
							:
							null
						}
						<Row>
							<Col sm={1} />
							<Col sm={5}>
								<span className="label" id="title">{item.name}</span>
								<div className="padTop">
									{index === parseInt(props.tab) && props.curBudget && spendingByCategory
										?
										<Pie data={item.budgetCategories} spendingByCategory={spendingByCategory}
											setTableMode={setTableMode} setTableCategory={setTableCategory} />
										:
										<p>Loading...</p>
									}
								</div>
								<Row>
									<Col sm={3} />
									<Col >
										<Button className="padRight buttonAdj" color="danger" onClick={() => { deleteHelper(item.name) }}>Delete</Button>
									</Col>
									<Col>
										<Button className="buttonAdj" color="primary" onClick={props.openEditModal}>Edit</Button>
									</Col>
									<Col>
										{props.favorite
											?
											<FontAwesomeIcon className="tableHeader" size="3x" icon={faHeart} color="#ffc0cb" onClick={() => unfavoriteBudget()} />
											:
											<FontAwesomeIcon className="tableHeader" size="3x" icon={faHeart} color="#808080" onClick={() => favoriteBudget()} />
										}

									</Col>
									<Col sm={3} />
								</Row>
								<Row className="addSpace" />
							</Col>
							<Col sm={5}>
								<span className="label" id="title">Spending Progress</span>
								<div className="addSpace">
									{index === parseInt(props.tab) && props.curBudget && transactions
										?
										<RealSpending {...props} transactions={transactions} getTransactions={getTransactions}
											budgetPeriodIndex={budgetPeriodIndex} currentStartDate={currentStartDate}
											categorizeData={categorizeData} spendingByCategory={spendingByCategory}
											daysRemaining={daysRemaining} />
										:
										<p>Loading...</p>
									}
								</div>
							</Col>
							<Col sm={1} />
						</Row>
						<Row>
							<Col sm={1} />
							<Col sm={10}>
								{index === parseInt(props.tab) && props.curBudget && transactions
									?
									<TransactionTable {...props} transactions={transactions} tableMode={tableMode}
										tableCategory={tableCategory} getTransactions={getTransactions}
										budgetPeriodIndex={budgetPeriodIndex} />
									:
									<p>Loading...</p>
								}
							</Col>
						</Row>

					</TabPane>

				)}
			</TabContent>

			<Modal isOpen={deleteModal} toggle={() => { setDeleteModal(!deleteModal) }}>
				<ModalHeader toggle={() => { setDeleteModal(!deleteModal) }}>Delete Budget</ModalHeader>
				<ModalBody>
					Are you sure you want to delete the budget '{deleteName}'?
        			</ModalBody>
				<ModalFooter>
					<Button color="danger" onClick={() => { props.deleteBudget(deleteName) }}>Delete Budget</Button>
					<Button color="secondary" onClick={() => { setDeleteModal(!deleteModal) }}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

export default BudgetTabs;
