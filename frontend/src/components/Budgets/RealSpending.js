import React, { useState, useEffect } from "react";
import { Progress, Row, Col, Form, FormGroup, Label, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import axios from 'axios';
import '../../css/Budgets.css';

function RealSpending(props) {

	// Transaction Info
	const [transactions, setTransactions] = useState(); // All the transactions in an array
	const [loadingTransactions, setLoadingTransactions] = useState(false); // State to check if transactions are received yet 
	const [categoryObjs, setCategoryObjs] = useState([]);	// Array of the category objects for Progress bars

	// Handle drop down
	const [drop, setDrop] = useState(false); // Boolean to control dropdown
	const [transactionCate, setTransactionCate] = useState("Select a Category"); // The category for a new transaction
	const [transactionName, setTransactionName] = useState(); // The name for a new transaction

	/**
	 * Generate category objects with respective transaction data inside
	 */
	const categorizeData = (transacts) => {
		// Create the category objects
		let arrayOfObjects = [];
		let categories = props.curBudget.budgetCategories;

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
		//console.log(arrayOfObjects);
		//console.log(transacts);
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
		setCategoryObjs(arrayOfObjects);
		setLoadingTransactions(false);
		//console.log(arrayOfObjects);
	}

	/**
	 * Server call to get all the transaction data for a budget the database
	 */
	const getTransactions = () => {
		setLoadingTransactions(true);
		axios.get(`http://localhost:8080/Cheddar/Budgets/Budget/Transactions/${props.userID}/${props.curBudget.name}`)
			.then(function (response) {
				// handle success
				setTransactions(response.data);
				categorizeData(response.data);
			})
			.catch((error) => {
				console.log("Transaction call did not work");
			});
	};

	useEffect(
		() => {
			//console.log("fetching transactions");
			getTransactions();
		},
		[props]
	);

	return (
		<div>
			{loadingTransactions
				?
				<p>Loading...</p>
				:
				<div> {/** Loop thru budget categories prop and compare the amount with the objects  */}
					{categoryObjs.map((item, index) =>
						<div className="padTop" key={index}>
							<p>{item.name}: ${item.spent} / ${item.allocated}</p>
							<Progress multi className="barShadow">
								{item.percentUsed > 100
									?
									<Progress className="leftText" bar animated color="danger" value={item.percentUsed}>{(item.percentUsed).toFixed(2)}%</Progress>
									: item.percentUsed >= 75
										?
										<Progress className="leftText" bar animated color="warning" value={item.percentUsed} >{(item.percentUsed).toFixed(2)}%</Progress>
										:
										<Progress className="leftText" bar animated color="success" value={item.percentUsed} >{(item.percentUsed).toFixed(2)}%</Progress>
								}

							</Progress>
						</div>
					)}

					<Row className="heavyPadTop">
						<Col sm={3} />
						<Col sm={6}>
							<p className={"addSpace"}>Enter New Transaction</p>
						</Col>
						<Col sm={3} />
					</Row>
					<div >
						<Form className="textLeft">
							<Row>
								<Col sm={3}>
									<FormGroup>
										<Row>
											<Label for="category">Category</Label>
										</Row>
										<Row>
											<Dropdown id="category" isOpen={drop} toggle={() => setDrop(!drop)}>
												<DropdownToggle caret>
													{transactionCate}
												</DropdownToggle>
												<DropdownMenu>
													{props.curBudget.budgetCategories.map((item, index) =>
														<DropdownItem onClick={() => setTransactionCate(item.name)}>{item.name}</DropdownItem>
													)}
												</DropdownMenu>
											</Dropdown>
										</Row>
									</FormGroup>
								</Col>
								<Col sm={3}>
									<FormGroup>
										<Label for="name">Name</Label>
										<Input id="name">Name</Input>
									</FormGroup>
								</Col>
								<Col sm={3}>
									<FormGroup>
										<Label for="amount">Amount</Label>
										<Input id="amount">Amount</Input>
									</FormGroup>
								</Col>
								<Col sm={2} className="buttonFix">
									<Button color="primary">Submit</Button>
								</Col>
							</Row>
						</Form>



					</div>


				</div>
			}
		</div>
	);
}

export default RealSpending;