import React, { useEffect, useState } from "react";
import { Button } from 'reactstrap';
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RealSpending from './RealSpending';
import Pie from "./Pie";
import TransactionTable from './TransactionTable';
import axios from 'axios';
import '../../css/Budgets.css';

function BudgetTabs(props) {

	const [deleteModal, setDeleteModal] = useState(false);	// Opens the modal to confirm if a user wants to delete a budget
	const [favorite, setFavorite] = useState(false);	// Sets the user's favorite budget
	const [transactions, setTransactions] = useState();
	const [spendingByCategory, setSpendingByCategory] = useState();	// categories and spending

	const [tableMode, setTableMode] = useState('all');  // display all transactions or just one category
  const [tableCategory, setTableCategory] = useState(''); // category to display transactions for

	/**
	 * Server call to set a new favorite budget
	 */
	const setNewFavorite = (name) => {
		setFavorite(true);
	}

	// get all transactions for a budget
  const getTransactions = () => {
		axios.get(`http://localhost:8080/Cheddar/Budgets/Budget/Transactions/${props.userID}/${props.curBudget.name}`)
			.then((response) => {
        // format the date for display
        for (let i in response.data) {
          let date = new Date(response.data[i].date);
          response.data[i].shortDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        }

				setTransactions(response.data);
				categorizeData(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

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

	useEffect(
		() => {
			getTransactions();
		},
		[props]
	);

	return (
		<div>
			<Row >
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
						<Row>
							<Col sm={1} />
							<Col sm={5}>
								<span className="label" id="title">{item.name}</span>
								<div className="padTop">
									{index === parseInt(props.tab) && props.curBudget && spendingByCategory
										?
										<Pie data={item.budgetCategories} transactions={transactions}
												spendingByCategory={spendingByCategory} setTableMode={setTableMode}
												setTableCategory={setTableCategory} />
										:
										<p>Loading...</p>
									}
								</div>
								<Button className="padTop padRight" color="danger" onClick={() => {setDeleteModal(true)}}>Delete</Button>
								<Button className="padTop" color="primary" onClick={props.openEditModal}>Edit</Button>
							</Col>
							<Col sm={5}>
								<span className="label" id="title">Spending Progress</span>
								<div className="addSpace">
									{index === parseInt(props.tab) && props.curBudget && transactions
										?
										<RealSpending {...props} transactions={transactions} getTransactions={getTransactions} spendingByCategory={spendingByCategory}/>
										:
										<p>Loading...</p>
									}
								</div>
							</Col>
							<Col sm={1} />
						</Row>
						<Row>
							<Col sm={1}/>
							<Col sm={10}>
								{index === parseInt(props.tab) && props.curBudget && transactions
									?
									<TransactionTable transactions={transactions} tableMode={tableMode}
									 	tableCategory={tableCategory} />
									:
									<p>Loading...</p>
								}
							</Col>
						</Row>
						<Modal isOpen={deleteModal} toggle={() => { setDeleteModal(!deleteModal) }}>
							<ModalHeader toggle={() => { setDeleteModal(!deleteModal) }}>Delete Budget</ModalHeader>
							<ModalBody>
								Are you sure you want to delete the budget '{item.name}'?
        			</ModalBody>
							<ModalFooter>
								<Button color="danger" onClick={() => {props.deleteBudget(item.name)}}>Delete Budget</Button>
								<Button color="secondary" onClick={() => { setDeleteModal(!deleteModal) }}>Cancel</Button>
							</ModalFooter>
						</Modal>
					</TabPane>
				)}
			</TabContent>
		</div>
	);
}

export default BudgetTabs;
