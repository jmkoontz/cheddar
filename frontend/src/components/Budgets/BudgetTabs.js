import React, { useEffect } from "react";
import { Button } from 'reactstrap';
import { Row, Col, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import RealSpending from './RealSpending';
import Pie from "./Pie";
import '../../css/Budgets.css';

function BudgetTabs(props) {

	useEffect(
		() => {

		},
		[props]
	);

	return (
		<div>
			<Row className="padTop">
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
					</TabPane>
				)}
			</TabContent>

		</div>
	);
}

export default BudgetTabs;