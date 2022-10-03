var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');
const Console = require("console");

const app = express();
app.use(express.json());

app.listen('3000', () => {
    console.log("Server started on port 3000!")
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

// login to a user
app.get("/login", (req, res) =>{
    // hard code information in for now
    `const username = req.body.username;
    const email = req.body.username;
    const number  = req.body.username;
    let password = req.body.password;`
    const username = 'user999';
    const email = 'testemail@email.com';
    const number  = '999';
    let password = 'secure password';

    password = hashPassword(password);
    const sql = "SELECT * FROM user WHERE (user_name = '" + username + "' OR email = '" + email + "' or mobile_number "+
        "= '" + number + "') AND hashed_password = '" + password + "'";
    db.query(sql, function(err, result){
        if (err) throw err;
        console.log(result);
        res.send("Found user0")
    })
})

// create an account
app.get("/createaccount", (req, res) => {
    // hard coding in a user
    `const username = reg.body.username;
    const email = reg.body.email;
    const number  = reg.body.number;
    let password = reg.body.password;
    const firstName = req.body.firstName;
    const lastName= req.body.lastName;`

    const username = 'user999';
    const email = 'testemail@email.com';
    const number  = '999';
    let password = 'secure password';
    const firstName = 'test';
    const lastName= 'user';

    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    password = hashPassword(password);
    const sql = "INSERT INTO user (user_name, first_name, last_name, mobile_number, email, hashed_password, " +
        "creation_date, last_online, intro) VALUES ('" + username + "','"+ firstName + "','" + lastName + "','" + number + "','"
        + email + "','" + password + "','" + creationDate + "','" + creationDate + "', NULL)";
    db.query(sql, function(err, result){
        if (err){
            // handle duplicate names;
            if (err.errno == 1062){
                console.log("Duplicate entry");
                res.send("Username email or password already in use")
            }
            else throw err;
        }
        console.log(result);
        res.send("Added user")
    })
})

// finds users who userName is following
// for testing use user1 as username
app.get("/user/following/:userName", (req, res) =>{
    const userName = req.params['userName'];

    console.log("Current user",userName);
    const sql = "SELECT target_user FROM user_follow WHERE approved = true AND source_user = '" + userName + "'";
    db.query(sql,function (err, result){
        if (err) throw err;
        let following = [];
        for (let i = 0; i < result.length; i++){
            let user = result[i]['target_user']
            console.log(user)
            following.push(user)
        }
        console.log(userName + " is following "+ following)
        res.send("Found followers of " + userName + ": " + following);
        })
})

// finds all posts and comments that a user has interacted with
// for testing use user10
app.get("/user/interactions/:userName", (req, res) => {
    const username = req.params['userName'];

    console.log("Current user:", username);
    const sql = "SELECT c.post_id FROM post_comment AS c WHERE c.user_name = '" + username + "'";
    db.query(sql, function (err, result){
        if (err) throw err;
        let comments = []
        for (let i = 0; i < result.length; i++){
            let postID = result[i]['post_id'];
            console.log(postID);
            comments.push(postID);
        }
        let newSQL = "SELECT p.post_id FROM post_like AS p WHERE p.user_name = '" + username + "'";
        db.query(newSQL, function (e, r){
            if (e) throw e;
            let posts=[];
            for (let i = 0; i<r.length; i++){
                let postID = r[i]['post_id'];
                console.log(postID);
                posts.push(postID);
            }
            console.log(username);
            console.log("posts:", posts);
            console.log("comments:", comments);
            res.send("Found interactions of " + username + " posts: " + posts + "|| comments: "+ comments);
        })
   })
})


// searches a username from either a name or creator username
app.get("/workouts/search", (req,res) => {
    // commenting out to hard code in a name
    `const search = req.body.searchBar;`

    // hard coding in a username to search for
    const search = 'user37'
    console.log("Searching:", search);
    const sql = "SELECT name, workout_id, creator_user_name FROM workout WHERE name ='" + search +
        "' OR creator_user_name = '" + search + "'";
    db.query(sql, (err, result) =>{
        if (err) throw err;
        let workoutNames=[]
        let workoutIDs=[]
        let creators=[]
        for (let i = 0; i< result.length; i++){
            let id = result[i]['workout_id'];
            let name = result[i]['name'];
            let creator = result[i]['creator_user_name']
            workoutIDs[i] = id;
            workoutNames[i] = name;
            creators[i] = creator;
        }
        console.log("Names:", workoutNames);
        console.log("IDs:", workoutIDs);
        console.log("Creators:", creators)
        res.send("Found workouts " + workoutNames + " || Found IDs " + workoutIDs + " || Creators " + creators);


    })

})

// searches programs to find a program that meets the user's requirements
app.get("/programs/search", (req,res) => {
    // hard coding in example for now
    `// default length to 0
    const length = req.body.numDays;
    // either >, <, or blank string; allows for user to search for program of certain length or greater/lesser length
    const comparer = req.body.comparer;
    // search can be the name of the program or the creator
    const search = req.body.searchBar;`

    const length = "60";
    const comparer = ">"
    const search = "some name";

    console.log("Searching for a program of length " + length + " with name " + search);
    const sql = "SELECT * FROM program WHERE (program_name = '" + search + "' OR program_creator = '" + search +
        "') AND length " + comparer + "= " + length;
    db.query(sql, (err, result) => {
        if (err) throw err;
        let programIDs = [];
        let programNames = [];
        let programCreators = [];
        let programLengths = [];
        for (let i = 0; i<result.length; i++){
            let program=result[i];
            programIDs.push(program["program_id"]);
            programNames.push(program["program_name"]);
            programCreators.push(program["program_creator"]);
            programLengths.push(program["length"]);
        }
        console.log("creators", programCreators);
        console.log("IDs", programIDs);
        console.log("names", programNames);
        console.log("lengths", programLengths);
        res.send("creators: " + programCreators + " IDs: " + programIDs + " | names: " + programNames +
            " | lengths" + programLengths);
    })
})

// finds all moves in a workout and workout metadata
// use workout10 as example
app.get("/workouts/moves/:workoutID", (req, res) => {
    const workoutID = req.params["workoutID"];

    const setSQL = "SELECT s.* FROM workout as w, `set` as s WHERE w.workout_id = '" + workoutID
        + "' AND s.workout_id = '" + workoutID + "'";
    db.query(setSQL, (err, result) => {
        if(err) throw err;
        let moveNames = [];
        let workoutmeta=[]
        for (let i =0; i<result.length; i ++){
            let moveName = result[i]['move_name'];
            moveNames.push(moveName);
        }
        const metaSQL = "SELECT * FROM workout_meta WHERE workout_id = '" + workoutID + "'";
        db.query(metaSQL, (err1, result1) => {
            if (err1) throw err1;
            for (let i=0; i<result1.length; i++){
                let meta = result1[i];
                let all = [meta['key'], meta['content']];
                workoutmeta.push(all);
            }
            console.log("Names", moveNames);
            console.log("Workout meta", workoutmeta)
            res.send("Names: " + moveNames + " | workout meta " + workoutmeta);
        })
    })
})

// finds all workouts in a program and program metadata
// program0 as test
app.get("/programs/workouts/:programID", (req, res) => {
    const programID = req.params["programID"];

    const programSQL = "SELECT c.workout_id, w.name FROM program_contains as c, workout as w WHERE program_id = '"
        + programID +"' AND w.workout_id = c.workout_id";
    db.query(programSQL, (err, result) => {
        if(err) throw err;
        let workoutIDs = [];
        let names = [];
        let programMeta=[];
        for (let i =0; i<result.length; i++){
            let workoutID = result[i]['workout_id'];
            let name = result[i]['name'];
            workoutIDs.push(workoutID);
            names.push(name);
        }
        const metaSQL = "SELECT * FROM program_meta WHERE program_id = '" + programID +"'";
        db.query(metaSQL, (err1, result1) => {
            if (err1) throw err1;
            for (let i=0; i<result1.length; i++){
                let meta = result1[i];
                let all = [meta['key'], meta['content']];
                programMeta.push(all);
            }
            console.log("WorkoutIds", workoutIDs)
            console.log("Names", names);
            console.log("Program meta", programMeta);
            res.send("Names: " + names + " | workout IDs: " + workoutIDs + " | Program metadata: " + programMeta);
        })
    })
})

// makes a new workout with x number of moves
app.get("/workouts/create", (req, res) =>{
    // function to make a workout, will be recursively called if a duplicate ID is used
    function makeWorkout(req, res){
        `// name of the workout
    const workoutName = req.body.workoutName;
    // list of move names
    const moves = req.body.moves;
    const username = req.body.username
    `

        // hard code in workout name and moves for now
        const workoutName = "Some name";
        // moves in format name, rep count, repetition. set num is the place in array
        const moves= [["move1", -1,-1], ["move2",-1,-1], ["move3",-1,-1]];
        const username = "user0"

        //randomly generate workoutID
        const workoutID= makeid(20);
        console.log("workout name:",workoutName)
        console.log("workout ID", workoutID)
        const sql = "INSERT INTO workout (workout_id, name, creator_user_name) VALUES ('" + workoutID + "', ' "
            + workoutName + "', '" + username + "')"
        db.query(sql, (err, result) => {
            if (err){
                // handle duplicate names;
                if (err.errno === 1062){
                    console.log("Duplicate entry");
                    // run again with same base params, workoutID will be randomly generated
                    makeWorkout(req, res);
                }
                else throw err;
            }
        })
        for(let i=0; i<moves.length;i++){
            let set = moves[i];
            let name = set[0];
            let repCount= set[1];
            let repetition = set[2];
            let moveSQL = "INSERT INTO `set` (workout_id, move_name, rep_count, repetition, set_num) VALUES ('"
                + workoutID + "', '" + name+ "'," + repCount + "," + repetition + "," + i + ")";
            db.query(moveSQL, (err, result) =>{
                if (err) throw err;
                console.log(result);
            })
        }
        res.send("Added workout with ID:" + workoutID + " and name " + workoutName);
    }
    makeWorkout(req, res);
})