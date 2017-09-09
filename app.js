const express = require('express');
const app = express();





const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');


const db = new sqlite3.Database('mydb.db');


db.run("CREATE TABLE if not exists stats (ip TEXT, date TEXT)");

app.get('/', function(req, res) {

    let date1 = new Date().toUTCString();
    let ip2 = req.headers['x-forwarded-for'] ||req.connection.remoteAddress; ;
    //console.log(ip2);
    let stmt2 = db.prepare("INSERT INTO stats VALUES(?,?)");
    stmt2.run(ip2, date1); 
    stmt2.finalize();

    
    //res.sendFile(__dirname + '/index.html');
    // db.each("SELECT ip, date FROM stats", function(err, row) {
    //     //console.log("La ip es: " + row.ip + " La fecha es " + row.date);
      
        
    // });

    //let answ = db.run("SELECT * FROM stats ORDER BY date DESC");
    //console.log(answ);
    
    //let data = [req.body.name, req.body.ip, req.body.ip]

    let aux = [];
    let promise = db.all("SELECT ip, date FROM stats ORDER BY date DESC LIMIT 10", function(err, rows) {
        
        

        rows.forEach(function (row) {
            console.log("IP: " + row.ip + " DATE: " + row.date);
            aux.push({ip: row.ip, date: row.date});
        });
        console.log('aux', aux);
        res.render('index', {stats: aux})
        
        
    });

    
    
})

// app.post('/', function(req, res) {
    
//     res.sendFile(__dirname + '/index.html');
//     console.log(req.body.name);
//     let date = new Date().toUTCString();
    

    
//     let ip = req.headers['x-forwarded-for'] ||req.connection.remoteAddress; ;
//     console.log(ip);
//     let stmt = db.prepare("INSERT INTO stats VALUES(?,?,?)");
//     stmt.run(ip, date, req.body.name); 
//     stmt.finalize();
    
    //db.run("INSERT into stats (ip, date) VALUES (?, ?)", ip, date);

//})


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
    console.log("Server andando en port 3000");

})