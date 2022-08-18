const express = require('express')


const app = express()
const port = 4000

const customer = require('./routes/customer')
const item = require('./routes/item')
const orders = require('./routes/Orders')

app.use(express.json())

app.use('/customer', customer)
app.use('/item', item)
app.use('/orders', orders)


// app.get('/', (req, res) => {
//     console.log('get request comming!');
//     res.send('get req came for / route')
// })

app.listen(port, () => {
    console.log(`app starting on ${port}`);
})