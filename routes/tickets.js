var express = require('express');
var router = express.Router();
var moment = require('moment')
var {db} = require('../database')

/* 
HINT

Use moment library to manipulate datetime
https://momentjs.com/

*/

router.post('/oneSettlementPerWeek', function(req, res, next) {
    // use req.body to get JSON of start and end dates. We are only concerned with end dates.
    let endDate = moment(req.body['end'],'DD-MM-YYYY')

    //add changes below
    res.json({"paymentDate": moment(endDate).add(1, 'weeks').isoWeekday(1).format('DD-MM-YYYY')})
});
router.post('/twoSettlementPerWeek', function(req, res, next) {
    let endDate = moment(req.body['end'],'DD-MM-YYYY')

     //add changes below
     const thursday = 4
     const endDayISO = endDate.isoWeekday()
     
     if(endDayISO < thursday){
        res.json({"paymentDate":moment(endDate).isoWeekday(4).format('DD-MM-YYYY')})
     } else {
        res.json({"paymentDate": moment(endDate).add(1, 'weeks').isoWeekday(1).format('DD-MM-YYYY')})
     }
});
router.post('/calculateSettlementAmount', function(req, res, next) {
    //add changes below
    const reqArray = req.body
    let total = 0
    for(ticket of reqArray){
        total += ticket.price * (1 - ticket.MDR/100) * 100
    }
    //To always round up when there is more than 2 dp
    const roundedTotal = Math.ceil(total)
    const returnTotal = roundedTotal/100
    res.json({"totalSum": returnTotal})
});



/*

Assignment 3

Create API to CRUD function for tickets
Use NPM sqlite3 save the tickets 
https://www.npmjs.com/package/sqlite3

Ticket

{
  "ticketId":"TES2312-32",
  "price" , "203.10",
  "MDR" : "2.0",
  "currency" : "SGD",
  "travelAgentName" : "SPLIT-TEST-AGENT01"
}


Provide a solution to restart the app instance if it crashes.



*/
router.get('/ticket/:ticketId', function(req, res, next){
    console.log("HIT", req.params.ticketId)
    var sql = "SELECT * FROM tickets where ticketId = ?"
    var params = [req.params.ticketId]
    db.get(sql, params, function(err, row) {
        if(err){
            res.status(404).json({"error": err.message})
            return
        } else if (!row){
            res.status(404).json({"error": "ticketId does not exists"})
            return
        }
        res.json({
            "message": "success",
            "data": row
        })
    })
})

router.get('/', function(req, res, next){
    console.log('hit')
    var sql = "SELECT * FROM tickets"
    var params = []
    db.all(sql, params, (err, rows) => {
        if(err){
            res.status(400).json({"error": err.message})
            return
        } else if (!rows){
            res.status(400).json({"message": "No data in db yet"})
            return
        }
        res.json({
            "tickets": rows
        })
    })
})

router.post('/', function(req, res, next){
    var errors = []
    if(!req.body.ticketId){
        errors.push("No ticket Id specified")
    }
    if(!req.body.price){
        errors.push("No price specified")
    }
    if(!req.body.MDR){
        errors.push("No MDR specified")
    }
    if(!req.body.currency){
        errors.push("No currency specified")
    }
    if(!req.body.travelAgentName){
        errors.push("No travelAgentName specified")
    }
    if(errors.length){
        res.status(400).json({"error": errors.join(",")})
        return
    }
    var data = {
        ticketId: req.body.ticketId,
        price: req.body.price,
        MDR: req.body.MDR,
        currency: req.body.currency,
        travelAgentName: req.body.travelAgentName
    }
    var sql = "INSERT INTO tickets (ticketId, price, mdr, currency, travelAgentName) VALUES (?, ?, ?, ?, ?)"
    var params = [req.body.ticketId, req.body.price, req.body.MDR, req.body.currency, req.body.travelAgentName]

    db.run(sql, params, (err, result) => {
        if(err){
            res.status(400).json({"error": err.message})
            return
        } 
        res.json({
            "message": "success",
            "data": req.body,
            "id": this.lastID
        })
    })
})

router.delete('/:ticketId', function(req, res, next){
    var sql = "DELETE FROM tickets WHERE ticketId = ?"
    var params = [req.params.ticketId]

    db.run(sql, params, (err, result) => {
        if(err){
            res.status(400).json({"error": err.message})
            return
        } 
        res.json({
            "message": "deleted ticketId:" + req.params.ticketId,
            "rows": this.changes
        })
    })
})

router.put('/', function(req, res, next){
    var errors = []
    if(!req.body.ticketId){
        errors.push("No ticket Id specified")
    }
    if(!req.body.price){
        errors.push("No price specified")
    }
    if(!req.body.MDR){
        errors.push("No MDR specified")
    }
    if(!req.body.currency){
        errors.push("No currency specified")
    }
    if(!req.body.travelAgentName){
        errors.push("No travelAgentName specified")
    }
    if(errors.length){
        res.status(400).json({"error": errors.join(",")})
        return
    }
    var data = {
        ticketId: req.body.ticketId,
        price: req.body.price,
        MDR: req.body.MDR,
        currency: req.body.currency,
        travelAgentName: req.body.travelAgentName
    }

    var sql = `INSERT INTO tickets (ticketId, price, mdr, currency, travelAgentName) VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(ticketId) DO UPDATE SET 
                 price = ?, 
                 mdr = ?,
                 currency = ?,
                 travelAgentName = ?`

    var params = [req.body.ticketId, req.body.price, req.body.MDR, req.body.currency, req.body.travelAgentName, 
        req.body.price, req.body.MDR, req.body.currency, req.body.travelAgentName]

    db.run(sql, params, (err, result) => {
        if(err){
            res.status(400).json({"error": err.message})
            return
        } 
        res.json({
            "message": "success",
            "data": req.body,
            "id": this.lastID
        })
    })
})


/*
Assignment 4
Ensure the nodejs app process restart itself when it crash
*/

//Custom GET API that will crash the app
router.get('/crashApp', function(req, res, next) {

    setTimeout(function (){
        let totalSum = []
        while(true){
            let temp = {"test": 123, "data": [1,2,4,56,23,23,]}
            totalSum.push(temp)
        }
        process.on("exit", function(){
            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            })
        })
        process.exit()
    }, 1000)

    res.json({"message":"This will not be return as app will crash"})
});


module.exports = router;
