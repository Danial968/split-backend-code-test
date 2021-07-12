var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database('tickets');

var databaseName = 'tickets'

if(process.env.NODE_ENV === 'test'){
    databaseName = 'ticketsTest'
}

let db = new sqlite3.Database(databaseName,(err) =>{
    if(err){
        console.error(err.message)
        // throw err
    } else {
        console.log("SQLITE db connected")
        db.run(`CREATE TABLE tickets (
            ticketId STRING UNIQUE, 
            price FlOAT, 
            mdr FLOAT, 
            currency STRING, 
            travelAgentName String
            )`, (err)=>{
            if (err) {
                console.log("table already created")
                console.error(err.message)
            } else {
                // var stmt = db.prepare('INSERT into tickets values(?,?,?,?,?)')
                // for(var i = 0; i < 3; i++){
                //     var ticket = "ticket" + i
                //     var price = i
                //     var mdr = i
                //     var agent = "agent + " + i
                //     var currency = "SGD"
                //     stmt.run(ticket, price, mdr, currency, agent)
                // }
                // stmt.finalize()
            }

        })
    }
})

let wipeData = () =>{
    sql = "DELETE FROM tickets"
    db.run(sql, (err) => {
        if(err){
            console.log(err.message)
        } else {
            console.log("ROWS deleted")
        }
    })
}


module.exports = {
    db: db,
    wipeData: wipeData
}

// module.exports = db
// module.exports = wipeData
