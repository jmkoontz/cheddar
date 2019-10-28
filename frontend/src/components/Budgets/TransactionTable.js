import React, { useState, useEffect } from 'react';
import { Table, Collapse, Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import '../../css/Budgets.css';

function TransactionTable(props) {
  const [transactions, setTransactions] = useState(); // array of transactions to display
  const [allTransactions, setAllTransactions] = useState(); // array of all transactions
  const [sortKey, setSortKey] = useState('date'); // field the table is sorted by
  const [sortNameAsc, setSortNameAsc] = useState(false);  // if name should be in ascending order
  const [sortAmountAsc, setSortAmountAsc] = useState(false);  // if amount should be in ascending order
  const [sortDateAsc, setSortDateAsc] = useState(false);  // if date should be in ascending order
  const [sortCategoryAsc, setSortCategoryAsc] = useState(false);  // if category should be in ascending order

  const [collapse, setCollapse] = useState(false);  // controls whether table is visible
  const [mode, setMode] = useState();  // display all transactions or just one category

	useEffect(
		() => {
      if (props.transactions) {
        setTransactions(props.transactions);
        setAllTransactions(props.transactions);
      }
		},
		[props]
	);

  useEffect(
    () => {
      if (props.tableMode === 'all' || props.tableCategory !== '')
        switchMode(props.tableMode, props.tableCategory);
    },
    [props.tableMode, props.tableCategory]
  );

  // toggle visibility of table
  const toggle = () => {
    setCollapse(!collapse);
  };

  // switch between displaying all transactions and transactions from one category
  const switchMode = (newMode, category) => {
    if (newMode === mode)
      return;

    // reset any sorting
    setSortKey('date');
    setSortNameAsc(false);
    setSortAmountAsc(false);
    setSortDateAsc(false);
    setSortCategoryAsc(false);

    if (newMode === 'category') {
      const categoryTransactions = allTransactions.filter((t) => t.category === category);
      setMode('category');
      setTransactions(categoryTransactions);
    } else if (newMode === 'all') {
      setMode('all');
      setTransactions(allTransactions);
    }
  };

  // sort the transactions table by a particular field
  const sortTransactions = (key) => {
    let sortAsc = '';
    if (key === 'name') {
      sortAsc = !sortNameAsc;
      setSortNameAsc(!sortNameAsc);
    } else if (key === 'amount') {
      sortAsc = !sortAmountAsc;
      setSortAmountAsc(!sortAmountAsc);
    } else if (key === 'date') {
      sortAsc = !sortDateAsc;
      setSortDateAsc(!sortDateAsc);
    } else if (key === 'category') {
      sortAsc = !sortCategoryAsc;
      setSortCategoryAsc(!sortCategoryAsc);
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
  };

	return (
    <div>
      <Row>
        <Col sm="3">
          <Button onClick={toggle} className="tableButton">
            {collapse ? 'Hide Transactions' : 'View Transactions'}
          </Button>
        </Col>
        <Col sm="9"/>
      </Row>
      <Collapse isOpen={collapse}>
        <Table striped size="sm">
          <thead>
            <tr align="left">
              <th className="poundSymbol">#</th>
              <th className="tableHeader" onClick={() => sortTransactions('name')}>Name{' '}
                <span hidden={sortKey !== 'name' || !sortNameAsc}><FontAwesomeIcon icon={faCaretUp}/></span>
                <span hidden={sortKey !== 'name' || sortNameAsc}><FontAwesomeIcon icon={faCaretDown}/></span>
              </th>
              <th className="tableHeader" onClick={() => sortTransactions('amount')}>Amount{' '}
                <span hidden={sortKey !== 'amount' || !sortAmountAsc}><FontAwesomeIcon icon={faCaretUp}/></span>
                <span hidden={sortKey !== 'amount' || sortAmountAsc}><FontAwesomeIcon icon={faCaretDown}/></span>
              </th>
              <th className="tableHeader" onClick={() => sortTransactions('date')}>Date{' '}
                <span hidden={sortKey !== 'date' || !sortDateAsc}><FontAwesomeIcon icon={faCaretUp}/></span>
                <span hidden={sortKey !== 'date' || sortDateAsc}><FontAwesomeIcon icon={faCaretDown}/></span>
              </th>
              <th className="tableHeader" onClick={() => sortTransactions('category')}>Category{' '}
                <span hidden={sortKey !== 'category' || !sortCategoryAsc}><FontAwesomeIcon icon={faCaretUp}/></span>
                <span hidden={sortKey !== 'category' || sortCategoryAsc}><FontAwesomeIcon icon={faCaretDown}/></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.map((key, index) => {
              return <tr key={transactions[index]._id} align="left">
                <td scope="row" align="center">{index + 1}</td>
                <td>{transactions[index].name}</td>
                <td>${transactions[index].amount.toFixed(2)}</td>
                <td>{transactions[index].shortDate}</td>
                <td>{transactions[index].category}</td>
              </tr>
            })}
          </tbody>
        </Table>
      </Collapse>
    </div>
	);
}

export default TransactionTable;
