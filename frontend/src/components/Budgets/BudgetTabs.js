import React, { useEffect, useState } from "react";
import { Button } from 'reactstrap';
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import RealSpending from './RealSpending';
import Pie from "./Pie";
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

	useEffect(
		() => {

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
										<RealSpending {...props} />
										:
										<p>Loading...</p>
									}
								</div>
							</Col>
							<Col sm={1} />
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