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

	/**
	 * Server call to set a new favorite budget
	 */
	const setNewFavorite = (name) => {
		setFavorite(true);
	}

	const [transactions, setTransactions] = useState();
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
        // setAllTransactions(response.data);
        // setLoadingTransactions(false);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(
		() => {
			getTransactions();
			console.log('budgetTabs: getting transactions')
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
								<NavItem >
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
									<Pie
										data={item.budgetCategories}
										width={500}
										height={500}
										innerRadius={150}
										outerRadius={250}
									/>
								</div>

								<Button className="padTop padRight" color="danger" onClick={() => {setDeleteModal(true)}}>Delete</Button>

								<Button className="padTop" color="primary" onClick={props.openEditModal}>Edit</Button>



							</Col>
							<Col sm={5}>
								<span className="label" id="title">Spending Progress</span>
								<div className="addSpace">

									{index === parseInt(props.tab) && props.curBudget
										?
										<RealSpending {...props} transactions={transactions} getTransactions={getTransactions}/>
										:
										<p>Loading...</p>
									}
								</div>
							</Col>
							<Col sm={1} />
						</Row>
						<Row className="padTop" />
						<Row>
							<Col sm={1}/>
							<Col sm={10}>
								{index === parseInt(props.tab) && props.curBudget && transactions
									?
									<TransactionTable transactions={transactions} />
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
