import mongoose from 'mongoose';

import {userModel} from '../utilities/mongooseModels';

export function getRetirementData(uid){
    const returnClause = {
        '_id': 0, // exclude _id
        'investments': 1
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