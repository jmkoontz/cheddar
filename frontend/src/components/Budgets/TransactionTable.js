import React, { useState, useEffect } from "react";
import { Table } from 'reactstrap';
import axios from 'axios';

import '../../css/Budgets.css';

function TransactionTable(props) {
  const [transactions, setTransactions] = useState(); // All the transactions in an array
  const [loadingTransactions, setLoadingTransactions] = useState(true); // State to check if transactions are received yet
  const [sortKey, setSortKey] = useState('date');
  const [sortNameAsc, setSortNameAsc] = useState(false);
  const [sortAmountAsc, setSortAmountAsc] = useState(false);
  const [sortDateAsc, setSortDateAsc] = useState(false);
  const [sortCategoryAsc, setSortCategoryAsc] = useState(false);


	useEffect(
		() => {
      getTransactions();
		},
		[props.curBudget]
	);

  const getTransactions = () => {
		axios.get(`http://localhost:8080/Cheddar/Budgets/Budget/Transactions/${props.userID}/${props.curBudget.name}`)
			.then((response) => {
        for (let i in response.data) {
          let date = new Date(response.data[i].date);
          response.data[i].shortDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        }

				setTransactions(response.data);
        setLoadingTransactions(false);
			})
			.catch((error) => {
				console.log(error);
			});
	};

  const sortTransactions = (key) => {
    let sortAsc = '';
    if (key === 'name') {
      setSortNameAsc(!sortNameAsc);
      sortAsc = sortNameAsc;
    } else if (key === 'amount') {
      setSortAmountAsc(!sortAmountAsc);
      sortAsc = sortAmountAsc;
    } else if (key === 'date') {
      setSortDateAsc(!sortDateAsc);
      sortAsc = sortDateAsc;
    } else if (key === 'category') {
      setSortCategoryAsc(!sortCategoryAsc);
      sortAsc = sortCategoryAsc;
    }

    setSortKey(key);

    let tmp = JSON.parse(JSON.stringify(transactions));
    tmp.sort((a, b) => {
      if (a[key] < b[key])
         return sortAsc ? -1 : 1;
      else if (a[key] > b[key])
         return sortAsc ? 1 : -1;
      else
         return 0;
    });

    setTransactions(tmp);
  }

	return (
    <div>
      <Table striped size="sm">
        <thead>
          <tr align="left">
            <th className="poundSymbol">#</th>
            <th className="tableHeader" onClick={() => sortTransactions('name')}>Name</th>
            <th className="tableHeader" onClick={() => sortTransactions('amount')}>Amount</th>
            <th className="tableHeader" onClick={() => sortTransactions('date')}>Date</th>
            <th className="tableHeader" onClick={() => sortTransactions('category')}>Category</th>
          </tr>
        </thead>
        <tbody>
          {!loadingTransactions && transactions.map((key, index) => {
            return <tr key={transactions[index]._id} align="left">
              <td scope="row" align="center">{index + 1}</td>
              <td>{transactions[index].name}</td>
              <td>${transactions[index].amount}</td>
              <td>{transactions[index].shortDate}</td>
              <td>{transactions[index].category}</td>
            </tr>
          })}
        </tbody>
      </Table>
    </div>
	);
}

export default TransactionTable;
