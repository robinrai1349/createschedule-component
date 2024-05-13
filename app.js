const fs = require("fs");
const pg = require("pg");
const express = require("express");
const app = express();

const config = {
    user: "avnadmin",
    password: "AVNS_q8L5Bn1DU4v5Scy8Tyo",
    host: "pg-studyplanner-studyplanner.d.aivencloud.com",
    port: "24821",
    database: "defaultdb",
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync("ca.pem").toString(),
    },
   };
   
   const client = new pg.Client(config);

 
   client.connect((err) => {
        client.query("SELECT VERSION()", [], (err, res) => {
            console.log(err ? err.stack : res.rows[0]) // Hello World!
        });
        client.query("SELECT * FROM users", [], (err, res) => {
            console.log(err ? err.stack : res.rows) // Hello World!
        });
   });


   
// const db =pgp('postgres://avnadmin:AVNS_q8L5Bn1DU4v5Scy8Tyo@pg-studyplanner-studyplanner.d.aivencloud.com:24821/defaultdb?sslmode=require')
// db.connect().then(obj => {
//     const serverVersion = obj.client.serverVersion;
//     obj.done();
//     console.log("Database connected successfully");
//  })
//  .catch((error) => {
//     console.error("Database connection failed:", error.message || error);
//  });

 app.use(express.static('public'));
 app.set('view engine', 'ejs');
 app.get('/', (req,res) => {
    res.render('createschedule');
 })
 
app.listen(3000);

