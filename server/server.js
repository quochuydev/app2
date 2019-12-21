const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

console.log('NODE_ENV: ', process.env.NODE_ENV)
console.log('PORT: ',process.env.PORT)

app.get('/', (req, res) => {
	res.json({ test: false })
})

app.get('/api/customers', (req, res) => {
	res.json({ customers: 'test customers' })
})

app.listen(port, () => {
	console.log('running port: ' + port)
})