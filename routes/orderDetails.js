const express = require('express')
const mysql = require('mysql')
const db = require('../configs/db.configs')
const router = express.Router()

const connection = mysql.createConnection(db.database)

connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Connected to the MYSQL server');
        var userTableQuery = "CREATE TABLE IF NOT EXISTS orderDetails (orderId VARCHAR(255) PRIMARY KEY, itemCode VARCHAR(255), orderQty int(10), price double)"
        connection.query(userTableQuery, function(err,result){
            if(err) throw err;
            console.log(result);
            if(result.warningCount === 0){
                console.log('Orders table created');
            }
        })
    }
})


router.get('/', (req, res) => {
    var query = "SELECT * FROM orderDetails";
    connection.query(query, (err, rows) => {
        if (err) console.log(err.sqlMessage)
        res.send(rows)
    })
})

router.post('/', (req, res) => {

    const orderId = req.body.orderId
    const itemCode = req.body.itemCode
    const orderQty = req.body.orderQty
    const price = req.body.price

    var query = "INSERT INTO orderDetails (orderId, itemCode, orderQty, price) VALUES (?,?,?,?)"

    connection.query(query, [orderId, itemCode, orderQty, price], (err) =>{
        if(err){
            res.send({"message" : err.sqlMessage})
        }else{
            res.send({"message" : "Order Details successfully added!"})
        }
    })
})

router.put("/",(req,res)=>{
    const orderId = req.body.orderId
    const itemCode = req.body.itemCode
    const orderQty = req.body.orderQty
    const price = req.body.price

    var query = "UPDATE orderDetails SET itemCode=?, orderQty=?, price=? WHERE orderId=?"

    connection.query(query, [itemCode, orderQty, price, orderId], (err,rows) =>{
        if(err) console.log(err);

        if(rows.affectedRows > 0){
            res.send({'message' : 'Order Detail Updated'})
        }else{
            res.send({'message' : err.sqlMessage})
        }
    })
})

router.delete("/:orderId",(req,res)=>{
    const orderId = req.params.orderId

    var query = "DELETE FROM orderDetails WHERE orderId=?";

    connection.query(query, [orderId], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({ 'message': 'Order Detail deleted' })
        } else {
            res.send({ 'message': err.sqlMessage })
        }
    })
})

router.get('/:orderId', (req, res) => {
    const orderId = req.params.orderId

    var query = "SELECT * FROM orderDetails WHERE orderId=?"

    connection.query(query, [orderId], (err, rows) => {
        if (err) console.log(err);

        res.send(rows)
    })
})



module.exports=router