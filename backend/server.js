const  express = require('express')
const app = express()
const port = process.env.PORT || 5000;

app.get('/', (req,res) =>{
	res.send(123)
})

app.listen(port, () => {
	console.log('running port: '+port)
})