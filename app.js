const fs = require("fs");
const pg = require("pg")
const { Pool } = pg
const express = require("express");
const bodyParser = require('body-parser')
const app = express();

// pointless commit here

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
    res.render('createschedule', {response:null});
 })
 

 // Handle inputted data from the hub (.csv) to database
 app.post('/post', jsonParser, async (req, res) => {
  const dataArray = req.body.data;
  const semesterId = req.body.semesterId;
  const client = new pg.Client(config);
  await client.connect();
  
  let uniqueCourseIDs = [];
  console.log("row:",dataArray)
  const deadlineInfoMap = dataArray.reduce((map, row) => {
    if (!map[row.courseID]) {
      map[row.courseID] = [];
    }
    const checkedGrade = (!row.deadlineGrade == '') ? (row.deadlineGrade) : (null);
    map[row.courseID].push([row.deadlineName, row.deadlineDate, checkedGrade]);
    return map;
  }, {});
  
  console.log(deadlineInfoMap)

// START MARK VVVVVVVVVVVVVVVVVVVVVVVVVVV (read comment below for context)

    // the code below till the "end mark" accomplishes the following:
    /*
    1. check if profile with existing name exists (will return as a fail if so)
    2. for each unique course, check if course exists in 'courses' table
    3. if NO, insert new course info into 'courses' table
    4. regardless if YES or NO, the user's course deadlines data is inserted into 'deadlineInfo' table
    5. likewise, the user's profile data is inserted into 'userProfileInfo' table
    */
  try {
      const profileExists = await client.query("SELECT profileid FROM userprofileinfo WHERE userid=$1 AND profileid=$2", [userID, semesterId]);
      
      if (profileExists.rows.length > 0) {
          throw new Error("Profile already exists!");
      }
      console.log("dataArray:",dataArray)
      for (const row of dataArray) {
          const { courseID, courseName } = row;

          if (!uniqueCourseIDs.includes(courseID)) {
              uniqueCourseIDs.push(courseID);

              const courseExists = await client.query("SELECT * FROM courses WHERE courseid=$1", [courseID]);

              if (courseExists.rows.length === 0) {
                    console.log("courseid:",courseID + ", courseName:",courseName)
                  await client.query("INSERT INTO courses (courseID, courseName) VALUES ($1, $2)", [courseID, courseName]);
              }

              for (const deadlineInfo of deadlineInfoMap[courseID]) {
                  const [deadlineName, deadlineDate, deadlineGrade] = deadlineInfo;
                    console.log("yo")
                  // Check if the deadline already exists
                  const deadlineExists = await client.query(
                      "SELECT * FROM deadlineinfo WHERE userID=$1 AND courseID=$2 AND deadlineName=$3 AND deadlineDate=$4 AND deadlineGrade=$5",
                      [userID, courseID, deadlineName, deadlineDate, deadlineGrade]
                  );
                    console.log("yoyo")
                  if (deadlineExists.rows.length === 0) {
                      await client.query(
                          "INSERT INTO deadlineinfo (userID, courseID, deadlineName, deadlineDate, deadlineGrade) VALUES ($1, $2, $3, $4, $5)",
                          [userID, courseID, deadlineName, deadlineDate, deadlineGrade]
                      );
                  }
              }
              console.log("yoyoyo")
              // Check if the user profile info already exists
              const userProfileInfoExists = await client.query(
                  "SELECT * FROM userprofileinfo WHERE userID=$1 AND profileID=$2 AND courseID=$3",
                  [userID, semesterId, courseID]
              );

              if (userProfileInfoExists.rows.length === 0) {
                  await client.query(
                      "INSERT INTO userprofileinfo (userID, profileID, courseID) VALUES ($1, $2, $3)",
                      [userID, semesterId, courseID]
                  );
              }
          }
      }

      res.status(200).json({ success: true, message: "Profile created successfully!" });
  } catch (err) {
      console.log(err.stack);
      res.status(401).json({ success: false, message: err.message });
  } finally {
      await client.end();
  }
});

// END MARK ^^^^^^^^^^^^^^^^^^^^^^^^^ (read comment at START MARK for context)
   
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
 X - know how to send alert from Node.JS to Javascript client
 X - queries for deadlineinfo
 ~ - know how to obtain current active user's userid instead of using temporary variable (userID)
 X - get rid of 'console.log' test usages once all is well.
 X - add comments for clarity i guess
*/