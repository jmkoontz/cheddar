import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';
import {getAllInvestments} from '../models/investmentsDAO';

export default (app) => {
  app.get('/Cheddar/Investments', async (req, res) => {
    let data = {};
    console.log("Investments Route");
    //console.log(req.query);
    try {
      data = await getAllInvestments(req.query.uid);
    } catch (err) {
      data = {error: parseError(err)};
    }    
    buildResponse(res, data);
  });
}