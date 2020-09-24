function errorHandle(error, req, res, next) {
  if (!error) {
    return next();
  }
  console.error(error);
  let status = error.statusCode || 400;
  let result = { message: error.message || 'Server Error!', error: JSON.stringify(error) };
  result.error = result.error || true;
  res.status(status).send(result);
}

module.exports = { errorHandle }