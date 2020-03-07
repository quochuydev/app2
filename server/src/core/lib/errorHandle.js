let errorHandle = (err, req, res, next) => {
  console.log(123)
  if (!err) { return next() }
  console.log(123)
  res.status(500).json({ error: true });
}

module.exports = { errorHandle }