import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Row, Col } from 'reactstrap';
import SelectBudgetForm from './SelectBudgetForm';
import DateFinder from "./DateFinder";
import TransactionTable from '../Budgets/TransactionTable';
import axios from 'axios';
import '../../css/Transactions.css';


function Transactions() {

	const [userID, setUID] = useState(sessionStorage.getItem('user'));
	// Transactions and date states
	const [selectedBudget, setSelectedBudget] = useState("All Budgets");  // What budget to retrieve transactions from
	const [rawBudgetList, setRawBudgetList] = useState([]);	// list of budgets minus "all budgets"
	const [budgetList, setBudgetList] = useState([]);	// List of budgets
	const [currentBudget, setCurrentBudget] = useState();	// Currently selected Budget
	const [transactions, setTransactions] = useState(); // Transcations between two dates
	const [endDate, setEndDate] = useState(); // Time the backend understand
	const [startDate, setStartDate] = useState(); // Time the backend understand     new Date((new Date()).getTime() - (24 * 3600 * 1000))
	// Chart states
	const [hoverData, setHoverData] = useState(); // Show the value at each point when hovered over
	const [dayList, setDayList] = useState(); // Array of each day's spending
	const [chartData, setChartData] = useState(); // Obj containing chart info
	const [totalChartData, setTotalChartData] = useState();	// Obj containing total chart data
	// Error states
	const [error, setError] = useState(); // Error message
	// Utility states
	const [loading, setLoading] = useState(false); // Stops page from loading is a server call is running

	/**
	 * Helper method to show each data point on the chart
	 * @param {Object} e 
	 */
	const showHoverData = (e) => {
		setHoverData(e.target.category);
	}


	/**
	 * Helper function to calculate the difference between two dates
	 */
	const calcNumberDays = (end, start) => {
		let newEnd = new Date(end);
		let newStart = new Date(start);
		return Math.floor((newEnd.getTime() - newStart.getTime()) / (24 * 3600 * 1000));
	}

	/**
	 * Sorts all the transactions by date and stores them in their own
	 */
	const sortByDay = (transactionsList, name) => {
		let numDays = calcNumberDays(endDate, startDate) + 1;
		let daysArray = [];	// Number of days array
		let totalDaysArray = [];	// Total spending line
		let incomeLine = [];	// Red line for the income you have
		let runningTotal = 0;	// Variable for the total
		let income;
		let totalTitle = "Total Spending";
		let dailyTitle = "Daily Spending";

		for (let x = 0; x < budgetList.length; x++) {
			if (budgetList[x].name === name) {
				income = (budgetList[x].income);
			}
		}

		// Populate the daysArray with the number of days between the start and end dates
		for (let x = 0; x < numDays; x++) {
			daysArray.push(0);
			totalDaysArray.push(0);
			if (income) {
				incomeLine.push(income);
			}

		}

		// Loop over transactions and add their amount to to coresponding daysArray index
		for (let x = 0; x < transactionsList.length; x++) {
			// Add each transaction into its respective array index
			let tmpObj = transactionsList[x];
			let index = calcNumberDays(tmpObj.date, startDate);
			if (index >= 0 && index < numDays && tmpObj.amount >= 0) {
				daysArray[index] += tmpObj.amount;
			}

		}

		for (let y = 0; y < daysArray.length; y++) {
			runningTotal += daysArray[y];
			totalDaysArray[y] = runningTotal;
		}

		// Adds a zone into the max spending graph
		let zone = [{
			color: 'green'
		}];

		// Set zone based on name
		if (name != "") {
			totalTitle = "Total Spending for \'" + name + "\'";
			dailyTitle = "Daily Spending for \'" + name + "\'"
			zone = [{
				value: income,
				color: 'green'
			}, {
				color: '#a40000'
			}];
		}


		let dailyOptions = {
			title: {
				text: dailyTitle
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: '%b %e'
				}
			},
			yAxis: {
				title: {
					text: 'Money Spent'
				}
			},
			series: [{
				name: "Daily Spending",
				data: daysArray,
				pointStart: startDate.getTime(),
				pointInterval: 24 * 3600 * 1000, // one day
				animation: {
					duration: 2000
				}
			}],

			plotOptions: {
				series: {
					point: {
						events: {
							mouseOver: showHoverData
						}
					}
				}
			}
		}

		let totalOptions = {
			title: {
				text: totalTitle
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: '%b %e'
				}
			},
			yAxis: {
				title: {
					text: 'Money Spent'
				}
			},
			series: [{
				name: "Total Spending",
				data: totalDaysArray,
				color: 'green',
				pointStart: startDate.getTime(),
				pointInterval: 24 * 3600 * 1000, // one day
				animation: {
					duration: 2000
				},
				zones: zone
			},
			{
				name: "Max Spending",
				data: incomeLine,
				color: 'red',
				pointStart: startDate.getTime(),
				pointInterval: 24 * 3600 * 1000, // one day
				animation: {
					duration: 2000
				},
				dashStyle: 'longdash'
			}
			],

			plotOptions: {
				series: {
					point: {
						events: {
							mouseOver: showHoverData
						}
					}
				}
			}
		}

		setChartData(dailyOptions);
		setTotalChartData(totalOptions)
		setDayList(daysArray);
	}

	/**
	 * Server call to get all transactions in a given time frame
	 */
	const getTimeTransactions = () => {

		let queryOne = `startYear=${startDate.getFullYear()}&startMonth=${startDate.getMonth()}&startDay=${startDate.getDate()}`;
		let queryTwo = `&endYear=${endDate.getFullYear()}&endMonth=${endDate.getMonth()}&endDay=${endDate.getDate()+1}`;
		let query = queryOne + queryTwo;

		axios.get(`http://localhost:8080/Cheddar/Transactions/DateRange/${userID}?${query}`)
			.then(function (response) {
				// handle success				
				for (let i in response.data) {
					let date = new Date(response.data[i].date);
					response.data[i].shortDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
					//console.log(response.data[i].shortDate);
				}
				// Update the transaction state
				setTransactions(response.data);
				sortByDay(response.data, "");

			})
			.catch((error) => {
				console.log("Transaction call did not work");
				console.log(error);
			});
	};

	/**
 	* Server call to get all the transaction data for a specific budget in the database
 	*/
	const getBudgetTransactions = (name) => {

		axios.get(`http://localhost:8080/Cheddar/Budgets/Budget/Transactions/${userID}/${name}`)
			.then(function (response) {
				// handle success
				for (let i in response.data) {
					// Get current budget
					if (response.data[i].name === name) {
						setCurrentBudget(response.data[i]);
					}
					let date = new Date(response.data[i].date);
					response.data[i].shortDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
				}

				// Update the transaction state
				setTransactions(response.data);
				sortByDay(response.data, name);
			})
			.catch((error) => {
				console.log("Transaction call did not work  " + error);
			});
	};

	/**
	 * Helper function to decide which server call to make
	 */
	const getTransactions = () => {

		// Help the transaction table decide what transactions to retrieve
		if (selectedBudget === "All Budgets") {
			getTimeTransactions();
		} else {
			getBudgetTransactions(selectedBudget);
		}

	};

	/**
	 * Server call to get all Budgets
	 */
	const getBudgets = () => {
		setLoading(true);
		axios.get(`http://localhost:8080/Cheddar/Budgets/${userID}`)
			.then(function (response) {
				// handle success

				setBudgetList([...response.data, { name: "All Budgets" }]);
				setRawBudgetList(response.data);
				setLoading(false);
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

	useEffect(
		() => {
			getBudgets();
		},
		[]
	);

	const propData = {
		userID: userID,
		getBudgetTransactions: getBudgetTransactions,
		getTimeTransactions: getTimeTransactions,
		getTransactions: getTransactions,
		startDate: startDate,
		setStartDate: setStartDate,
		endDate: endDate,
		setEndDate: setEndDate,
		budgetList: budgetList,
		rawBudgetList: rawBudgetList,
		setSelectedBudget: setSelectedBudget,
		selectedBudget: selectedBudget
		// setAllTransactions: setAllTransactions,
		// allTransactions: allTransactions
	}

	return (
		<div >
			<h3 className="addSpace">Transactions</h3>
			<Row className="padTop">
				<Col sm={1} />
				<Col sm={5}>
					{dayList
						?
						<HighchartsReact
							allowChartUpdate={true}
							highcharts={Highcharts}
							options={chartData}
						/>
						:
						<div />
					}
				</Col>
				<Col sm={1} />
				<Col sm={4} >
					<DateFinder {...propData} />
				</Col>
				<Col sm={1} />
			</Row>
			<Row>
				<Col sm={1} />
				<Col sm={5}>
					{dayList
						?
						<HighchartsReact
							allowChartUpdate={true}
							highcharts={Highcharts}
							options={totalChartData}
						/>
						:
						<div />
					}

				</Col>
				<Col sm={1} />
				<Col sm={4} >
					{!loading
						?
						<SelectBudgetForm {...propData} />
						:
						<div />
					}

				</Col>
				<Col sm={1} />
			</Row>
			<Row>
				<Col sm={1} />
				<Col sm={10}>
					{!loading
						?
						<TransactionTable {...propData} transactions={transactions} />
						:
						<div />
					}
				</Col>
				<Col sm={1} />
			</Row>

		</div>
	);

};

export default Transactions;