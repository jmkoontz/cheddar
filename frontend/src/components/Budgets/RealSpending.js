import React, { useState, useEffect } from "react";
import { Row, Col, Button, Progress, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import axios from 'axios';
import '../../css/Budgets.css';

function RealSpending(props) {

	// Transaction Info
	const [realSpending, setRealSpending] = useState(); // All the transactions in an array
	const [loadingTransactions, setLoadingTransactions] = useState(false); // State to check if transactions are received yet 

	// Helper states

	/**
	 * Take all the category data 
	 */
	const categorizeData = () => {

	}

	/**
	 * Server call to get all the transaction data from the database
	 */
	const getTransactions = () => {
		setLoadingTransactions(true);
		axios.get(`http://localhost:8080/Cheddar/Budgets/Budget/Transactions/${props.userID}/${props.budgetName}`)
			.then(function (response) {
				// handle success
				setRealSpending(response.data);
				setLoadingTransactions(false);

			})
			.catch((error) => {
				console.log("Transaction call did not work");
			});
	};

	useEffect(
		() => {
			//getTransactions();
		},
		[props]
	);

	return (
		<div>
			{loadingTransactions
				?
				<p>Loading...</p>
				:
				<Progress multi>
					<Progress bar value={12} />
					<Progress bar color="success" value={34} />
				</Progress>
			}
		</div>
	);
}

export default RealSpending;