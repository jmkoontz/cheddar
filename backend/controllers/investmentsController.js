import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getAllInvestments, addTrackedCompanies, addInvestment, editInvestment, deleteInvestment} from '../models/investmentsDAO';

export default (app) => {
  app.get('/Cheddar/Investments', async (req, res) => {
    let data = {};
    //console.log(req.query);
    try {
      data = await getAllInvestments(req.query.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }    
    buildResponse(res, data);
  });
  
  app.post('/Cheddar/Investments', async (req, res) => {
    let data = {};
    //console.log(req.query);
    try {
      data = await addInvestment(req.body.investments,req.body.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }    
    buildResponse(res, data);
  });
  
  app.post('/Cheddar/Investments/TrackedCompanies', async (req,res) => {
    let data = {};
    try {
      data = await addTrackedCompanies(req.body.updatedCompanies,req.body.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }
    buildResponse(res,data);
  });
}
