import mongoose from 'mongoose';

import {userModel, investmentModel, allInvestmentsModel} from '../utilities/mongooseModels';

export function getAllInvestments(uid){
    const returnClause = {
        '_id': 0, // exclude _id
        'investments': 1
    };
    
    return userModel.findOne({_id: uid}, returnClause)
    .then((user) => {
        console.log(user['investments']);
        if (user)
        return Promise.resolve(user['investments']);
        else
        return Promise.reject('UserError: User not found');
    })
    .catch((err) => {
        return Promise.reject(err);
    });
}