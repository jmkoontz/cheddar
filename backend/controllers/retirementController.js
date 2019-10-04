import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getRetirementData, addContribution} from '../models/retirementDAO';


export default (app) => {
    app.get('/Cheddar/Retirement', async (req, res) => {
      let data = {};
      console.log(req.query);
      try {
        data = await getRetirementData(req.query.uid);
      } catch (err) {
        data = {error: parseError(err)};
      }    
      buildResponse(res, data);
    });

    app.post('/Cheddar/Retirement/Contribution', async (req, res) => {
      let data = {};
      //console.log(req.query);
      console.log(req.data);
      try {
        data = await addContribution(req.body.history,req.body.previousTotal,req.body.uid);
      } catch (err) {
        data = {error: parseError(err)};
      }    
      buildResponse(res, data);
    });
}