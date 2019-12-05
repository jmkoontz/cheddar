import React, { useState, useEffect } from 'react';
import { Table, Collapse, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import axios from 'axios';
import '../../css/Budgets.css';
import buildUrl from "../../actions/connect";

function TransactionTable(props) {
  const [transactions, setTransactions] = useState(); // array of transactions to display
  const [sortKey, setSortKey] = useState('date'); // field the table is sorted by
  const [sortNameAsc, setSortNameAsc] = useState(false);  // if name should be in ascending order
  const [sortAmountAsc, setSortAmountAsc] = useState(false);  // if amount should be in ascending order
  const [sortDateAsc, setSortDateAsc] = useState(false);  // if date should be in ascending order
  const [sortCategoryAsc, setSortCategoryAsc] = useState(false);  // if category should be in ascending order

  const [collapse, setCollapse] = useState(false);  // controls whether table is visible
  const [mode, setMode] = useState();  // display all transactions or just one category

  const [deleteMode, setDeleteMode] = useState(); // Tells the modal to load deletion info
  const [editMode, setEditMode] = useState(); // Tells the modal to load edit info
  const [selectedTransaction, setSelectedTransaction] = useState() // Transaction to be changed
  const [modal, setModal] = useState() // Sets modal to open or closed
  const [transactionName, setTransactionName] = useState(""); // The edited name of a transaction
  const [transactionAmount, setTransactionAmount] = useState(""); // The edited amount of a transaction
  const [transactionDate, setTransactionDate] = useState(); // The edited date to send
  const [earliestDay, setEarliestDay] = useState(); // Day to show whether or not a transaction can be edited or deleted


  let allTransactions = []; // array of all transactions

  useEffect(
    () => {
      if (props.transactions) {
        setTransactions(props.transactions);
        allTransactions = props.transactions;
      }

      if (props.curBudget.timeFrame) {
        let frame = props.curBudget.timeFrame;
        let nextUpdate = new Date(props.curBudget.nextUpdate);
        let initialDay;
        if (frame === "monthly") {
          initialDay = new Date(nextUpdate - 2629800000);
        } else if (frame === "biweekly") {
          initialDay = new Date(nextUpdate - 1314900000);
        } else if (frame === "weekly") {
          initialDay = new Date(nextUpdate - 657450000);
        }

        setEarliestDay(initialDay);
      }
    },
    [props]
  );

  useEffect(
    () => {
      if (props.transactions) {
        setTransactions(props.transactions);
        allTransactions = props.transactions;

        if (props.tableMode === 'all' || props.tableCategory !== '')
          switchMode(props.tableMode, props.tableCategory);
      }
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

  // edit button handler
  const editHandler = (index) => {
    setDeleteMode(false);
    // Prepare the state for editing a transaction
    setSelectedTransaction(transactions[index]);
    setTransactionName(transactions[index].name);
    setTransactionAmount(transactions[index].amount);
    setTransactionDate(new Date(transactions[index].date));
    setEditMode(!editMode);
    setModal(!modal);
  }

  // deletion button handler
  const deleteHandler = (index) => {
    setEditMode(false);
    setSelectedTransaction(transactions[index]);
    setDeleteMode(!deleteMode);
    setModal(!modal);
  }

  // helper to close modal
  const closeHandler = () => {
    setModal(!modal);
    setSelectedTransaction();
    setEditMode(false);
    setDeleteMode(false);
  }


  // Helper method to handle user changes to name
  const handleNameChange = (event) => {
    setTransactionName(event.target.value);
  }

  // Helper method to handle user changes to amount
  const handleAmtChange = (event) => {
    setTransactionAmount(event.target.value);
  }

  // server call to edit a transaction
  const editTransaction = () => {
    let tmpObj = {
      name: transactionName,
      amount: transactionAmount,
      date: transactionDate
    }

    axios.put(buildUrl(`/Cheddar/Transactions/${props.userID}/${selectedTransaction._id}`),
      tmpObj
    )
      .then((response) => {
        // Handle success
        closeHandler();
        props.getTransactions();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // server call to delete a transaction
  const deleteTransaction = () => {
    axios.delete(buildUrl(`/Cheddar/Transactions/${props.userID}/${selectedTransaction._id}`))
      .then((response) => {
        // Handle success
        closeHandler();
        props.getTransactions();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <Row>
        <Col sm="3" id={"transaction-table"}>
          <Button id={"Popover6" + props.itemName} onClick={toggle} className="tableButton">
            {collapse ? 'Hide Transactions' : 'View Transactions'}
          </Button>
        </Col>
        <Col sm="9" />
      </Row>
      <Collapse isOpen={collapse}>
        <Table striped size="sm">
          <thead>
            <tr align="left">
              <th className="poundSymbol">#</th>
              <th className="tableHeader" onClick={() => sortTransactions('name')}>Name{' '}
                <span hidden={sortKey !== 'name' || !sortNameAsc}><FontAwesomeIcon icon={faCaretUp} /></span>
                <span hidden={sortKey !== 'name' || sortNameAsc}><FontAwesomeIcon icon={faCaretDown} /></span>
              </th>
              <th className="tableHeader" onClick={() => sortTransactions('amount')}>Amount{' '}
                <span hidden={sortKey !== 'amount' || !sortAmountAsc}><FontAwesomeIcon icon={faCaretUp} /></span>
                <span hidden={sortKey !== 'amount' || sortAmountAsc}><FontAwesomeIcon icon={faCaretDown} /></span>
              </th>
              <th className="tableHeader" onClick={() => sortTransactions('date')}>Date{' '}
                <span hidden={sortKey !== 'date' || !sortDateAsc}><FontAwesomeIcon icon={faCaretUp} /></span>
                <span hidden={sortKey !== 'date' || sortDateAsc}><FontAwesomeIcon icon={faCaretDown} /></span>
              </th>
              <th className="tableHeader" onClick={() => sortTransactions('category')}>Category{' '}
                <span hidden={sortKey !== 'category' || !sortCategoryAsc}><FontAwesomeIcon icon={faCaretUp} /></span>
                <span hidden={sortKey !== 'category' || sortCategoryAsc}><FontAwesomeIcon icon={faCaretDown} /></span>
              </th>
              <th hidden={props.budgetPeriodIndex >= 0 || props.isDisabled} className="tableHeader" >Edit{' '}</th>
              <th hidden={props.budgetPeriodIndex >= 0 || props.isDisabled} className="tableHeader" >Delete{' '}</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 && transactions.map((key, index) => {
              return <tr key={transactions[index]._id} align="left">
                <td scope="row" align="center">{index + 1}</td>
                <td>{transactions[index].name}</td>
                <td>${transactions[index].amount.toFixed(2)}</td>
                <td>{transactions[index].shortDate}</td>
                <td>{transactions[index].category}</td>

                {props.parent === "budgets"
                  ?
                  <td hidden={props.budgetPeriodIndex >= 0 || props.isDisabled}> <Button color="primary" onClick={() => editHandler(index)}>Edit</Button></td>
                  : props.parent === "transactions" && earliestDay <= new Date(transactions[index].date)
                    ?
                    <td> <Button color="primary" onClick={() => editHandler(index)}>Edit</Button></td>
                    :
                    <td />
                }

                {props.parent === "budgets"
                  ?
                  <td hidden={props.budgetPeriodIndex >= 0 || props.isDisabled}> <Button color="danger" onClick={() => deleteHandler(index)}>Delete</Button></td>
                  : props.parent === "transactions" && earliestDay <= new Date(transactions[index].date)
                    ?
                    <td> <Button color="danger" onClick={() => deleteHandler(index)}>Delete</Button></td>
                    :
                    <td />
                }


              </tr>
            }
            )}
          </tbody>
        </Table>
      </Collapse >
      <Modal isOpen={modal} toggle={closeHandler}>
        {editMode
          ?
          <div>
            <ModalHeader toggle={closeHandler}>Edit Transaction</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name" >Transaction Name</Label>
                <Input type="text" value={transactionName} id="name" onChange={handleNameChange} />
              </FormGroup>
              <FormGroup>
                <Label for="amount">Amount</Label>
                <Input type="number" value={transactionAmount} id="amount" onChange={handleAmtChange} />
              </FormGroup>
              <FormGroup>
                <Label for="date">Date</Label>
                <Col sm={12} className="removePadding">
                  <DatePicker
                    id="date"
                    selected={transactionDate}
                    onChange={d => setTransactionDate(new Date(d))}
                    maxDate={new Date()}
                    required={true}
                  />
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={editTransaction}>Submit Changes</Button>{' '}
              <Button color="secondary" onClick={closeHandler}>Cancel</Button>
            </ModalFooter>
          </div>
          : deleteMode
            ?
            <div>
              <ModalHeader toggle={closeHandler}>Delete Transaction</ModalHeader>
              <ModalBody>
                Are you sure you want to delete this transaction?
            </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={deleteTransaction}>Delete Transaction</Button>{' '}
                <Button color="secondary" onClick={closeHandler}>Cancel</Button>
              </ModalFooter>
            </div>
            :
            <div />
        }
      </Modal>
    </div >
  );
}

export default TransactionTable;
