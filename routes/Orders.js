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
        var userTableQuery = "CREATE TABLE IF NOT EXISTS orders (OrderId VARCHAR(255) PRIMARY KEY, OrderDate DATE, CustId Varchar(255), Cost double,FOREIGN KEY(CustId) REFERENCES customer(id))"
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
    var query = "SELECT * FROM orders";
    connection.query(query, (err, rows) => {
        if (err) console.log(err.sqlMessage)
        res.send(rows)
    })
})

router.post('/', (req, res) => {
    const OrderId=req.body.OrderId
    const OrderDate=req.body.OrderDate
    const CustId=req.body.CustId
    const Cost=req.body.Cost
    var query = "INSERT INTO orders (OrderId, OrderDate, CustId, Cost) VALUES (?,?,?,?)";

    connection.query(query, [OrderId, OrderDate, CustId, Cost], (err) =>{
        if(err){
            res.send({"message" : err.sqlMessage})

        }else{
            res.send({"message" : "Customer successfully added!"})
        }
    })
})

router.put("/",(req,res)=>{
    const OrderId=req.body.OrderId
    const OrderDate=req.body.OrderDate
    const CustId=req.body.CustId
    const Cost=req.body.Cost

    var query = "UPDATE orders SET OrderDate=?, CustId=?, Cost=? WHERE OrderId=?"

    connection.query(query,[OrderDate,CustId,Cost,OrderId],(err,rows)=>{
        if (err)console.log(err)

        if (rows.affectedRows>0){
            res.send("item updated")
        }else {
            res.send(err.sqlMessage)
        }
    })
})

router.delete("/:id",(req,res)=>{
    const id=req.params.id;

    var query = "DELETE FROM orders WHERE OrderId=?";

    connection.query(query, [id], (err, rows) => {
        if (err) console.log(err);

        if (rows.affectedRows > 0) {
            res.send({ 'message': 'Order deleted' })
        } else {
            res.send({ 'message': err.sqlMessage })
        }
    })

})

router.get('/:id', (req, res) => {
    const id=req.params.id;
    var query = "SELECT * FROM orders WHERE  OrderId=?";
    connection.query(query,[id], (err, rows) => {
            if (err) console.log(err)
            res.send(rows)
    })
})



module.exports=router