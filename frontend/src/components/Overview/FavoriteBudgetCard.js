import React, { Component } from 'react';
import {Card, CardTitle, CardBody, Label} from 'reactstrap';
import axios from "axios";
import buildUrl from "../../actions/connect";
import Pie from "../Budgets/Pie";

class FavoriteBudgetCard extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,
      userID: sessionStorage.getItem('user'),
      favoriteBudget: null,
      transactions: null,
      spendingByCategory: [],
    };

    this.getFavoriteBudget();
  }

  getFavoriteBudget = () => {
    let self = this;
    axios.get(buildUrl(`/Cheddar/Budgets/${self.state.userID}`))
      .then(function (response) {
        // handle success
        let flag = false;
        for (let x = 0; x < response.data.length; x++) {
          if (response.data[x].favorite === true) {
            flag = true;
            self.setFavoriteBudget(response.data[x]);
            break;
          }
        }

        if (!flag) {
          self.setFavoriteBudget(response.data[0]);
        }

        self.getTransactions();

      })
      .catch((error) => {
        if (error.response && error.response.data) {
          console.log(error.response.data.error.message);
        }
      });
  };

  setFavoriteBudget = (budget) => {
    this.setState({
      favoriteBudget: budget,
    });
    //console.log(budget);
  };

  getTransactions = () => {
    let self = this;
    axios.get(buildUrl(`/Cheddar/Budgets/Budget/Transactions/${self.state.userID}/${self.state.favoriteBudget.name}`))
      .then((response) => {
        // format the date for display
        self.setState({
          transactions: response.data,
        });
        self.constructPieData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  constructPieData = () => {
    let data = [];
    let categories = this.state.favoriteBudget.budgetCategories;

    for (let x = 0; x < categories.length; x++) {
      // Generate a new category object
      let newCateObj = {
        name: categories[x].name,
        allocated: categories[x].amount,
        spent: 0,
        percentUsed: 0,
        transactions: []
      };

      data = [...data, newCateObj];
    }

    let tmpMoneyRemaining = this.state.favoriteBudget.income;
    let transactions = this.state.transactions;

    for (let x = 0; x < transactions.length; x++) {
      for (let y = 0; y < data.length; y++) {
        if (transactions[x].category === data[y].name) {
          let item = data[y];
          item.spent += transactions[x].amount;
          item.percentUsed = (item.spent / item.allocated) * 100;
          item.transactions = [...item.transactions, transactions[x]];
          tmpMoneyRemaining -= transactions[x].amount;
        }
      }
    }

    this.setState({
      spendingByCategory: data,
      loading: false,
    });

  };

  render(){

    if(!this.state.loading) {

      return(
        <Card body>
          <CardTitle>
            Favorite Budget
          </CardTitle>
          <CardBody>
            <Label>{this.state.favoriteBudget.name}</Label>
            <Pie data={this.state.favoriteBudget.budgetCategories} spendingByCategory={this.state.spendingByCategory}
                 setTableMode={"all"} setTableCategory={''} />
          </CardBody>
        </Card>
      );


    } else {
      return(
        <div>
          <p>Loading...</p>
        </div>
      )
    }
  }

}

export default FavoriteBudgetCard;