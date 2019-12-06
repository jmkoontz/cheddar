import React, { useEffect, useState } from "react";
import {
	Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader,
	ModalBody, ModalFooter, Button, ButtonGroup, Popover, PopoverHeader, PopoverBody
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import RealSpending from './RealSpending';
import Pie from "./Pie";
import TransactionTable from './TransactionTable';
import axios from 'axios';
import '../../css/Budgets.css';
import buildUrl from "../../actions/connect";

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
	const [moneyRemaining, setMoneyRemaining] = useState();	// money remaining for fixed amount budgets
	const [isDisabled, setIsDisabled] = useState(false);	// whether a fixed amount budget is disabled
	const [budgetPeriodIndex, setBudgetPeriodIndex] = useState(-1);	// time period index for oldTransactions
	const [maxBudgetPeriodIndex, setMaxBudgetPeriodIndex] = useState(0);	// maximum index for oldTransactions

	const [toolTipArray, setToolTipArray] = useState([false, false, false, false, false, false, false, false]);	// Array of the tool tip states
	const [toolIndex, setToolIndex] = useState(0);	// Index to track what the current tool tip is
	const [toolOn, setToolOn] = useState(false); // Boolean to determine if tool tips should be loaded
	const [toolEnable, setToolEnable] = useState(false); // Global to determine if tool tips are enabled or disabled
	const [toolClose, setToolClose] = useState(false);	// Boolean to determine if final tool tip should be shown

	// helper for restarting the tool tips, TODO remove this
	const resetTips = () => {
		setToolIndex(0);
		setToolTipArray([true, false, false, false, false, false, false, false]);
		setToolOn(true);
		enableTips();
	}

	// helper to tell user that tool tips are disabled after closing
	const popClose = (index) => {
		setToolClose(true);
	}

	// helper for closing a tool tip, takes the index of the tool tip to toggle
	const popFinish = (index) => {
		let tmpArray = toolTipArray;
		tmpArray[index] = !tmpArray[index];
		setToolTipArray(tmpArray);
		setToolClose(false);
		disableTips();
	}

	// helper for opening the previous tool tip, takes the index of the tool tip to toggle
	const popPrev = (index) => {
		let newIndex = index - 1;
		let tmpArray = toolTipArray;
		tmpArray[index] = !tmpArray[index];
		tmpArray[newIndex] = !tmpArray[newIndex];
		setToolTipArray(tmpArray);
		setToolIndex(newIndex);
	}

	// helper for opening the next tool tip, takes the index of the tool tip to toggle
	const popNext = (index) => {
		let newIndex = index + 1;
		let tmpArray = toolTipArray;
		tmpArray[index] = !tmpArray[index];
		tmpArray[newIndex] = !tmpArray[newIndex];
		setToolTipArray(tmpArray);
		setToolIndex(newIndex);
	}

	// server call to disable tool tips
	const disableTips = () => {
		axios.put(buildUrl(`/Cheddar/DisableToolTips/${props.userID}/budgets`))
			.then((response) => {
				setToolOn(false);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	// server call to disable tool tips, TODO remove this
	const enableTips = () => {
		axios.put(buildUrl(`/Cheddar/EnableToolTips/${props.userID}/budgets`))
			.then((response) => {
				console.log(response.data)
				setToolOn(true);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	// server call to check if the tooltip is enabled tor disabled
	const checkToolTip = () => {
		axios.get(buildUrl(`/Cheddar/ToolTips/${props.userID}`))
			.then((response) => {
				setToolEnable(response.data.budgets)
				if (response.data.budgets) {
					setToolIndex(0);
					setToolTipArray([true, false, false, false, false, false, false, false]);
					setToolOn(true);
				}

			})
			.catch((error) => {
				console.log(error);
				setToolEnable(false);
			});
	}

	// delete budget helper
	const deleteHelper = (name) => {
		setDeleteName(name);
		setDeleteModal(!deleteModal);
	}

	// server call to unfavorite a budget
	const unfavoriteBudget = () => {
		axios.put(buildUrl(`/Cheddar/Budgets/Unfavorite/${props.userID}/${props.curBudget.name}`))
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
		axios.put(buildUrl(`/Cheddar/Budgets/Favorite/${props.userID}/${props.curBudget.name}`))
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
		axios.get(buildUrl(`/Cheddar/Budgets/Budget/Transactions/${props.userID}/${props.curBudget.name}`))
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
		axios.get(buildUrl(`/Cheddar/Budgets/Budget/OldTransactions/${props.userID}/${props.curBudget.name}/${index}`))
			.then((response) => {
				// format the date for display
				for (let i in response.data) {
					let date = new Date(response.data[i].date);
					response.data[i].shortDate = getShortDate(date);
				}

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

		let tmpMoneyRemaining = props.curBudget.income;	// income for fixed amount budgets

		for (let x = 0; x < transacts.length; x++) {
			for (let y = 0; y < arrayOfObjects.length; y++) {
				if (transacts[x].category === arrayOfObjects[y].name) {
					// Accumulate spendings and transcation array
					let item = arrayOfObjects[y];
					item.spent += transacts[x].amount;
					item.percentUsed = (item.spent / item.allocated) * 100;
					item.transactions = [...item.transactions, transacts[x]];
					tmpMoneyRemaining -= transacts[x].amount;
				}
			}
		}

		if (props.curBudget.type === 'Fixed Amount') {
			if (tmpMoneyRemaining < 0)
				tmpMoneyRemaining = 0;

			tmpMoneyRemaining = tmpMoneyRemaining.toFixed(2);

			setMoneyRemaining(tmpMoneyRemaining);
		}

		setSpendingByCategory(arrayOfObjects);
	};

	// convert full date object to MM/DD/YYYY
	const getShortDate = (dateTime) => {
		return (dateTime.getMonth() + 1) + '/' + dateTime.getDate() + '/' + dateTime.getFullYear();
	};

	// switch between time periods for the current budget
	const toggleTimePeriod = (i) => {
		if (props.curBudget.type !== 'Custom' && props.curBudget.type !== 'Percentage-Based')
			return;

		let start;
		let end;

		if (i < 0) {
			setStartDate(currentStartDate);
			setEndDate(currentEndDate);
			setBudgetPeriodIndex(i);
			setIsDisabled(false);
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
		setIsDisabled(true);
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

		if (props.curBudget.type === 'Fixed Amount') {
			if (end < currentDate)
				setIsDisabled(true);

			setEndDate(getShortDate(end));
			setDaysRemaining(calculateDateDifference(getShortDate(end)));
			return;
		}

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
		let roundedDiff = Math.round(diff / (1000 * 60 * 60 * 24)) + 1;	// +2: 1 day to round up, 1 to count last day

		if (roundedDiff < 0)
			roundedDiff = 0;

		return roundedDiff;
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
			setIsDisabled(false);
			checkToolTip();

			if (props.curBudget) {
				getTransactions();
				getCurrentDateRange();
				getMaxBudgetPeriodIndex();
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
				<Col sm={6}>
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
							<Button id={"Popover1"} outline color="secondary" onClick={() => { props.setModal(true) }}>Add +</Button>
						</NavItem>

					</Nav>
				</Col>
			</Row>
			<TabContent className="padTop" activeTab={props.tab}>
				{props.budgetList.map((item, index) =>
					<TabPane tabId={index.toString()} key={index}>
						<div id={"Popover7" + item._id} />
						{item.type === 'Custom' || item.type === 'Percentage-Based'
							?
							<Row>
								<Col sm={4} />
								<Col sm={4}>
									<Row>
										<Col>
											<ButtonGroup >
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
							: item.type === 'Fixed Amount'
								?
								<Row>
									<Col>
										<Row>
											<Col>
												{isDisabled
													?
													<span>Budget Ended on {endDate}</span>
													:
													<span>Budget Ends on {endDate}</span>
												}
											</Col>
										</Row>
										<Row>
											<Col>
												{daysRemaining === 1
													?
													<p>{daysRemaining} day and ${moneyRemaining} remaining</p>
													:
													<p>{daysRemaining} days and ${moneyRemaining} remaining</p>
												}
											</Col>
										</Row>
									</Col>
								</Row>
								:
								null
						}
						<Row>
							<Col sm={1} />
							<Col sm={5}>
								<span className="label" id="title">{item.name}
									<span hidden={!isDisabled || item.type !== "Fixed Amount"}> (Expired)</span>
								</span>
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
									<Col id={"Popover3" + item._id}>
										<Button className="padRight buttonAdj" color="danger" onClick={() => { deleteHelper(item.name) }}>Delete</Button>
									</Col>
									<Col id={"Popover2" + item._id}>
										<Button disabled={isDisabled} className="buttonAdj" color="primary" onClick={props.openEditModal}>Edit</Button>
									</Col>
									<Col id={"Popover8" + item._id}>
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
										<RealSpending {...props} itemName={item._id} transactions={transactions} getTransactions={getTransactions}
											budgetPeriodIndex={budgetPeriodIndex} currentStartDate={currentStartDate}
											categorizeData={categorizeData} spendingByCategory={spendingByCategory}
											daysRemaining={daysRemaining} isDisabled={isDisabled} />
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
									<div >
										<TransactionTable parent={"budgets"} itemName={item._id} {...props} transactions={transactions} tableMode={tableMode}
											tableCategory={tableCategory} getTransactions={getTransactions}
											budgetPeriodIndex={budgetPeriodIndex} isDisabled={isDisabled} />
									</div>
									:
									<p>Loading...</p>
								}
							</Col>
						</Row>
						{toolOn && props.curBudget && props.curBudget.name === item.name
							?
							<div>

								<Popover placement="bottom" isOpen={toolTipArray[toolIndex] && toolIndex === 1} target={"Popover2" + item._id} >
									<PopoverHeader>2/8 Tool Tip:</PopoverHeader>
									<PopoverBody>
										{toolClose
											?
											<div>
												<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.  Are you sure you want to continue?</p>
												<Row>
													<Col>
														<Button onClick={() => setToolClose(!toolClose)} color="primary">Go Back</Button>
													</Col>
													<Col>
														<Button onClick={() => popFinish(toolIndex)} color="danger">Finish</Button>
													</Col>
												</Row>
											</div>
											:
											<div>
												<p>Click the 'Edit' button to make changes to a budget you already have.</p>
												<Row>
													<Col sm={6}>
														<ButtonGroup>
															<Button onClick={() => popPrev(1)}>
																<FontAwesomeIcon icon={faAngleLeft} />
															</Button>
															<Button onClick={() => popNext(1)}>
																<FontAwesomeIcon icon={faAngleRight} />
															</Button>
														</ButtonGroup>
													</Col>
													<Col sm={6}>
														<Button onClick={() => popClose(1)}>Close</Button>
													</Col>
												</Row>
											</div>
										}

									</PopoverBody>
								</Popover>
								<Popover placement="bottom" isOpen={toolTipArray[toolIndex] && toolIndex === 2} target={"Popover3" + item._id} >
									<PopoverHeader>3/8 Tool Tip:</PopoverHeader>
									<PopoverBody>
										{toolClose
											?
											<div>
												<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.  Are you sure you want to continue?</p>
												<Row>
													<Col>
														<Button onClick={() => setToolClose(!toolClose)} color="primary">Go Back</Button>
													</Col>
													<Col>
														<Button onClick={() => popFinish(toolIndex)} color="danger">Finish</Button>
													</Col>
												</Row>
											</div>
											:
											<div>
												<p>Click the 'Delete' button to remove a budget.</p>
												<Row>
													<Col sm={6}>
														<ButtonGroup>
															<Button onClick={() => popPrev(2)}>
																<FontAwesomeIcon icon={faAngleLeft} />
															</Button>
															<Button onClick={() => popNext(2)}>
																<FontAwesomeIcon icon={faAngleRight} />
															</Button>
														</ButtonGroup>
													</Col>
													<Col sm={6}>
														<Button onClick={() => popClose(2)}>Close</Button>
													</Col>
												</Row>
											</div>
										}
									</PopoverBody>
								</Popover>
								<Popover placement="bottom" isOpen={toolTipArray[toolIndex] && toolIndex === 3} target={"Popover4" + item._id} >
									<PopoverHeader>4/8 Tool Tip:</PopoverHeader>
									<PopoverBody>
										{toolClose
											?
											<div>
												<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.  Are you sure you want to continue?</p>
												<Row>
													<Col>
														<Button onClick={() => setToolClose(!toolClose)} color="primary">Go Back</Button>
													</Col>
													<Col>
														<Button onClick={() => popFinish(toolIndex)} color="danger">Finish</Button>
													</Col>
												</Row>
											</div>
											:
											<div>
												<p>These progress bars show how much of your allotted money you have spent for each category</p>
												<Row>
													<Col sm={6}>
														<ButtonGroup>
															<Button onClick={() => popPrev(3)}>
																<FontAwesomeIcon icon={faAngleLeft} />
															</Button>
															<Button onClick={() => popNext(3)}>
																<FontAwesomeIcon icon={faAngleRight} />
															</Button>
														</ButtonGroup>
													</Col>
													<Col sm={6}>
														<Button onClick={() => popClose(3)}>Close</Button>
													</Col>
												</Row>
											</div>
										}
									</PopoverBody>
								</Popover>
								<Popover placement="bottom" isOpen={toolTipArray[toolIndex] && toolIndex === 4} target={"Popover5" + item._id} >
									<PopoverHeader>5/8 Tool Tip:</PopoverHeader>
									<PopoverBody>
										{toolClose
											?
											<div>
												<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.  Are you sure you want to continue?</p>
												<Row>
													<Col>
														<Button onClick={() => setToolClose(!toolClose)} color="primary">Go Back</Button>
													</Col>
													<Col>
														<Button onClick={() => popFinish(toolIndex)} color="danger">Finish</Button>
													</Col>
												</Row>
											</div>
											:
											<div>
												<p>Enter your transactions here so they appear on the Pie chart and progress bars</p>
												<Row>
													<Col sm={6}>
														<ButtonGroup>
															<Button onClick={() => popPrev(4)}>
																<FontAwesomeIcon icon={faAngleLeft} />
															</Button>
															<Button onClick={() => popNext(4)}>
																<FontAwesomeIcon icon={faAngleRight} />
															</Button>
														</ButtonGroup>
													</Col>
													<Col sm={6}>
														<Button onClick={() => popClose(4)}>Close</Button>
													</Col>
												</Row>
											</div>
										}
									</PopoverBody>
								</Popover>
								<Popover placement="bottom" isOpen={toolTipArray[toolIndex] && toolIndex === 5} target={"Popover6" + item._id} >
									<PopoverHeader>6/8 Tool Tip:</PopoverHeader>
									<PopoverBody>
										{toolClose
											?
											<div>
												<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.  Are you sure you want to continue?</p>
												<Row>
													<Col>
														<Button onClick={() => setToolClose(!toolClose)} color="primary">Go Back</Button>
													</Col>
													<Col>
														<Button onClick={() => popFinish(toolIndex)} color="danger">Finish</Button>
													</Col>
												</Row>
											</div>
											:
											<div>
												<p>Click the 'View Transactions' button to see a list of all the transactions you've made for this budget</p>
												<Row>
													<Col sm={6}>
														<ButtonGroup>
															<Button onClick={() => popPrev(5)}>
																<FontAwesomeIcon icon={faAngleLeft} />
															</Button>
															<Button onClick={() => popNext(5)}>
																<FontAwesomeIcon icon={faAngleRight} />
															</Button>
														</ButtonGroup>
													</Col>
													<Col sm={6}>
														<Button onClick={() => popClose(5)}>Close</Button>
													</Col>
												</Row>
											</div>
										}
									</PopoverBody>
								</Popover>
								<Popover placement="bottom" isOpen={toolTipArray[toolIndex] && toolIndex === 6} target={"Popover7" + item._id} >
									<PopoverHeader>7/8 Tool Tip:</PopoverHeader>
									<PopoverBody>
										{toolClose
											?
											<div>
												<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.  Are you sure you want to continue?</p>
												<Row>
													<Col>
														<Button onClick={() => setToolClose(!toolClose)} color="primary">Go Back</Button>
													</Col>
													<Col>
														<Button onClick={() => popFinish(toolIndex)} color="danger">Finish</Button>
													</Col>
												</Row>
											</div>
											:
											<div>
												<p>Check here for information about time periods and to see older transactions</p>
												<Row>
													<Col sm={6}>
														<ButtonGroup>
															<Button onClick={() => popPrev(6)}>
																<FontAwesomeIcon icon={faAngleLeft} />
															</Button>
															<Button onClick={() => popNext(6)}>
																<FontAwesomeIcon icon={faAngleRight} />
															</Button>
														</ButtonGroup>
													</Col>
													<Col sm={6}>
														<Button onClick={() => popClose(6)}>Close</Button>
													</Col>
												</Row>
											</div>
										}
									</PopoverBody>
								</Popover>
								<Popover placement="bottom" isOpen={toolTipArray[toolIndex] && toolIndex === 7} target={"Popover8" + item._id} >
									<PopoverHeader>8/8 Tool Tip:</PopoverHeader>
									<PopoverBody>
										{toolClose
											?
											<div>
												<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.  Are you sure you want to continue?</p>
												<Row>
													<Col>
														<Button onClick={() => setToolClose(!toolClose)} color="primary">Go Back</Button>
													</Col>
													<Col>
														<Button onClick={() => popFinish(toolIndex)} color="danger">Finish</Button>
													</Col>
												</Row>
											</div>
											:
											<div>
												<p>Don't forget to favorite a budget so that it appears on your homepage and loads first when looking at your budgets.</p>
												<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.</p>
												<Row>
													<Col sm={6}>
														<ButtonGroup>
															<Button onClick={() => popPrev(7)}>
																<FontAwesomeIcon icon={faAngleLeft} />
															</Button>
														</ButtonGroup>
													</Col>
													<Col sm={6}>
														<Button onClick={() => popFinish(7)}>Finish</Button>
													</Col>
												</Row>
											</div>
										}
									</PopoverBody>
								</Popover>
							</div>
							:
							null
						}
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
			{toolOn
				?
				<Popover placement="top" isOpen={toolTipArray[toolIndex] && toolIndex === 0} target={"Popover1"} >
					<PopoverHeader>1/8 Tool Tip:</PopoverHeader>
					<PopoverBody>
						{toolClose
							?
							<div>
								<p>By clicking finish, tool tips will be disabled on this page and must be renabled from the settings.  Are you sure you want to continue?</p>
								<Row>
									<Col>
										<Button onClick={() => setToolClose(!toolClose)} color="primary">Go Back</Button>
									</Col>
									<Col>
										<Button onClick={() => popFinish(toolIndex)} color="danger">Finish</Button>
									</Col>
								</Row>
							</div>
							:
							<div>
								<p>Click the 'Add' button to add a new Budget.</p>
								<Row>
									<Col sm={6}>
										<ButtonGroup>
											<Button onClick={() => popNext(0)}>
												<FontAwesomeIcon icon={faAngleRight} />
											</Button>
										</ButtonGroup>
									</Col>
									<Col sm={6}>
										<Button onClick={() => popClose(0)}>Close</Button>
									</Col>
								</Row>
							</div>
						}
					</PopoverBody>
				</Popover>
				:
				null
			}
		</div>
	);
}

export default BudgetTabs;
