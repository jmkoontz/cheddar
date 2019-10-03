import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { Button, Row, Col, Card, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import '../../css/Transactions.css';

function Transactions(props) {

	const [userID, setUID] = useState(sessionStorage.getItem('user'));
	const [transactions, setTransactions] = useState(); // Transcations between two dates
	const [endDate, setEndDate] = useState();
	const [startDate, setStartDate] = useState();
	const [hoverData, setHoverData] = useState(); // Show the value at each point when hovered over
	const [dayList, setDayList] = useState(); // Array of 

	/**
	 * Helper method to show each data point on the chart
	 * @param {Object} e 
	 */
	const showHoverData = (e) => {
		setHoverData(e.target.category);
	}

	// Default for chart TODO: remove this and replace with real data after a server call
	const options = {
		title: {
			text: 'My chart'
		},
		xAxis: {
			type: 'datetime',
			dateTimeLabelFormats: {
				day: '%b %e'
			}
		},
		series: [{
			data: [100, 2, 3],
			pointStart: startDate,
			pointInterval: 24 * 3600 * 1000 // one day
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

	const [chartData, setChartData] = useState(options); // Obj containing chart info

	/**
	 * Helper function to calculate the difference between two dates
	 */
	const calcNumberDays = (end, start) => {
		return ((endDate.getTime() - startDate.getTime()) / (24 * 3600 * 1000)) + 1;
	}

	/**
	 * Sorts all the transactions by date and stores them in their own
	 */
	const sortByDay = (transactionsList) => {
		let numDays = calcNumberDays(endDate, startDate);
		let daysArray = [];

		// Populate the daysArray with the number of days between the start and end dates
		for (let x = 0; x < numDays; x++) {
			daysArray.push(0);
		}

		console.log(transactions);

		// Loop over transactions and add their amount to to coresponding daysArray index
		for (let x = 0; x < transactionsList.length; x++) {
			console.log(startDate.getTime());
			console.log(transactionsList[x].date.getTime());
			// let index = calcNumberDays(transactionsList[x].date - startDate);
			// console.log(index);
			// if (index >= 0 && index < transactionsList.length) {
			// 	daysArray[index] += transactionsList[x].amount;
			// 	console.log(daysArray[index]);
			// }
		}
		console.log(daysArray);
	}

	/**
	 * Server call to get all transactions in a given time frame
	 */
	const getTransactions = () => {
		// let tmpObj = {
		//   name: transactionName,
		//   amount: transactionAmount,
		//   date: date,
		//   category: transactionCate
		// };
		
		let queryOne = `startYear=${startDate.getFullYear()}&startMonth=${startDate.getMonth()}&startDay=${startDate.getDay()}`;
		let queryTwo = `&endYear=${endDate.getFullYear()}&endMonth=${endDate.getMonth()}&endDay=${endDate.getDay()}`;
		let query = queryOne + queryTwo;

		axios.get(`http://localhost:8080/Cheddar/Transactions/DateRange/${userID}?${query}`)
			.then(function (response) {
				// handle success
				console.log("Success");
				console.log(response);
				setTransactions(response.data);
				// Update the transaction state
				sortByDay(response.data);

			})
			.catch((error) => {
				console.log("Transaction call did not work");
			});
	}

	useEffect(
		() => {

		},
		[]
	);

	return (
		<div >
			<h3>Transactions Page</h3>
			{/* <Row>
				<Col sm={4} />
				<Col sm={4}>

				</Col>
				<Col sm={4} />
			</Row> */}
			<Row className="padTop">
				<Col sm={1} />
				<Col sm={6}>
					<HighchartsReact
						highcharts={Highcharts}
						options={chartData}
					/>
				</Col>
				<Col sm={3} >
					<Card>
						<CardHeader>
							Enter Date Range
						</CardHeader>
						<CardBody>
							<Row>
								<Col >
									<p>Start Date</p>
									<DatePicker
										id="date"
										selected={startDate}
										onChange={d => setStartDate(d)}
										maxDate={new Date()}
									/>
								</Col>
								<Col >
									<p>to</p>
								</Col>
								<Col >
									<p>End Date</p>
									<DatePicker
										id="date"
										selected={endDate}
										onChange={d => setEndDate(d)}
										maxDate={new Date()}
									/>
								</Col>
							</Row>
							<Row>
								<Col sm={12}>
									<Button onClick={getTransactions}>Get Transactions</Button>
								</Col>
							</Row>

						</CardBody>
					</Card>
				</Col>
			</Row>

		</div>
	);

};

export default Transactions;