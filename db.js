var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');
const Console = require("console");

const app = express();
app.use(express.json());

app.listen('5000', () => {
    console.log("Server started on port 5000!");
    console.log("Go to localhost:5000 to start");
});

const db = mysql.createConnection({
    host: "csds-395-group4.co1rrt8vxy1n.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: 'admin',
    password: "superman",
    database: "insta-jacked"
})

// to do: find a hashing algorithm for the password
function hashPassword(password){
    return password;
}

// from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

// // login to a user
// app.post("/register", (req, res) =>{
//     // hard code information in for now
//     const username = req.body.username;
//     const email = req.body.email;
//     let password = req.body.password;


//     const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     password = hashPassword(password);
//     const sql = "SELECT * FROM user WHERE (user_name = '" + username + "' OR email = '" + email + "' or mobile_number "+
//         "= '" + number + "') AND hashed_password = '" + password + "'";
//     const updateLastLoginSQL = "UPDATE user SET last_online = '" + now  + "' WHERE user_name = '" + username + "'";
//     db.query(sql, function(err, result){
//         if (err) throw err;
//         db.query(updateLastLoginSQL, (err1, result1) =>{
//             if(err1) throw err1;
//             console.log(result1);
//             console.log("updated last online")
//             console.log(result);
//             res.send("Found user0")
//         })
//     })
// })

// create an account
app.post("/register", (req, res) => {
    // hard coding in a user
    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const firstName = req.body.firstName;
    const lastName= req.body.lastName;

    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    password = hashPassword(password);
    const sql = "INSERT INTO user (user_name, first_name, last_name, mobile_number, email, hashed_password, " +
        "creation_date, last_online, intro) VALUES ('" + username + "','"+ firstName + "','" + lastName + "','" + 0 + "','"
        + email + "','" + password + "','" + creationDate + "','" + creationDate + "', NULL)";
    db.query(sql, function(err, result){
        if (err){
            // handle duplicate names;
            if (err.errno === 1062){
                console.log("Duplicate entry");
                res.send("Username email or password already in use")
            }
            else throw err;
        }
        console.log(result);
        res.send("Added user")
    })
})

// // finds users who userName is following
// // for testing use user1 as username
// app.get("/user/following/:userName", (req, res) =>{
//     const userName = req.params['userName'];

//     console.log("Current user",userName);
//     const sql = "SELECT target_user FROM user_follow WHERE approved = true AND source_user = '" + userName + "'";
//     db.query(sql,function (err, result){
//         if (err) throw err;
//         let following = [];
//         for (let i = 0; i < result.length; i++){
//             let user = result[i]['target_user']
//             console.log(user)
//             following.push(user)
//         }
//         console.log(userName + " is following "+ following)
//         res.send("Found followers of " + userName + ": " + following);
//         })
// })

// // finds all posts and comments that a user has interacted with
// // for testing use user10
// app.get("/user/interactions/:userName", (req, res) => {
//     const username = req.params['userName'];

//     console.log("Current user:", username);
//     const sql = "SELECT c.post_id FROM post_comment AS c WHERE c.user_name = '" + username + "'";
//     db.query(sql, function (err, result){
//         if (err) throw err;
//         let comments = []
//         for (let i = 0; i < result.length; i++){
//             let postID = result[i]['post_id'];
//             console.log(postID);
//             comments.push(postID);
//         }
//         let newSQL = "SELECT p.post_id FROM post_like AS p WHERE p.user_name = '" + username + "'";
//         db.query(newSQL, function (e, r){
//             if (e) throw e;
//             let posts=[];
//             for (let i = 0; i<r.length; i++){
//                 let postID = r[i]['post_id'];
//                 console.log(postID);
//                 posts.push(postID);
//             }
//             console.log(username);
//             console.log("posts:", posts);
//             console.log("comments:", comments);
//             res.send("Found interactions of " + username + " posts: " + posts + "|| comments: "+ comments);
//         })
//    })
// })


// // searches a username from either a name or creator username
// app.get("/workouts/search", (req,res) => {
//     // commenting out to hard code in a name
//     `const search = req.body.searchBar;`

//     // hard coding in a username to search for
//     const search = 'user37'
//     console.log("Searching:", search);
//     const sql = "SELECT name, workout_id, creator_user_name FROM workout WHERE name ='" + search +
//         "' OR creator_user_name = '" + search + "'";
//     db.query(sql, (err, result) =>{
//         if (err) throw err;
//         let workoutNames=[]
//         let workoutIDs=[]
//         let creators=[]
//         for (let i = 0; i< result.length; i++){
//             let id = result[i]['workout_id'];
//             let name = result[i]['name'];
//             let creator = result[i]['creator_user_name']
//             workoutIDs[i] = id;
//             workoutNames[i] = name;
//             creators[i] = creator;
//         }
//         console.log("Names:", workoutNames);
//         console.log("IDs:", workoutIDs);
//         console.log("Creators:", creators)
//         res.send("Found workouts " + workoutNames + " || Found IDs " + workoutIDs + " || Creators " + creators);


//     })

// })

// // searches programs to find a program that meets the user's requirements
// app.get("/programs/search", (req,res) => {
//     // hard coding in example for now
//     `// default length to 0
//     const length = req.body.numDays;
//     // either >, <, or blank string; allows for user to search for program of certain length or greater/lesser length
//     const comparer = req.body.comparer;
//     // search can be the name of the program or the creator
//     const search = req.body.searchBar;`

//     const length = "60";
//     const comparer = ">"
//     const search = "some name";

//     console.log("Searching for a program of length " + length + " with name " + search);
//     const sql = "SELECT * FROM program WHERE (program_name = '" + search + "' OR program_creator = '" + search +
//         "') AND length " + comparer + "= " + length;
//     db.query(sql, (err, result) => {
//         if (err) throw err;
//         let programIDs = [];
//         let programNames = [];
//         let programCreators = [];
//         let programLengths = [];
//         for (let i = 0; i<result.length; i++){
//             let program=result[i];
//             programIDs.push(program["program_id"]);
//             programNames.push(program["program_name"]);
//             programCreators.push(program["program_creator"]);
//             programLengths.push(program["length"]);
//         }
//         console.log("creators", programCreators);
//         console.log("IDs", programIDs);
//         console.log("names", programNames);
//         console.log("lengths", programLengths);
//         res.send("creators: " + programCreators + " IDs: " + programIDs + " | names: " + programNames +
//             " | lengths" + programLengths);
//     })
// })

// // finds all moves in a workout and workout metadata
// // use workout10 as example
// app.get("/workouts/moves/:workoutID", (req, res) => {
//     const workoutID = req.params["workoutID"];

//     const setSQL = "SELECT s.* FROM workout as w, `set` as s WHERE w.workout_id = '" + workoutID
//         + "' AND s.workout_id = '" + workoutID + "'";
//     db.query(setSQL, (err, result) => {
//         if(err) throw err;
//         let moveNames = [];
//         let workoutmeta=[]
//         for (let i =0; i<result.length; i ++){
//             let moveName = result[i]['move_name'];
//             moveNames.push(moveName);
//         }
//         const metaSQL = "SELECT * FROM workout_meta WHERE workout_id = '" + workoutID + "'";
//         db.query(metaSQL, (err1, result1) => {
//             if (err1) throw err1;
//             for (let i=0; i<result1.length; i++){
//                 let meta = result1[i];
//                 let all = [meta['key'], meta['content']];
//                 workoutmeta.push(all);
//             }
//             console.log("Names", moveNames);
//             console.log("Workout meta", workoutmeta)
//             res.send("Names: " + moveNames + " | workout meta " + workoutmeta);
//         })
//     })
// })

// // finds all workouts in a program and program metadata
// // program0 as test
// app.get("/programs/workouts/:programID", (req, res) => {
//     const programID = req.params["programID"];

//     const programSQL = "SELECT c.workout_id, w.name FROM program_contains as c, workout as w WHERE program_id = '"
//         + programID +"' AND w.workout_id = c.workout_id";
//     db.query(programSQL, (err, result) => {
//         if(err) throw err;
//         let workoutIDs = [];
//         let names = [];
//         let programMeta=[];
//         for (let i =0; i<result.length; i++){
//             let workoutID = result[i]['workout_id'];
//             let name = result[i]['name'];
//             workoutIDs.push(workoutID);
//             names.push(name);
//         }
//         const metaSQL = "SELECT * FROM program_meta WHERE program_id = '" + programID +"'";
//         db.query(metaSQL, (err1, result1) => {
//             if (err1) throw err1;
//             for (let i=0; i<result1.length; i++){
//                 let meta = result1[i];
//                 let all = [meta['key'], meta['content']];
//                 programMeta.push(all);
//             }
//             console.log("WorkoutIds", workoutIDs)
//             console.log("Names", names);
//             console.log("Program meta", programMeta);
//             res.send("Names: " + names + " | workout IDs: " + workoutIDs + " | Program metadata: " + programMeta);
//         })
//     })
// })

// // makes a new workout with x number of moves
// app.get("/workouts/create", (req, res) =>{
//     // function to make a workout, will be recursively called if a duplicate ID is used
//     function makeWorkout(){
//         `// name of the workout
//     const workoutName = req.body.workoutName;
//     // list of move names
//     const moves = req.body.moves;
//     const username = req.body.username
//     `

//         // hard code in workout name and moves for now
//         const workoutName = "Some name";
//         // moves in format name, rep count, repetition. set num is the place in array
//         const moves= [["move1", -1,-1], ["move2",-1,-1], ["move3",-1,-1]];
//         const username = "user0"

//         //randomly generate workoutID
//         const workoutID= makeid(20);
//         console.log("workout name:",workoutName)
//         console.log("workout ID", workoutID)
//         const sql = "INSERT INTO workout (workout_id, name, creator_user_name) VALUES ('" + workoutID + "', ' "
//             + workoutName + "', '" + username + "')"
//         db.query(sql, (err, result) => {
//             if (err){
//                 // handle duplicate names;
//                 if (err.errno === 1062){
//                     console.log("Duplicate entry");
//                     // run again with same base params, workoutID will be randomly generated
//                     makeWorkout();
//                 }
//                 else throw err;
//             }
//         })
//         for(let i=0; i<moves.length;i++){
//             let set = moves[i];
//             let name = set[0];
//             let repCount= set[1];
//             let repetition = set[2];
//             let moveSQL = "INSERT INTO `set` (workout_id, move_name, rep_count, repetition, set_num) VALUES ('"
//                 + workoutID + "', '" + name+ "'," + repCount + "," + repetition + "," + i + ")";
//             db.query(moveSQL, (err, result) =>{
//                 if (err) throw err;
//                 console.log(result);
//             })
//         }
//         res.send("Added workout with ID:" + workoutID + " and name " + workoutName);
//     }
//     makeWorkout();
// })

// app.get("/programs/create", (req, res) =>{
//     `const programName = req.body.name;
//         const creator = req.body.username;
//         const description = req.body.description;
//     `

//     //hard coding for testing
//     const programName = "program 3000";
//     const creator = "user99"
//     const description = "some description"

//     function makeProgram(){
//         const programID = makeid(20);
//         const sql = "INSERT INTO program (program_id, program_name, program_creator, description) VALUES ('"
//             + programID + "', '" + programName + "', '" + creator + "', '"+ description + "')"
//         db.query(sql, (err, result) =>{
//             if(err){
//                 if (err.errno === 1062){
//                     console.log("Duplicate entry, rerun with new programID")
//                     makeProgram();
//                 }
//                 else throw err;
//             }
//             console.log(result);
//             res.send("Successfully made program with ID: " + programID + " and name: " + programName)
//         })
//     }
//     makeProgram()
// })

// // creates a message group from a given name and creator username
// app.get("/messages/creategroup", (req, res) =>{
//     `const username = req.body.username;
//     const name = req.body.name;`

//     // hardcode in name for now
//     const name= 'some group';
//     const username = 'user99';

//     const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

//     // function to run again in case of duplicate user ID
//     function makeMessageGroup(){
//         const id = makeid(20)
//         const sql = "INSERT INTO message_group (group_id, group_name, creator, creation_time) VALUES ('" + id + "', '"
//             + name + "', '" + username + "', '" + now + "')"
//         const adminSQL = "INSERT INTO message_group_member (group_ID, user_name, join_date, admin_level) VALUES " +
//             "('" + id + "', '" + username + "', '" + now + "', 3)";
//         db.query(sql, (err, result) =>{
//             if(err){
//                 if (err.errno === 1062){
//                     console.log("Duplicate entry, rerun with new groupID")
//                     makeMessageGroup();
//                 }
//                 else throw err;
//             }
//             db.query(adminSQL, (err1, result1)=>{
//                 if (err1) throw err1;
//                 console.log(result, result1);
//                 res.send("New group with ID" + id + " created");
//                 }
//             )
//         })
//     }
//     makeMessageGroup();
// })

// // finds all messages in a message group if the username is a member of the group
// app.get("/messages/:groupID", (req,res) =>{
//     const groupID = req.params['groupID'];

//     `const username = req.body.username`

//     //hard code username for now
//     const username = 'user99';

//     const membersSQl="SELECT user_name FROM message_group_member WHERE group_ID = '" + groupID + "'";
//     const messageSQL = "SELECT content, sender, send_time FROM message WHERE group_id = '" + groupID + "' AND '"
//         + username + "' in (" + membersSQl + ")";
//     db.query(messageSQL, (err, result) =>{
//         if(err) throw err;
//         if(result[0] === undefined)
//             res.send("Group does not exists or not a member of group");
//         let content ="";
//         for(let i=0; i<result.length; i++){
//             let message = result[i];
//             console.log(message)
//             // divider for formatting
//             if(i !== 0)
//                 content += "\n<br/>\n"
//             content += message['sender'] + " at " + message['send_time'] + ": " + message['content'];
//         }
//         console.log(content);
//         res.send(content);
//     })
// })

// // user starts a program with a given userID
// app.get("/programs/start/:programID", (req,res) =>{
//     const programID = req.params["programID"];

//     // hard code in for testing
//     `const username = req.body.username;`
//     const username = "user99"

//     const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     // check to see if a user is already doing the program
//     const checkSQL = "SELECT * from completing_program WHERE program_id = '"
//         + programID + "' AND user_name = '" + username + "' and completed = 1";
//     db.query(checkSQL, (err1, result1)=>{
//         if(err1) throw err1;
//         // if user is not currently doing that program, start the program
//         if (result1[0]!== undefined){
//             const sql = "INSERT INTO completing_program (program_id, user_name, date_started) VALUES ('"
//                 + programID + "','"+ username + "','" + now + "')";
//             db.query(sql, (err, result)=>{
//                 if (err) throw err;
//                 console.log(result);
//                 res.send(username + " started program with ID " + programID);
//             })
//         }
//         // else the user is already doing that program
//         else
//             res.send(username + " already started program with ID " + programID);
//     })
// })

// // gets all workouts a user has to do on a given day
// app.get("/today", (req, res) =>{
//     // hard code in for testing
//     `const username = req.body.username;`
//     const username = "user99";

//     const sql ="SELECT w.*, m.program_id as program_id, m.program_name as program_name FROM program_contains as c, " +
//         "workout as w, (SELECT * FROM completing_program WHERE user_name = '" + username +"' AND completed = 0) as p," +
//         " program as m WHERE c.day_of = p.day_of_program AND c.program_id=p.program_id and c.workout_id=w.workout_id " +
//         "AND m.program_id = c.program_id"
//     db.query(sql, (err, result)=>{
//         if(err) throw err;
//         let str ="";
//         for(let i=0; i<result.length; i++){
//             let row = result[i];
//             if(i!==0) str+="\n<br/>\n";
//             str+= "Workout ID: " + row['workout_id'] + " || Workout name: " + row['name'] + " || workout creator: "
//                 + row['creator_user_name'] + " || Description: " + row['description'] + " || ProgramID: " + row['program_id'] + " || Program Name: " + row['program_name']
//         }
//         console.log(str);
//         res.send(str);
//     })
// })

// // find all sets in a workout
// app.get("/workouts/:workoutID", (req,res) =>{
//     const workoutID = req.params["workoutID"];
//     const sql = "SELECT set_num, move_name, rep_count, repetition FROM `set` WHERE workout_id = '" + workoutID + "'";

//     db.query(sql, (err, result) =>{
//         if (err) throw err;
//         let setSTR = "";
//         for (let i = 0; i<result.length; i++){
//             let set=result[i]
//             if(i !== 0) setSTR+= "\n<br/>\n";
//             setSTR+= set['set_num'] + ": "+ set['move_name'] + " REP COUNT: " + set['rep_count']
//                 + " FOR " + set['repetition'] + " SETS";
//         }
//         console.log(setSTR);
//         res.send(setSTR);
//     })
// })

// // adds a user to a message group if above admin level 2
// app.get("/messages/addmember/:groupID", (req,res) =>{
//     const groupID = req.params['groupID'];

//     // hard code in for now
//     `const username= req.body.username;
//     const targetUser = req.body.targetuser`
//     const username ='user99';
//     const targetUser='user3';

//     const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     const checkSQL="SELECT * FROM message_group_member WHERE group_id = '" + groupID + "' AND user_name='" + targetUser + "'";
//     const insertSQL = "INSERT INTO message_group_member (group_ID, user_name, join_date) " +
//         "SELECT '" + groupID + "', '" + targetUser + "', '" + now + "' FROM message_group_member " +
//         "WHERE '"+ username + "' = user_name AND group_ID = '" + groupID + "' AND admin_level>=2";
//     // check to see if user is already in the group
//     db.query(checkSQL, (err, result)=>{
//         if(err) throw err;
//         if (result[0] === undefined){
//             db.query(insertSQL, (err1, result1) =>{
//                 if(err1) throw err1;
//                 console.log(result1);
//                 res.send(username+ " Added " + targetUser + " to the group with ID " + groupID);
//             })
//         }
//         else res.send("Unable to add " + targetUser + " to the group")
//     })
// })

// app.get("/workouts/:workoutID/completed", (req, res) =>{
//     const workoutID = req.params["workoutID"];

//     // hard code in for testing
//     `const username = req.body.username;`
//     const username = "user99";

//     const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     // SQL for completing the workout
//     const completionSQL="INSERT INTO completed_workout (workout_id, user_name, date_completed) VALUES ('" + workoutID
//         + "', '" + username + "', '" + now + "')";
//     // SQL for finding if the workout is a part of a program the USER is doing and if they're doing it on the day of the program
//     const programIDSQL = "SELECT c.program_id FROM completing_program as c, program_contains as p WHERE " +
//         "c.program_id = p.program_id AND c.user_name = '"+ username +"' AND p.workout_id = '"+ workoutID+ "' " +
//         "AND c.day_of_program = p.day_of"
//     db.query(completionSQL, (err, result)=>{
//         if(err) throw err;
//         console.log(result);
//         db.query(programIDSQL, (err1, result1) =>{
//             if(err1) throw err1;
//             console.log(result1);
//             if(result1[0] !== undefined){
//                 let programID = result1[0]["program_id"];
//                 // sql to update the program
//                 const updateSQL = "UPDATE completing_program SET day_of_program = day_of_program + 1 WHERE program_id = '"
//                     + programID + "' AND user_name = '" + username + "'";
//                 db.query(updateSQL, (err2, result2)=>{
//                     if(err2) throw err2;
//                     console.log(result2);
//                     res.send(username + " completed workout with ID " + workoutID + " and advanced in program with ID " + programID)
//                 })
//             }
//             else
//             res.send(username + " completed workout with ID " + workoutID);
//         })
//     })
// })

// // Gets everything for the landing page
// app.get("/landing", (req,res)=>{
//     `const username = req.body.username;`

//     const username= 'user99'

//     const findFriendsSQL= "SELECT target_user FROM user_follow WHERE source_user = '" + username + "' AND approved = 1";
//     const friendsMovesSQL= "SELECT * FROM completed_move WHERE user_name in (" + findFriendsSQL + ")";
//     const friendWorkoutsSQL= "SELECT * FROM completed_workout WHERE user_name in (" + findFriendsSQL + ")";
//     db.query(friendsMovesSQL, (err, moves)=>{
//         if (err) throw err;
//         console.log(moves);
//         let moveStr='';
//         for(let i=0; i<moves.length; i++){
//             let move=moves[i];
//             if(i!==0) moveStr += "\n<br/>\n";
//             moveStr+= move['user_name'] + " did " + move['move_name'] + " for " + move['rep_count'] +
//                 " reps at " + move['weight_in_pounds'] + " pounds on " + move['last_completed'];
//         }
//         db.query(friendWorkoutsSQL, (err1, workouts)=>{
//             if(err1) throw err1;
//             console.log(workouts);
//             let workoutStr='';
//             for(let i=0; i<workouts.length; i++){
//                 let workout=workouts[i];
//                 if(i!==0) workoutStr+="\n<br/>\n";
//                 workoutStr+= workout["user_name"] + " completed workout with ID "
//                     + workout['workout_id'] + " on " + workout['date_completed'];
//             }
//             res.send("MOVES: " + moveStr + "\n<br/> <br/>\n WORKOUTS: " + workoutStr);
//         })
//     })
// })