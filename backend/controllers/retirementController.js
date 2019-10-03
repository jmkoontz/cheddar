import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';


export default (app) => {
    app.get('/Cheddar/Retirement', async (req, res) => {
      let data = {};
      //console.log(req.query);
   
      buildResponse(res, data);
    });
}