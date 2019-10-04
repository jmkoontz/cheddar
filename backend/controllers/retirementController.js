import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';


export default (app) => {
    app.get('/Cheddar/Retirement', async (req, res) => {
      let data = {};
      //console.log(req.query);
      try {
        data = await getRetirementData(req.query.uid);
      } catch (err) {
        data = {error: parseError(err)};
      }    
      buildResponse(res, data);
    });
}