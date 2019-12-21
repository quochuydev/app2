const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

console.log('NODE_ENV: ', process.env.NODE_ENV)
console.log('PORT: ', process.env.PORT)

if (process.env.NODE_ENV == 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.get('/', (req, res) => {
	res.json({ test: false })
})

app.get('/api/customers', (req, res) => {
	res.json({ customers: 'test customers' })
})

app.listen(port, () => {
	console.log('running port: ' + port)
})