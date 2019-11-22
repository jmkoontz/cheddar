import mongoose from 'mongoose';

import {userModel, investmentModel, allInvestmentsModel} from '../utilities/mongooseModels';

export function getAllInvestments(uid){
    const returnClause = {
        '_id': 0, // exclude _id
        'investments': 1
    };
    
    return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
        //console.log(user['investments']);
        if (user)
        return Promise.resolve(user['investments']);
        else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
        return Promise.reject(err);
    });
}

export function addTrackedCompanies(companies,uid){
    let updateClause = {$set: {'investments.trackedCompanies':companies}};
    return userModel.findOneAndUpdate(
        {_id: uid},
        updateClause,
        {'new': true})
        .then((updatedUser) => {
          if (updatedUser == null)
            return Promise.reject('UserError: User not found');
    
          return Promise.resolve(updatedUser);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
}

export function addInvestment(investments,uid){

    let i = 0;
    var total =0;
    for(i=0;i<investments.length;i++){
        total += (investments[i].currentShareValue*investments[i].shares);
    }

    let updateClause = {$set: {'investments.investments':investments, 'investments.totalInvestment':total}};
    return userModel.findOneAndUpdate(
        {_id: uid},
        updateClause,
        {'new': true})
        .then((updatedUser) => {
          if (updatedUser == null)
            return Promise.reject('UserError: User not found');
    
          return Promise.resolve(updatedUser);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
}

export function editInvestment(investment,uid){
  let updateClause = {$set: {'investments.investments':investments}};
  return userModel.findOneAndUpdate(
      {_id: uid},
      updateClause)
      .then((updatedUser) => {
        if (updatedUser == null)
          return Promise.reject('UserError: User not found');
  
        return Promise.resolve(updatedUser);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
}

export function deleteInvestment(investment){

}
