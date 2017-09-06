const express = require('express');
const app = express();
const bodyParser = require('body-parser');




const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydb.db');


db.run("CREATE TABLE if not exists stats (ip TEXT, date TEXT)");

app.use(bodyParser.urlencoded({extended: true}))



app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
    db.each("SELECT ip, date FROM stats", function(err, row) {
        console.log("La ip es:" + row.ip + "La fecha es" + row.date);
    });
})

app.post('/requests', function(req, res) {
    
    res.send(req.body);
    console.log(req.body.name);
    let date = new Date().toUTCString();
    
    console.log(date, "data");
    
    let ip = req.headers['x-forwarded-for'] ||req.connection.remoteAddress; ;
    console.log(ip);
    let stmt = db.prepare("INSERT INTO stats VALUES(?,?)");
    stmt.run(ip, date); 
    stmt.finalize();
    
    //db.run("INSERT into stats (ip, date) VALUES (?, ?)", ip, date);

})


// db.serialize(function() {

//   
//   let stmt = db.prepare("INSERT INTO stats VALUES (?)");
//   stmt.run("Junk");
//   stmt.finalize();

//   db.each("SELECT ip FROM stats", function(err, row) {
//       console.log("La ip es:" + row.ip);
//   });
// });





app.listen(3000, function(){

})