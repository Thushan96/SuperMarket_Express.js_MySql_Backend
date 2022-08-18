const express=require('express')
const mysql=require('mysql')
const db=require('../configs/db.configs')
const router=express.Router()

const connection=mysql.createConnection(db.database)

connection.connect((err)=>{
    if (err) console.log(err)

    else {
        console.log("connected to sql server")
        var itemTableQuery = "CREATE TABLE IF NOT EXISTS item (code VARCHAR(255) PRIMARY KEY, name VARCHAR(255), price double,qtyOnHand int(10))"
        connection.query(itemTableQuery,(err,result)=>{
            if(err) throw err;
            console.log(result);
            if(result.warningCount === 0){
                console.log('item table created');
            }
        })

    }
})

router.get('/',(req,res)=>{
    var query='SELECT * FROM item';

    connection.query(query, (err, rows) => {
        if (err) console.log(err)
        res.send(rows)
    })

})

router.post("/",(req,res)=>{
        const code=req.body.code
        const name=req.body.name
        const price=req.body.price
        const qtyOnHand=req.body.qtyOnHand

    var query = "INSERT INTO item (code, name, price, qtyOnHand) VALUES (?,?,?,?)";

        connection.query(query,[code,name,price,qtyOnHand],(err)=>{

            if(err){
                res.send({"message" : "duplicate entry"})
            }else{
                res.send({"message" : "item successfully added!"})
            }
        })
})

router.put("/",(req,res)=>{
    const code=req.body.code
    const name=req.body.name
    const price=req.body.price
    const qtyOnHand=req.body.qtyOnHand

    var query = "UPDATE item SET name=?,price=?,qtyOnHand=? WHERE code=? ";

    connection.query(query,[name,price,qtyOnHand,code],(err)=>{

        if(err){
            res.send({"message" : "duplicate entry"})
            console.log(err)
        }else{
            res.send({"message" : "item successfully updated!"})
        }
    })
})

router.get("/:code",(req,res)=>{
    const code=req.params.code


    var query = "SELECT * FROM item WHERE code=?"

    connection.query(query,[code],(err,rows)=>{
        if(err) console.log(err)

        res.send(rows)
    })
})

router.delete("/:code",(req,res)=>{
    const code=req.params.code

    var query = "DELETE FROM item WHERE code=?"

    connection.query(query,[code],(err,rows)=>{
        if(err) console.log(err)

       if (rows.affectedRows>0){
            res.send({'message':'item deleted'})
       }else {
            res.send({'message':err.sqlMessage})
       }
    })
})

module.exports=router