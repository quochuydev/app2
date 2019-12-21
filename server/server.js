const express = require('express')
const app = express();
const port = process.env.PORT || 5000;

console.log(process.env.NODE_ENV)

app.get('/', (req, res) => {
	res.json({ test: false })
})

app.listen(port, () => {
	console.log('running port: ' + port)
})