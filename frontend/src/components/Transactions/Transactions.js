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
	const [endDate, setEndDate] = useState(); // Time the backend understand
	//const [endDateOff, setEndDateOff] = useState(); // With UTC offset, for displaying
	const [startDate, setStartDate] = useState(); // Time the backend understand
	//const [startDateOff, setStartDateOff] = useState();// With UTC offset, for displaying
	const [hoverData, setHoverData] = useState(); // Show the value at each point when hovered over
	const [dayList, setDayList] = useState(); // Array of each day's spending
	const [chartData, setChartData] = useState(); // Obj containing chart info
	const [error, setError] = useState(); // Error message

	const endDateHelper = (date) => {
		let interval = 1000 * 60 * 60 * 24;
		let end = Math.floor(date / interval) * interval
		console.log(end)
		// let endDat = new Date(date).getTime();
		// let offset = new Date().getTimezoneOffset();
		// endDat = (endDat / (24 * 3600 * 1000)) * (24 * 3600 * 1000);

		// let endDatOff = endDat - offset + 1000;

		// Use for displaying
		//setEndDateOff(new Date(end));
		setEndDate(new Date(end));
	}

	const startDateHelper = (date) => {
		let interval = 1000 * 60 * 60 * 24;
		let start = Math.floor(date / interval) * interval
		console.log(start)
		// let startDat = new Date(date).getTime();
		// let offset = new Date().getTimezoneOffset();
		// startDat = (startDat / (24 * 3600 * 1000)) * (24 * 3600 * 1000);

		// let startDatOff = startDat - offset + 1000;

		// Use for displaying
		//setStartDateOff(new Date(start));
		setStartDate(new Date(start));
	}

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
	const sortByDay = (transactionsList) => {
		let numDays = calcNumberDays(endDate, startDate) + 1;
		let daysArray = [];

		// Populate the daysArray with the number of days between the start and end dates
		for (let x = 0; x < numDays; x++) {
			daysArray.push(0);
		}

		console.log(transactionsList);

		// Loop over transactions and add their amount to to coresponding daysArray index
		for (let x = 0; x < transactionsList.length; x++) {
			// Add each transaction into its respective array index
			let tmpObj = transactionsList[x];
			let index = calcNumberDays(tmpObj.date, startDate);
			daysArray[index] += tmpObj.amount;
			console.log(new Date(tmpObj.date).getTime() + " " + startDate.getTime());
			console.log(index);

		}

		let options = {
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
				data: daysArray,
				pointStart: startDate.getTime(),
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

		setChartData(options);
		setDayList(daysArray);
	}

	/**
	 * Server call to get all transactions in a given time frame
	 */
	const getTransactions = () => {

		let queryOne = `startYear=${startDate.getFullYear()}&startMonth=${startDate.getMonth()}&startDay=${startDate.getDay()}`;
		let queryTwo = `&endYear=${endDate.getFullYear()}&endMonth=${endDate.getMonth()}&endDay=${endDate.getDay()}`;
		let query = queryOne + queryTwo;

		axios.get(`http://localhost:8080/Cheddar/Transactions/DateRange/${userID}?${query}`)
			.then(function (response) {
				// handle success				
				console.log(response.data)
				setTransactions(response.data);
				// Update the transaction state
				sortByDay(response.data);

			})
			.catch((error) => {
				console.log("Transaction call did not work");
				console.log(error);
			});
	}

	useEffect(
		() => {

		},
		[]
	);

	return (
		<div >
			<h3 className="padTop">Transactions Page</h3>
			<Row className="padTop">
				<Col sm={1} />
				<Col sm={6}>
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
										onChange={d => setStartDate(new Date(d))}
										maxDate={new Date()}
										required={true}
									/>
								</Col>
								<Col >
									<p>End Date</p>
									<DatePicker
										id="date"
										selected={endDate}
										onChange={d => setEndDate(new Date(d))}
										maxDate={new Date()}
										required={true}
									/>
								</Col>
							</Row>
							<Row className="padTop">
								<Col sm={12}>
									{startDate && endDate && endDate.getTime() > startDate.getTime()
										?
										<Button onClick={getTransactions}>Get Transactions</Button>
										:
										<Button onClick={getTransactions} disabled>Get Transactions</Button>
									}

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