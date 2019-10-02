import bodyParser from 'body-parser';

import {parseError, buildResponse} from '../utilities/controllerFunctions';

export default (app) => {
  app.get('/Cheddar/Investments/', async (req, res) => {
    let data = {};

    buildResponse(res, data);
  });
}