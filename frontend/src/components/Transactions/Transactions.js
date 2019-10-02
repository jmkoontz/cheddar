import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { Row, Col, Card, CardHeader, CardFooter, CardBody, CardTitle, CardText } from 'reactstrap';
import DatePicker from "react-datepicker";
import axios from 'axios';
import '../../css/Budgets.css';

function Transactions(props) {

	const [Transactions, setTransactions] = useState(); // Transcations between two dates
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
				day: '%e of %b'
			}
		},
		series: [{
			data: [100, 2, 3],
			pointStart: Date.UTC(2019, 9, 1),
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
	 * Server call to get all transactions in a given time frame
	 */
	const getTransactions = () => {
		// let tmpObj = {
		//   name: transactionName,
		//   amount: transactionAmount,
		//   date: date,
		//   category: transactionCate
		// };

		// axios.post(`http://localhost:8080/Cheddar/Budgets/Budget/Transaction/${props.userID}/${props.curBudget.name}/${transactionCate}`,
		//   {

		//   }).then(function (response) {
		//     // handle success
		//     console.log("Success");

		//     // Update the transaction state


		//   })
		//   .catch((error) => {
		//     console.log("Transaction call did not work");
		//   });
	}

	useEffect(
		() => {

		},
		[]
	);

	return (
		<div >
			<h3>Transactions Page</h3>
			<Row>
				<Col sm={4} />
				<Col sm={4}>
					<Card>
						<CardHeader>
							Enter Date Range
						</CardHeader>
						<CardBody>
							<Row>
								<Col>
									<DatePicker
										id="date"
										selected={startDate}
										onChange={d => setStartDate(d)}
										maxDate={new Date()}
									/>
								</Col>
								<Col>
									<p>to</p>
								</Col>
								<Col >
									<DatePicker
										id="date"
										selected={endDate}
										onChange={d => setEndDate(d)}
										maxDate={new Date()}
									/>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
				<Col sm={4} />
			</Row>
			<Row>
				<Col sm={3} />
				<Col sm={6}>
					<HighchartsReact
						highcharts={Highcharts}
						options={chartData}
					/>
				</Col>
				<Col sm={3} />
			</Row>

		</div>
	);

};

export default Transactions;