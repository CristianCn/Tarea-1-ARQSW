const express = require('express');
const app = express();

const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const db = new sqlite3.Database('mydb.db');


db.run("CREATE TABLE if not exists stats (ip TEXT, date TEXT)");

app.get('/', function(req, res) {

    let date1 = new Date().toUTCString();
    let ip2 = req.headers['x-forwarded-for'] ||req.connection.remoteAddress; ;
    
    let stmt2 = db.prepare("INSERT INTO stats VALUES(?,?)");
    stmt2.run(ip2, date1); 
    stmt2.finalize();


    let aux = [];
    let promise = db.all("SELECT ip, date FROM stats ORDER BY date DESC LIMIT 10", function(err, rows) {
        
        

        rows.forEach(function (row) {
            
            aux.push({ip: row.ip, date: row.date});
        });
        
        res.render('index', {stats: aux})
        
        
    });

})



app.listen(3000, function(){
    console.log("Server running on port 3000");

})