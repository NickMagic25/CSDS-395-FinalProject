var express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const registerValidation = require("./validations/registerValidation");
const loginValidation = require("./validations/loginValidation");
const keys = require("./config/keys");
const CryptoJS = require("crypto-js");
const fetch=require('node-fetch-commonjs');


const app = express();
app.use(cors());
app.use(express.json());

const port = '5000'
const mailAPIURL="http://localhost:6000";

app.listen(port, () => {
    console.log("Server started on port " + port + "!");
    console.log("Go to localhost:" + port + " to start");
});

const db = mysql.createConnection({
    host: "csds-395-group4.co1rrt8vxy1n.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: 'admin',
    password: "superman",
    database: "insta-jacked",
    multipleStatements: true
})

// uses bcrypt hashing algorithim to hash a string
// salt length of 10
function hashString(string){
    return bcrypt.hashSync(string, 10);
}

function encrypt(text){
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
}

function decrypt(data){
    try{
        return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
    }
    catch (err){
        console.log(err);
    }
}

function isFriendsSQL(self, target){
    return "SELECT target_user FROM user_follow WHERE source_user="+ db.escape(self) + " AND target_user="+ db.escape(target)
        + " AND approved=true";
}

function doesFollow(self,target){
    return "SELECT source_user FROM user_follow WHERE source_user="+db.escape(self) + " AND target_user="+ db.escape(target);
}


function runSQL_NoResult(sql,res){
    db.query(sql, (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).json({ password: err.sqlMessage });
        }
        else{
            console.log(result)
            return res.json({status:'ok'})
        }
    })
}

// from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeID(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function now(){
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function findFriendsSQL(self){
    return "SELECT target_user FROM user_follow WHERE source_user = "
        + db.escape(self) + " AND approved = 1";
}

// // login to a user
app.post("/login", (req, res) => {
    const { errors, isValid } = loginValidation(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const username = req.body.username;
    const password = req.body.password;
    const hashedItemsSQL = "SELECT hashed_password FROM user WHERE user_name = " + db.escape(username);
    db.query(hashedItemsSQL, (error, items)=>{
        if(error) console.log(error);
        if(items[0]!=null) {
            let hashed_password=items[0]["hashed_password"]
            if(bcrypt.compareSync(password,hashed_password)){
                const sql = "SELECT * FROM user WHERE user_name = " + db.escape(username) + " AND hashed_password = "
                    + db.escape(hashed_password);
                const updateLastLoginSQL = "UPDATE user SET last_online = " + db.escape(now()) + " WHERE user_name = "
                    + db.escape(username);
                console.log(sql);
                db.query(sql, function (err, result) {
                    if (err) console.log(err);
                    db.query(updateLastLoginSQL, (err1, result1) => {
                        if (err1) console.log(err1);
                        console.log(result1);
                        console.log("updated last online")
                        console.log(result);
                    })

                    const payload = {
                        id: result.id,
                        username: result.username,
                      };
                      //sign token
                      jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: 31556926 },
                        (err, token) => {
                          res.json({
                            success: true,
                            toke: "Bearer" + token,
                          });
                        }
                      );
                })
            }
            else{
                console.log("Not a match");
                return res.status(400).json({ password: "incorrect password" });
            }
        }
        else return res.status(400).json({ password: "email or password does not exist" });
    })
})

// create an account
app.post("/register", (req, res) => {
    const { errors, isValid } = registerValidation(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    if (req.body.password.length < 3) {
        return res.status(400).json({ password: "password is too short" });
    }

    const username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    const firstName = req.body.firstName;
    const lastName= req.body.lastName;

    password = hashString(password);
    email = encrypt(email);
    console.log(password);
    console.log(email);
    const sql = "INSERT INTO user (user_name, first_name, last_name, mobile_number, email, hashed_password, " +
        "creation_date, last_online, intro) VALUES (" + db.escape(username) + ","+ db.escape(firstName) + "," + db.escape(lastName) + "," + 0 + ","
        + db.escape(email) + "," + db.escape(password) + "," + db.escape(now()) + "," + db.escape(now()) + ", NULL)";
    db.query(sql, function(err, result){
        if (err){
            // handle duplicate names;
            if (err.errno === 1062){
                console.log(err.sqlMessage);
                return res.status(400).json({ password: err.sqlMessage });
            }
            else {
                console.log(err);
                return res.status(400).json({ password: "Invalid submission" });
            }
        }
        else {
            console.log(result);
            res.send("Added user")
        }
    })
})

// finds users who userName is following
// for testing use user1 as username
app.get("/user/following/:username", (req, res) =>{
    const self = req.headers['username'];
    const target=req.params['username']

    let sql;
    if(self===target)
        sql = "SELECT target_user FROM user_follow WHERE approved = true AND source_user = " + db.escape(self);
    else
        sql="SELECT target_user FROM user_follow WHERE approved =true AND source_user="+ db.escape(target) + " AND "
            + db.escape(target) + " in " + isFriendsSQL(self,target)
    db.query(sql,function (err, result){
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

// finds all posts and comments that a user has interacted with
// for testing use user10
app.get("/user/interactions/:userName", (req, res) => {
    const target = req.params['userName'];
    const self = req.headers['username'];

    let sql;
    if(target===self)
        sql="SELECT c.post_id FROM post_comment c WHERE c.user_name ="+ db.escape(self)+ "; " +
            "SELECT p.post_id FROM post_like AS p WHERE p.user_name = " + db.escape(self);
    else
        sql = "SELECT c.post_id FROM post_comment AS c WHERE c.user_name = " + db.escape(target)
            + " AND " + db.escape(target) + " IN "+ isFriendsSQL(self,target) + "; " +
            "SELECT p.post_id FROM post_like AS p WHERE p.user_name = " + db.escape(target) + " AND "+ db.escape(target) + " IN "
            + isFriendsSQL(self,target);
    db.query(sql, function (err, result){
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})


// searches a username from either a name or creator username
app.get("/workouts/search", (req,res) => {
    // commenting out to hard code in a name
    const search = req.body.searchBar;

    console.log("Searching:", search);
    const sql = "SELECT name, workout_id, creator_user_name FROM workout WHERE name =" + db.escape(search) +
        " OR creator_user_name = " + db.escape(search);
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

// searches a username from either a name or creator username
app.get("/workouts/get", (req,res) => {
    const user = req.headers['username']

    // commenting out to hard code in a name
    const sql = "SELECT name, workout_id, day, creator_user_name FROM workout WHERE creator_user_name =" + db.escape(user);
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            return res.json({status: 'ok', workouts: result});
        }
    })
})

// searches programs to find a program that meets the user's requirements
app.get("/programs/search", (req,res) => {
    // default length to 0
    const length = req.body.numDays;
    // either >, <, or blank string; allows for user to search for program of certain length or greater/lesser length
    const comparer = req.body.comparer;
    // search can be the name of the program or the creator
    const search = req.body.searchBar;

    console.log("Searching for a program of length " + length + " with name " + search);
    const sql = "SELECT * FROM program WHERE (program_name = " + db.escape(search) + " OR program_creator = " + db.escape(search) +
        ") AND length " + comparer + "= " + db.escape(length);
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

// finds all moves in a workout and workout metadata
// use workout10 as example
app.get("/workouts/moves/:workoutID", (req, res) => {
    const workoutID = req.params["workoutID"];

    const SQL = "SELECT s.* FROM workout as w, `set` as s WHERE w.workout_id = " + db.escape(workoutID)
        + " AND s.workout_id = " + db.escape(workoutID) + "; SELECT * FROM workout_meta WHERE workout_id = " + db.escape(workoutID);
    db.query(SQL, (err, result) => {
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

// finds all workouts in a program and program metadata
// program0 as test
app.get("/programs/workouts/:programID", (req, res) => {
    const programID = req.params["programID"];

    const programSQL = "SELECT c.workout_id, w.name FROM program_contains as c, workout as w WHERE program_id = "
        + db.escape(programID) +" AND w.workout_id = c.workout_id";
    const metaSQL = "SELECT * FROM program_meta WHERE program_id = " + db.escape(programID);
    db.query(programSQL+ ";" + metaSQL, (err, result) => {
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

// makes a new workout with x number of moves
app.post("/workouts/create", (req, res) =>{
    // name of the workout
    const workoutName = req.body.name;
    const username = req.headers['username'];
    const id = req.body.id
    const day = req.body.day;

    const sql = "INSERT INTO workout (workout_id, name, creator_user_name, day) VALUES (" + db.escape(id) + ",  "
        + db.escape(workoutName) + ", " + db.escape(username) + ","+ db.escape(day) + " )";
    db.query(sql, (err, result) => {
        if (err){
            // handle duplicate names;
            if (err.errno === 1062){
                console.log("Duplicate entry");
                // run again with same base params, workoutID will be randomly generated
                return res.json({status:"duplicate"});
            }
            else {
                console.log(err);
                return res.json({status: "error"})
            }
        }
        console.log(result);
        return res.json({status:'ok'})
    })
})

app.post("/api/addSet", (req,res)=>{
    const workoutID=req.body.workoutId;
    const move_name=req.body.moveName;
    const rep_cont=req.body.rep;
    const repetition=req.body.set;
    const set_num=req.body.setNum;
    const id = req.body.set_id;

    

    console.log(workoutID);
    const sql= "INSERT INTO `set` (workout_id, move_name, rep_count, repetition, set_num, set_id) VALUES ("
        + db.escape(workoutID) + ", " + db.escape(move_name)+ "," + db.escape(rep_cont) + "," + db.escape(repetition)
        + "," + db.escape(set_num) + ", " + db.escape(id) + ")";
    db.query(sql, (err, result)=>{
        if (err){
            console.log(err)
            return res.json({status: "error"})
            // run again with same base params, new setID will be randomly generated
        }
        else {
            console.log(result);
            return res.json({status:'ok'})
        }
    })
})

// creates a program
app.post("/programs/create", (req, res) =>{
    const programName = req.body.name;
    const creator = req.body.username;
    const description = req.body.description;
    const workouts= req.body.workoutList;
    // workoutList in format [id1, id2, id3 ...., idN] where the day of is the index (first index is 1)

    function makeProgram(){
        const programID = makeID(20);
        const sql = "INSERT INTO program (program_id, program_name, program_creator, description) VALUES ("
            + db.escape(programID) + ", " + db.escape(programName) + ", " + db.escape(creator) + ", "+ db.escape(description) + ")"
        db.query(sql, (err, result) =>{
            if(err){
                if (err.errno === 1062){
                    console.log("Duplicate entry, rerun with new programID")
                    makeProgram();
                }
                else {
                    console.log(err);
                    res.send(null)
                }
            }
            else{
                console.log(result);
                for(let i=0; i<workouts.length;i++){
                    let id = workouts[i];
                    let dayOf=i+1;
                    let workoutsSQL = "INSERT INTO program_contains (program_id, workout_id, day_of) " +
                        "VALUES ("+db.escape(programID)+","+db.escape(id)+","+db.escape(dayOf)+")";
                    db.query(workoutsSQL, (err, result) =>{
                        if (err) {
                            console.log(err);
                            res.send(null);
                        }
                        else {
                            console.log(result);
                            res.send(result);
                        }
                    })}
            }
            res.send(null);
        })
    }
    makeProgram()
})

// creates a message group from a given name and creator username
app.post("/messages/creategroup", (req, res) =>{
    const username = req.body.username;
    const name = req.body.name;

    // function to run again in case of duplicate user ID
    function makeMessageGroup(){
        const id = makeID(20)
        const sql = "INSERT INTO message_group (group_id, group_name, creator, creation_time) VALUES (" + db.escape(id) + ", "
            + db.escape(name) + ", " + db.escape(username) + ", " + db.escape(now()) + ")";
        const adminSQL = "INSERT INTO message_group_member (group_ID, user_name, join_date, admin_level) VALUES " +
            "(" + db.escape(id) + ", " + db.escape(username) + ", " + db.escape(now()) + ", 3)";
        db.query(sql, (err, result) =>{
            if(err){
                if (err.errno === 1062){
                    console.log("Duplicate entry, rerun with new groupID")
                    makeMessageGroup();
                }
                else{
                    console.log(err);
                    res.send(null)
                }
            }
            else{
                console.log(result);
                db.query(adminSQL, (err1, result1)=>{
                        if (err1) {
                            console.log(err1);
                            res.send(null);
                        }
                        else {
                            console.log(result1);
                            res.send(result1);
                        }
                    }
                )
            }
        })
    }
    makeMessageGroup();
})

// finds all messages in a message group if the username is a member of the group
// for testing use user99 and groupid goldfish
app.get("/messages/:groupID", (req,res) =>{
    const groupID = req.params['groupID'];
    const username = req.headers['username'];

    const membersSQl="SELECT user_name FROM message_group_member WHERE group_ID = " + db.escape(groupID);
    const sql = "SELECT content, sender, send_time FROM message WHERE group_id = " + db.escape(groupID) + " AND "
        + db.escape(username) + " in (" + membersSQl + ") ORDER BY send_time DESC";
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            return res.status(400).json({ password: err.sqlMessage });
        }
        else {
            console.log(result);
            return res.json({status: 'ok', messages: result});
        }
    })
})

// user starts a program with a given userID
app.post("/programs/start/:programID", (req,res) =>{
    const programID = req.params["programID"];
    const username = req.headers['username'];

    // check to see if a user is already doing the program
    const checkSQL = "SELECT * from completing_program WHERE program_id = "
        + db.escape(programID) + " AND user_name = " + db.escape(username) + " and completed = 0";
    db.query(checkSQL, (err1, result1)=>{
        if(err1){
            console.log(err1);
            res.send(null);
        }
        // if user is not currently doing that program, start the program
        else if (result1[0]=== undefined){
            const sql = "INSERT INTO completing_program (program_id, user_name, date_started) VALUES ("
                + db.escape(programID) + ","+ db.escape(username) + "," + db.escape(now()) + ")";
            db.query(sql, (err, result)=>{
                if (err) {
                    console.log(err);
                    res.send(null);
                }
                else {
                    console.log(result);
                    res.send(result);
                }
            })
        }
        // else the user is already doing that program
        else
            res.send(null);
    })
})

// gets all workouts a user has to do on a given day
app.get("/today", (req, res) =>{
    const username = req.headers['username'];

    const sql ="SELECT w.*, m.program_id as program_id, m.program_name as program_name FROM program_contains as c, " +
        "workout as w, (SELECT * FROM completing_program WHERE user_name = " + db.escape(username) +" AND completed = 0) as p," +
        " program as m WHERE c.day_of = p.day_of_program AND c.program_id=p.program_id and c.workout_id=w.workout_id " +
        "AND m.program_id = c.program_id"
    db.query(sql, (err, result)=>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

// find all sets in a workout
app.get("/workouts/:workoutID", (req,res) =>{
    const workoutID = req.params["workoutID"];
    const sql = "SELECT set_num, move_name, rep_count, repetition FROM `set` WHERE workout_id = " + db.escape(workoutID)+";";
    const nameSQL="SELECT name FROM workout WHERE workout_id="+db.escape(workoutID);

    db.query(sql+nameSQL, (err, result) =>{
        if (err) {
            console.log(err);
            return res.json({ status: 'error' })
        }
        else {
            console.log(result);
            return res.json({ status: 'ok', exercises: result })
        }
    })
})

app.get("/workouts/workoutName/:workoutID", (req,res) =>{
    const workoutID = req.params["workoutID"];
    const sql = "SELECT name FROM workout WHERE workout_id = " + db.escape(workoutID) ;

    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            return res.json({ status: 'error' })
        }
        else {
            console.log(result);
            return res.json({ status: 'ok', name: result })
        }
    })
})

// adds a user to a message group if above admin level 2
app.post("/api/messages/addmember/:groupID", (req,res) =>{
    const groupID = req.params['groupID'];
    const username= req.header['username'];
    const targetUser = req.body.targetuser

    const checkSQL="SELECT * FROM message_group_member WHERE group_id = " + db.escape(groupID) + " AND user_name=" + db.escape(targetUser);
    const insertSQL = "INSERT INTO message_group_member (group_ID, user_name, join_date) " +
        "SELECT " + db.escape(groupID) + ", " + db.escape(targetUser) + ", " + db.escape(now()) + " FROM message_group_member " +
        "WHERE "+ db.escape(username) + " = user_name AND group_ID = " + db.escape(groupID) + " AND admin_level>=2";
    // check to see if user is already in the group
    db.query(checkSQL, (err, result)=>{
        if(err){
            console.log(err);
            res.send(null);
        }
        else if (result[0] === undefined){
            db.query(insertSQL, (err1, result1) =>{
                if (err1) {
                    console.log(err1);
                    res.send(null);
                }
                else {
                    console.log(result1);
                    res.send(result1);
                }
            })
        }
        else res.send("Unable to add " + targetUser + " to the group")
    })
})

// completes a workout, increments program by one if workout is a part of a program the user is doing
app.post("/workouts/:workoutID/completed", (req, res) =>{
    const workoutID = req.params["workoutID"];
    const username = req.headers['username'];

    // SQL for completing the workout
    const completionSQL="INSERT INTO completed_workout (workout_id, user_name, date_completed) VALUES (" + db.escape(workoutID)
        + ", " + db.escape(username) + ", " + db.escape(now()) + ")";
    // SQL for finding if the workout is a part of a program the USER is doing and if they're doing it on the day of the program
    const programIDSQL = "SELECT c.program_id FROM completing_program as c, program_contains as p WHERE " +
        "c.program_id = p.program_id AND c.user_name = "+ db.escape(username) +" AND p.workout_id = "+ db.escape(workoutID)+
        " AND c.day_of_program = p.day_of"
    db.query(completionSQL, (err, result)=>{
        if(err){
            console.log(err);
            return res.status(400).json({ password: err.sqlMessage })
        }
        else{
            console.log(result);
            db.query(programIDSQL, (err1, result1) =>{
                if(err1){
                    console.log(err);
                    res.send(null);
                }
                else if(result1[0] !== undefined){
                    let programID = result1[0]["program_id"];
                    // sql to update the program
                    const updateSQL = "UPDATE completing_program SET day_of_program = day_of_program + 1 WHERE program_id = "
                        + db.escape(programID) + " AND user_name = " + db.escape(username);
                    db.query(updateSQL, (err2, result2)=>{
                        if (err2) {
                            console.log(err2);
                            return res.status(400).json({ password: err.sqlMessage });
                        }
                        else {
                            console.log(result2);
                            return res.json({password: "ok"});
                        }
                    })
                }
                else
                    return res.status(400).json({ password: "ok"})
            })
        }
    })
})

app.get("/api/findFrinedsWorkouts", (req,res)=>{
    const username=req.headers['username'];

    const sql="SELECT * FROM completed_workout WHERE (user_name in ("+ findFriendsSQL(username)+ ") OR user_name="+ db.escape(username) +")";
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            return res.json({status: 'ok', workouts: result});
        }
    })
})
app.get("/api/findFriendsMoves", (req,res)=>{
    const username=req.headers['username'];

    const sql="SELECT * FROM completed_move WHERE (user_name in (" + findFriendsSQL(username) + ") OR user_name="+ db.escape(username) +")";
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            return res.json({status: 'ok', moves: result});
        }
    })
})

app.get("/api/getPosts", (req,res)=>{
    const username=req.headers['username'];

    const sql= "SELECT post.* FROM user_post as post WHERE (post.user_name in ("+ findFriendsSQL(username)
        +") OR post.user_name="+ db.escape(username)+") ORDER BY post.created_at DESC";
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            return res.json({status: 'ok', posts: result});
        }
    })
})

app.get("/api/postComments", (req,res)=>{
    const username=req.headers['username'];
    const postID=req.body.postID;

    const sql="SELECT c.* FROM post_comment c, user_post up WHERE c.post_id=up.post_id AND up.post_id="+ db.escape(postID) +
        " AND (up.user_name in (SELECT target_user FROM user_follow WHERE source_user="+ db.escape(username) +" AND target_user="+
        "up.user_name AND approved=true) OR up.user_name= "+ db.escape(username)+ ")";
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            return res.status(400).json({ password: err.sqlMessage });
        }
        else {
            console.log(result);
            return res.json({status: 'ok', comments: result});
        }
    })
})

// Sends message to a message group
app.post("/messages/:groupID" , (req,res) =>{
    
    const groupID = req.params.groupID;
    const userName = req.headers['username'];
    const message = encrypt(req.body.message);
    const message_id=req.body.message_id

    const insertSQL= "INSERT INTO message(group_id, content, sender, send_time, id) SELECT " + db.escape(groupID) + ", "
        + db.escape(message) + ", " + db.escape(userName) + ", " + db.escape(now()) +", "+ db.escape(message_id) + " FROM"
        +" message_group_member WHERE user_name = " + db.escape(userName) + " AND group_ID="+ db.escape(groupID);
    db.query(insertSQL, async (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({password: err.sqlMessage})
        } else {
            console.log(result);
            const send = await fetch(mailAPIURL + '/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'username': userName,

                },
                body: JSON.stringify({
                    username:userName,
                    groupID: groupID,
                    message: message
                }),
            })
            return res.json({status: 'sent'});
        }
    })
})

// Find posts from a given user
app.get("/posts/:target", (req,res) => {
    const targetUser = req.params["target"];
    const username = req.headers['username'];
    let sql;
    if(targetUser === username){
        sql="SELECT * FROM user_post WHERE user_name="+ db.escape(username);
    }
    else{
        sql = "SELECT up.* FROM user_post up WHERE up.user_name in "+ isFriendsSQL(username, targetUser)
            + "OR up.user_name in " + "(SELECT user_name from user WHERE up.user_name="+ db.escape(targetUser)
            +" AND private_account=0)";
    }
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})

// Find moves a given user has done
app.get("/moves/done/:userName", (req,res) => {
    const target = req.params["userName"];
    const self= req.headers['username'];

    let sql;
    if(target===self)
        sql="SELECT * FROM completed_move WHERE user_name="+ db.escape(self);
    else
        sql="SELECT * FROM completed_move WHERE user_name="+ db.escape(target) +" AND "+ db.escape(target) + " in "
            + isFriendsSQL(self, target);
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            res.send(result);
        }
    })
})


// sends a friend request to a user
// source: user
// target: other user
// auto accepts if public account
app.post("/api/addFriend", (req,res)=>{
    console.log(req.body);
    const target= req.body.body.target;
    const source= req.body.headers['username'];

    console.log("Self",source);
    console.log("target",target);
    const sql = "INSERT INTO user_follow (source_user, target_user, follow_time, approved) SELECT "+ db.escape(source)
    +", "+ db.escape(target) +","+ db.escape(now()) +", not user.private_account as approved FROM user WHERE user_name="+ db.escape(target) +"";

    return runSQL_NoResult(sql,res);
})

// accepts friend requests sent to you
// target: user
// source: other user
app.post("/api/acceptFriend", (req,res)=>{
    const target=req.headers['username'];
    const source= req.body.source;

    const sql="UPDATE user_follow SET approved=true WHERE source_user="+ db.escape(source) + " and target_user="+ db.escape(target)
        +" AND follow_time="+ db.escape(now());

    return runSQL_NoResult(sql,res);
})

// removes someone you're following or someone following you
app.post("/api/removeFriend", (req,res)=>{
    const source=req.body.headers['username'];
    const target=req.body.body.target;

    const sql="DELETE FROM user_follow WHERE source_user="+ db.escape(source) +" and target_user=" + db.escape(target);

    return runSQL_NoResult(sql,res);
})

app.delete("/api/deletePost",(req,res)=>{
    const username=req.headers['username'];
    const postID=req.body.postID;

    const sql="DELETE FROM user_post WHERE post_id="+ db.escape(postID) +" AND user_name="+ db.escape(username);

    return runSQL_NoResult(sql,res);
})

app.delete("/api/deleteComment", (req,res)=>{
    const username=req.headers['username'];
    const commentID=req.body.commentID;

    const sql="DELETE FROM post_comment WHERE comment_id="+ db.escape(commentID)+ " AND user_name="+ db.escape(username);

    return runSQL_NoResult(sql,res);
})

app.delete("/api/deleteWorkout", (req,res)=>{
    const username=req.headers['username'];
    const workout_id=req.body.workoutID;

    const sql="DELETE FROM 'set' WHERE workout_id="+ db.escape(workout_id) +
        " AND true IN (SELECT true FROM workout WHERE workout_id= "+ db.escape(workout_id) +" AND creator_user_name="+ db.escape(username)
    +"); DELETE FROM workout WHERE workout_id="+ db.escape(workout_id) +" AND creator_user_name="+ db.escape(username);

    return runSQL_NoResult(sql,res);
})

app.delete("/api/deleteSet", (req,res)=>{
    const username=req.headers['username'];
    const workout_id=req.body.workoutID;
    const set_id=req.body.setID;

    const sql="DELETE FROM 'set' WHERE set_id="+ db.escape(set_id) +" AND true IN (SELECT true FROM workout WHERE workout_id= "
        + db.escape(workout_id) +" AND creator_user_name="+ db.escape(username) +")";

    return runSQL_NoResult(sql,res);

})

app.post("/api/makePost", (req, res)=>{
    const username=req.headers['username'];
    const post_id=req.body.postID;
    const text=req.body.text;
    const workout_id=req.body.workoutID


    const sql= "INSERT INTO user_post (post_id, user_name, message, created_at, workout_ID) VALUES ("+ db.escape(post_id) + ","
        + db.escape(username) + ", " + db.escape(text) + ", " + db.escape(now()) + ", "+ db.escape(workout_id) +")";


    return runSQL_NoResult(sql,res);
})

// gets all public info of a user
app.get("/api/getUser/:target",(req,res)=> {
    const target = req.params['target'];

    const sql = "SELECT user_name, first_name, last_name, intro, bench, deadlift, squat, weight FROM user " +
        "WHERE user_name="+ db.escape(target);
    console.log(sql);
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else if(result[0]===undefined){
            return res.json({status:'unable to access profile'});
        }
        else {
            console.log(result);
            return res.json({status: 'ok', profile: result});
        }
    })
})

// makes a user's account private
app.post("/api/setPrivateAccount", (req,res)=>{
    const username=req.headers['username'];

    const sql="UPDATE user SET private_account=true WHERE user_name="+ db.escape(username);
    return runSQL_NoResult(sql,res);
})

app.post("/api/setPublicAccount",(req,res)=>{
    const username=req.headers['username'];

    const sql="UPDATE user SET private_account=false WHERE user_name="+ db.escape(username);
    return runSQL_NoResult(sql,res);
})

app.get("/api/isFriend/:target", (req,res)=>{
    const source=req.headers["username"];
    const target = req.params['target'];

    const sql= "SELECT DISTINCT TRUE AS r WHERE ? IN ("+ isFriendsSQL(source,target) +")";
    db.query(sql, [target], (err, result) =>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else if(result[0]===undefined){
            return res.json({status:'unable to access profile', isFriend:JSON.stringify([{r:0}])});
        }
        else {
            console.log(result);
            return res.json({status: 'ok', isFriend: result});
        }
    })
})

app.get("/api/allFriends",(req,res)=>{
    const source=req.headers['username'];

    const sql="SELECT uf.target_user, u.first_name, u.last_name, u.bench, u.squat, u.deadlift, u.weight FROM user_follow uf, user u WHERE uf.source_user="
        + db.escape(source) + " AND uf.approved=true AND u.user_name=uf.target_user";
    db.query(sql, (err, result) =>{
        if (err) {
            console.log(err);
            res.send(null);
        }
        else {
            console.log(result);
            return res.json({status: 'ok', friends: result});
        }
    })
})

app.post("/api/updateUser", (req,res)=>{
    console.log(req.body);
    const source=req.headers['username'];
    const bench=req.body.bench;
    const deadlift= req.body.deadlift;
    const squat= req.body.squat;
    const weight= req.body.weight;
    const sql="UPDATE user SET bench=" + db.escape(bench) + ", deadlift=" + db.escape(deadlift) + ", squat="
        + db.escape(squat) + ", weight = "+ weight +" WHERE user_name=" + db.escape(source);
    console.log(sql);
    return runSQL_NoResult(sql,res);
})