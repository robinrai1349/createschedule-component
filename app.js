const fs = require("fs");
const pg = require("pg")
const { Pool } = pg
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
 
   
   
 app.post('/post', jsonParser, async (req,res)=>{
    const dataArray = req.body.data;
    const semesterId = req.body.semesterId;
    const client = new pg.Client(config);
    client.connect()
    let uniqueCourseIDs = []


    client
    .query("SELECT profileid FROM userprofileinfo WHERE userid=$1 AND profileid=$2", [userID, semesterId])
    .then(result => {
      if (result.rows.length > 0) {
        throw new Error("Profile already exists!")
      }
      })
      .then(() => dataArray.forEach(row => {
        const { courseID, courseName, deadlineName, deadlineDate, deadlineGrade } = row;
        console.log(courseID)

        if (!uniqueCourseIDs.includes(courseID)){

          uniqueCourseIDs.push(courseID)
          console.log("unqiueCourseIDs list:", courseID)
          client
          .query("SELECT * FROM courses WHERE courseid=$1", [courseID])
          .then(courseCountResult => {
            console.log("the courseid in question:", courseID)
            console.log(courseCountResult.rows.length)
            if (courseCountResult.rows.length == 0){

              client
              .query("INSERT INTO courses (courseID, courseName) VALUES ($1, $2)", [courseID, courseName])
              .then(console.log("Database: INSERT operation into 'courses' table processing..."))
              .then(

                client
                .query("INSERT INTO userprofileinfo (userID, profileID, courseID) VALUES ($1, $2, $3)", [userID, semesterId, courseID])
                .then(console.log("Database: INSERT operation into 'userProfileInfo' table processing..."))
                .catch(err => {
                  console.log(err.stack)
                })

              )
              .catch(err => {
                console.log(err.stack)
              })

            } else {

              client
              .query("INSERT INTO userprofileinfo (userID, profileID, courseID) VALUES ($1, $2, $3)", [userID, semesterId, courseID])
              .then(console.log("Database: INSERT operation into 'userProfileInfo' table processing..."))
              .catch(err => {
                console.log(err.stack)
              })

            }
          })
          .catch(err => {
            console.log(err.stack)
          })

          

        }
      }))
      .catch(err => {
        console.log(err.stack)
      })

      // Send confirmation back to client
      res.status(200).send('Data inserted successfully')
 });
 
app.listen(3000);

// previous outdated vvvvvv
// TODO:
/*
 - ADD ROUTES, this will prob solve the first problem below
    - look at lab example as a good reference
    - good link: https://stackoverflow.com/questions/53935163/how-can-i-send-one-alert-from-my-node-js-to-my-javascript-client
 - know how to send alert from Node.JS to Javascript client
 - do insert queries for database tables based on data inputted from user (assuming its valid) 
 - get rid of 'console.log' test usages once all is well.
 */
// above is outdated ^^^^^^^


// current active: vvvvvvvv
/*
 AFTER:
 - Not doing routes as it will take too long for everyone to translate into using the pug format
 - still need to figure out server to client message relaying (alerts)
 - queries added for courses and userprofileinfo table
 
 TODO:
 - know how to send alert from Node.JS to Javascript client
 - queries for deadlineinfo
 - know how to obtain current active user's userid instead of using temporary variable (userID)
 - get rid of 'console.log' test usages once all is well.
 - add comments for clarity i guess
*/