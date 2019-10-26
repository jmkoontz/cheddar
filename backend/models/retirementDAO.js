import mongoose from 'mongoose';

import {userModel} from '../utilities/mongooseModels';

export function getRetirementData(uid){
    const returnClause = {
        '_id': 0, // exclude _id
    };
    
    return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
        console.log(user['retirement']);
        if (user)
        return Promise.resolve(user['retirement']);
        else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
        return Promise.reject(err);
    });
}

export function addContribution(history,prevTotal,uid){
    var contribution = history[history.length-1];
    let updateClause = {$set: {'retirement.total': parseInt(prevTotal)+parseInt(contribution.amount), 'retirement.history':history}};
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