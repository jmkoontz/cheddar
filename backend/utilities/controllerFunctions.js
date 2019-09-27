export function parseError(err) {
  console.log(err);
  
  let error = {
    status: 0,
    message: ''
  };

  if (typeof err === 'string' && err.includes('UserError:')) {
    error.status = 400;
    error.message = err.substring('UserError:'.length + 1);
  } else {
    error.status = 500;
    error.message = err;
  }

  return error;
}

export function buildResponse(res, data) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (data.error)
    res.status(data.error.status).json(data);
  else
    res.status(200).json(data);
}
