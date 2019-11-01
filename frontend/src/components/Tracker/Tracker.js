import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Row, Col } from 'reactstrap';
import SelectBudgetForm from '../Transactions/SelectBudgetForm';
import DateFinder from "../Transactions/DateFinder";
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
	// const [transactions, setTransactions] = useState(); // Transcations between two dates
	const [spendingByCategory, setSpendingByCategory] = useState([]);	// categories and spending
	const [endDate, setEndDate] = useState(); // Time the backend understand
	const [startDate, setStartDate] = useState(); // Time the backend understand     new Date((new Date()).getTime() - (24 * 3600 * 1000))
	// Chart states
	const [hoverData, setHoverData] = useState(); // Show the value at each point when hovered over
	const [dayList, setDayList] = useState(); // Array of each day's spending
	const [totalChartData, setTotalChartData] = useState();	// Obj containing total chart data
	// Error states
	const [error, setError] = useState(); // Error message
	// Utility states
	const [loading, setLoading] = useState(false); // Stops page from loading is a server call is running

	let transactions = [];
	let categories = [0,0,0,0,0,0,0,0];
	let categoryAmounts = [0,0,0,0,0,0,0,0];
	let categoryNames = ["Entertainment", "Food and Groceries", "Savings", "Debt", "Housing", "Gas", "Utilities", "Other"];

	const calcTotals = () => {
		let totalTitle = "Total Spending";

		for (let x = 0; x < budgetList.length - 1; x++) {
			for(let y = 0; y < budgetList[x].budgetCategories.length; y++) {
				for(let z = 0; z < budgetList[x].budgetCategories[y].transactions.length; z++) {
					for(let k = 0; k < transactions.length; k++) {
						if(transactions[k]._id === budgetList[x].budgetCategories[y].transactions[z]) {
							if(budgetList[x].budgetCategories[y].name === "Entertainment") {
								categories[0] += transactions[k].amount;
								categoryAmounts[0] += budgetList[x].budgetCategories[y].amount;
							}
							if(budgetList[x].budgetCategories[y].name === "Food and Groceries") {
								categories[1] += transactions[k].amount;
								categoryAmounts[1] += budgetList[x].budgetCategories[y].amount;
							}
							if(budgetList[x].budgetCategories[y].name === "Savings") {
								categories[2] += transactions[k].amount;
								categoryAmounts[2] += budgetList[x].budgetCategories[y].amount;
							}
							if(budgetList[x].budgetCategories[y].name === "Debt") {
								categories[3] += transactions[k].amount;
								categoryAmounts[3] += budgetList[x].budgetCategories[y].amount;
							}
							if(budgetList[x].budgetCategories[y].name === "Housing") {
								categories[4] += transactions[k].amount;
								categoryAmounts[4] += budgetList[x].budgetCategories[y].amount;
							}
							if(budgetList[x].budgetCategories[y].name === "Gas") {
								categories[5] += transactions[k].amount;
								categoryAmounts[5] += budgetList[x].budgetCategories[y].amount;
							}
							if(budgetList[x].budgetCategories[y].name === "Utilities") {
								categories[6] += transactions[k].amount;
								categoryAmounts[6] += budgetList[x].budgetCategories[y].amount;
							}
							if(budgetList[x].budgetCategories[y].name === "Other") {
								categories[7] += transactions[k].amount;
								categoryAmounts[7] += budgetList[x].budgetCategories[y].amount;
							}
							break;
						}
					}
				}
			}
		}

		let totalOptions = {

    chart: {
        type: 'bar'
    },
    title: {
        text: totalTitle
    },
    xAxis: {
        categories: categoryNames,
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Dollars $',
            align: 'middle'
        },
        labels: {
            overflow: 'justify'
        }
    },
    tooltip: {
        valueSuffix: ' dollars'
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: "Spending",
        data: categories
    }, {
			name: "Allotted",
			data: categoryAmounts
		}]
	}


		setTotalChartData(totalOptions);
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
				transactions = response.data;
				calcTotals();

			})
			.catch((error) => {
				console.log("Transaction call did not work");
				console.log(error);
			});
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
		getTimeTransactions: getTimeTransactions,
		startDate: startDate,
		setStartDate: setStartDate,
		endDate: endDate,
		setEndDate: setEndDate,
		budgetList: budgetList,
		rawBudgetList: rawBudgetList,
		setSelectedBudget: setSelectedBudget,
		selectedBudget: selectedBudget,
		spendingByCategory: spendingByCategory,
		setSpendingByCategory: setSpendingByCategory
	}

	return (
		<div >
			<h3 className="addSpace">Summary</h3>
			<Row className="padTop">
				<Col sm={4} />
				<Col sm={4}>
					<DateFinder {...propData} />
				</Col>
				<Col sm={4} />
				<Col sm={4} >

				</Col>
				<Col sm={1} />
			</Row>
			<Row>
				<Col sm={4} />
				<Col sm={4}>

						<HighchartsReact
							allowChartUpdate={true}
							highcharts={Highcharts}
							options={totalChartData}
						/>


				</Col>
				<Col sm={1} />

				<Col sm={1} />
			</Row>

		</div>
	);

};

export default Transactions;
