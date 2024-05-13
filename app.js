const fs = require("fs");
const pg = require("pg");
const express = require("express");
const bodyParser = require('body-parser')
const app = express();

// temporary
const userID = 1;

// create application/json parser
var jsonParser = bodyParser.json()

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
   
 app.use(express.static('public'));
 app.set('view engine', 'ejs');
 app.get('/', (req,res) => {
    res.render('createschedule');
 })
 
   
   
 app.post('/post', jsonParser,(req,res)=>{
    const client = new pg.Client(config);
    const dataArray = req.body.data;
    const semesterId = req.body.semesterId;

    console.log(dataArray)


    console.log("working so far")
    
    // Connect to the database
    client.connect((err) => {
      console.log("yoyo")
      if (err) {
          console.error('Database connection error:', err.stack);
          return res.status(500).send('Database connection error');
      }
      client.query("SELECT profileid FROM userprofileinfo WHERE userid=$1 AND profileid=$2", [userID, semesterId], (err, result) => {
        if (err) {
            console.error('Error:', err.stack);
        } else {
          // Insert data into the database

          // Check for existing profile
          if (result.rows.length > 0) {
            console.log("booo")
          } else {
            console.log("yooo its working yo")
          }

          // dataArray.forEach(data => {
          //   console.log("data:",data)
          //   const { courseID, courseName, deadlineName, deadlineDate, deadlineGrade } = data;
          //   client.query("INSERT INTO userprofileinfo (userID, profileID, courseID) VALUES ($1, $2, $3)", [userID, semesterId, courseID], (err, result) => {
          //     if (err) {
          //       console.error('Error!!!', err.stack);
          //     } else {
          //       console.log("Database: INSERT into userProfileInfo table successful!")
          //     }
          //   });
          // });
          
        }
        // End the database connection
        client.end();
        
      });
      // Send response back to the client
      res.status(200).send('Data inserted successfully');

  });
  
 });

app.listen(3000);

// TODO:
/*
 - ADD ROUTES, this will prob solve the first problem below
    - look at lab example as a good reference
    - good link: https://stackoverflow.com/questions/53935163/how-can-i-send-one-alert-from-my-node-js-to-my-javascript-client
 - know how to send alert from Node.JS to Javascript client
 - do insert queries for database tables based on data inputted from user (assuming its valid)
 - get rid of 'console.log' test usages once all is well.
 */