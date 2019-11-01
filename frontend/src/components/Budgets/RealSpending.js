import React, { useState, useEffect } from "react";
import { Progress } from 'reactstrap';
import axios from 'axios';
import TransactionForm from './TransactionForm';
import '../../css/Budgets.css';
import { destroyObjectProperties } from "highcharts";



function RealSpending(props) {

	const [date, setDate] = useState(new Date());
	const [totalDays, setTotalDays] = useState(31);

	useEffect(
		() => {

			let total;
			if(props.curBudget.timeFrame == "monthly") {
				total = 31;
			}
			else if(props.curBudget.timeFrame == "biweekly") {
				total = 14;
			}
			else if(props.curBudget.timeFrame == "weekly") {
				total = 7;
			}
			setTotalDays(total);

		},
		[props]
	);

	return (
		<div>
			{!props.spendingByCategory
				?
				<p>Loading...</p>
				:
				<div> {/** Loop thru budget categories prop and compare the amount with the objects  */}
					{props.spendingByCategory && props.spendingByCategory.length && props.spendingByCategory.map((item, index) =>
						<div className="padTop" key={index}>
							<p>{item.name}: ${item.spent.toFixed(2)} / ${item.allocated.toFixed(2)}</p>
							<Progress multi className="barShadow">
								{item.percentUsed > 100
									?
									<Progress className="leftText" bar animated color="danger" value={item.percentUsed}>{(item.percentUsed).toFixed(2)}%</Progress>
									: props.budgetPeriodIndex === -1 && item.percentUsed >= 50 && (((totalDays - props.daysRemaining)/totalDays)*100) < item.percentUsed
										?
										<Progress className="leftText" bar animated color="warning" value={item.percentUsed} >{(item.percentUsed).toFixed(2)}%  {" Warning: Current spending set to exceed limit before end of time"} </Progress>
										: item.percentUsed >= 75
											?
											<Progress className="leftText" bar animated color="warning" value={item.percentUsed} >{(item.percentUsed).toFixed(2)}%</Progress>
											:
											<Progress className="leftText" bar animated color="success" value={item.percentUsed} >{(item.percentUsed).toFixed(2)}%</Progress>
								}

							</Progress>
						</div>
					)}
					{props.budgetPeriodIndex === -1
						?
						<TransactionForm {...props} currentStartDate={props.currentStartDate} />
						:
						null
					}
				</div>
			}
		</div>
	);
}

export default RealSpending;
