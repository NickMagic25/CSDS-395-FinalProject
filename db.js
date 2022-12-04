var express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const registerValidation = require("./validations/registerValidation");
const loginValidation = require("./validations/loginValidation");
const keys = require("./config/keys");
const CryptoJS = require("crypto-js");


const app = express();
app.use(cors());
app.use(express.json());

const port = '5000'

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
    return "SELECT target_user FROM user_follow WHERE source='"+ self + "' AND target_user='"+ target
        + "' AND approved=true";
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
app.post("/login", (req, res) => {
    const { errors, isValid } = loginValidation(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const username = req.body.username;
    const password = req.body.password;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hashedItemsSQL = "SELECT hashed_password, email FROM user WHERE user_name = '" + username + "'";
    db.query(hashedItemsSQL, (error, items)=>{
        console.log(items)
        if(error) throw error;
        if(items[0]!=null) {
            let hashed_password=items[0]["hashed_password"]
            if(bcrypt.compareSync(password,hashed_password)){
                const sql = "SELECT * FROM user WHERE user_name = '" + username + "' AND hashed_password = '"
                    + hashed_password + "'";
                const updateLastLoginSQL = "UPDATE user SET last_online = '" + now + "' WHERE user_name = '"
                    + username + "'";
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

    const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    password = hashString(password);
    email = encrypt(email);
    console.log(password);
    console.log(email);
    const sql = "INSERT INTO user (user_name, first_name, last_name, mobile_number, email, hashed_password, " +
        "creation_date, last_online, intro) VALUES ('" + username + "','"+ firstName + "','" + lastName + "','" + 0 + "','"
        + email + "','" + password + "','" + creationDate + "','" + creationDate + "', NULL)";
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
        sql = "SELECT target_user FROM user_follow WHERE approved = true AND source_user = '" + self + "'";
    else
        sql="SELECT target_user FROM user_follow WHERE approved =true AND source_user='"+ target + "' AND '"
            + target + "' in " + isFriendsSQL(self,target)
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
        sql="SELECT c.post_id FROM post_comment c WHERE c.user_name ='"+ self+ "'; " +
            "SELECT p.post_id FROM post_like AS p WHERE p.user_name = '" + self + "'";
    else
        sql = "SELECT c.post_id FROM post_comment AS c WHERE c.user_name = '" + target
            + "' AND '" + target + "' IN "+ isFriendsSQL(self,target) + "; " +
            "SELECT p.post_id FROM post_like AS p WHERE p.user_name = '" + target + "' AND '"+ target + "' IN "
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
    const sql = "SELECT name, workout_id, creator_user_name FROM workout WHERE name ='" + search +
        "' OR creator_user_name = '" + search + "'";
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
    const sql = "SELECT name, workout_id, day, creator_user_name FROM workout WHERE creator_user_name ='" + user + "'";
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
    const sql = "SELECT * FROM program WHERE (program_name = '" + search + "' OR program_creator = '" + search +
        "') AND length " + comparer + "= " + length;
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

    const SQL = "SELECT s.* FROM workout as w, `set` as s WHERE w.workout_id = '" + workoutID
        + "' AND s.workout_id = '" + workoutID + "'; SELECT * FROM workout_meta WHERE workout_id = '" + workoutID + "'";
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

    const programSQL = "SELECT c.workout_id, w.name FROM program_contains as c, workout as w WHERE program_id = '"
        + programID +"' AND w.workout_id = c.workout_id";
    const metaSQL = "SELECT * FROM program_meta WHERE program_id = '" + programID +"'";
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

    const sql = "INSERT INTO workout (workout_id, name, creator_user_name, day) VALUES ('" + id + "', ' "
        + workoutName + "', '" + username + "','"+ day + "' )"
    db.query(sql, (err, result) => {
        if (err){
            // handle duplicate names;
            if (err.errno === 1062){
                console.log("Duplicate entry");
                // run again with same base params, workoutID will be randomly generated
                makeWorkout();
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
    const sql= "INSERT INTO `set` (workout_id, move_name, rep_count, repetition, set_num, set_id) VALUES ('"
        + workoutID + "', '" + move_name+ "'," + rep_cont + "," + repetition + "," + set_num + ", '" + id + "')";
    db.query(sql, (err, result)=>{
        if (err){
            return res.json({status: "error"})
            // run again with same base params, new setID will be randomly generated
        }
        else {
            console.log(err);
            return res.json({status:'ok'})
        }
        console.log(result)
        res.send(true);
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
        const programID = makeid(20);
        const sql = "INSERT INTO program (program_id, program_name, program_creator, description) VALUES ('"
            + programID + "', '" + programName + "', '" + creator + "', '"+ description + "')"
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
                    let workoutsSQL = "INSERT INTO program_contains (program_id, workout_id, day_of) VALUES ('"+programID+"','"+id+"',"+dayOf+")";
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
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // function to run again in case of duplicate user ID
    function makeMessageGroup(){
        const id = makeid(20)
        const sql = "INSERT INTO message_group (group_id, group_name, creator, creation_time) VALUES ('" + id + "', '"
            + name + "', '" + username + "', '" + now + "')"
        const adminSQL = "INSERT INTO message_group_member (group_ID, user_name, join_date, admin_level) VALUES " +
            "('" + id + "', '" + username + "', '" + now + "', 3)";
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

    const membersSQl="SELECT user_name FROM message_group_member WHERE group_ID = '" + groupID + "'";
    const messageSQL = "SELECT content, sender, send_time FROM message WHERE group_id = '" + groupID + "' AND '"
        + username + "' in (" + membersSQl + ")";
    db.query(messageSQL, (err, result) =>{
        if(err){
            console.log(err);
            res.send(null);
        }
        else if(result[0] === undefined)
            res.send("Group does not exists or not a member of group");
        else{
            console.log(result);
            res.send(result);
        }
    })
})

// user starts a program with a given userID
app.post("/programs/start/:programID", (req,res) =>{
    const programID = req.params["programID"];
    const username = req.headers['username'];

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // check to see if a user is already doing the program
    const checkSQL = "SELECT * from completing_program WHERE program_id = '"
        + programID + "' AND user_name = '" + username + "' and completed = 0";
    db.query(checkSQL, (err1, result1)=>{
        if(err1){
            console.log(err1);
            res.send(null);
        }
        // if user is not currently doing that program, start the program
        else if (result1[0]=== undefined){
            const sql = "INSERT INTO completing_program (program_id, user_name, date_started) VALUES ('"
                + programID + "','"+ username + "','" + now + "')";
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
        "workout as w, (SELECT * FROM completing_program WHERE user_name = '" + username +"' AND completed = 0) as p," +
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
    const sql = "SELECT set_num, move_name, rep_count, repetition FROM `set` WHERE workout_id = '" + workoutID + "'";

    db.query(sql, (err, result) =>{
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

// adds a user to a message group if above admin level 2
app.post("/messages/addmember/:groupID", (req,res) =>{
    const groupID = req.params['groupID'];

    // hard code in for now
    const username= req.body.username;
    const targetUser = req.body.targetuser

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const checkSQL="SELECT * FROM message_group_member WHERE group_id = '" + groupID + "' AND user_name='" + targetUser + "'";
    const insertSQL = "INSERT INTO message_group_member (group_ID, user_name, join_date) " +
        "SELECT '" + groupID + "', '" + targetUser + "', '" + now + "' FROM message_group_member " +
        "WHERE '"+ username + "' = user_name AND group_ID = '" + groupID + "' AND admin_level>=2";
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

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // SQL for completing the workout
    const completionSQL="INSERT INTO completed_workout (workout_id, user_name, date_completed) VALUES ('" + workoutID
        + "', '" + username + "', '" + now + "')";
    // SQL for finding if the workout is a part of a program the USER is doing and if they're doing it on the day of the program
    const programIDSQL = "SELECT c.program_id FROM completing_program as c, program_contains as p WHERE " +
        "c.program_id = p.program_id AND c.user_name = '"+ username +"' AND p.workout_id = '"+ workoutID+ "' " +
        "AND c.day_of_program = p.day_of"
    db.query(completionSQL, (err, result)=>{
        if(err){
            console.log(err);
            res.send(null);
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
                    const updateSQL = "UPDATE completing_program SET day_of_program = day_of_program + 1 WHERE program_id = '"
                        + programID + "' AND user_name = '" + username + "'";
                    db.query(updateSQL, (err2, result2)=>{
                        if (err2) {
                            console.log(err2);
                            res.send(null);
                        }
                        else {
                            console.log(result2);
                            res.send(result2);
                        }
                    })
                }
                else
                    res.send(null);
            })
        }
    })
})

// Gets everything for the landing page
app.get("/", (req,res)=>{
    const username = req.headers['username'];


    const findFriendsSQL= "SELECT target_user FROM user_follow WHERE source_user = '" + username + "' AND approved = 1";
    const friendsMovesSQL= "SELECT * FROM completed_move WHERE user_name in (" + findFriendsSQL + ")";
    const friendWorkoutsSQL= "SELECT * FROM completed_workout WHERE user_name in (" + findFriendsSQL + ")";
    const postSQL = "SELECT post.* FROM user_post as post WHERE post.user_name in ("+ findFriendsSQL +")";
    const commentSQL = "SELECT comment.* FROM post_comment as comment,("+ postSQL + ") as p WHERE " +
        "p.post_id = comment.post_id";

    db.query(friendsMovesSQL + ";" + friendWorkoutsSQL+ ";" +postSQL+ ";" + commentSQL, (err, result)=>{
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

// Sends message to a message group
app.post("/messages/:groupID" , (req,res) =>{
    
    const groupID = req.params.groupID;
    const userName = req.headers['username'];
    const message = req.body.message;
    
    //Date and time
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const insertSQL= "INSERT INTO message(group_id, content, sender, send_time) SELECT '" + groupID + "', '" + message +
        "', '" + userName + "', '" + now +"' FROM message_group_member WHERE user_name = '"+ userName +
        "' AND group_ID='"+ groupID + "'" ;
    db.query(insertSQL, (err, result)=>{
        if (err) {
            console.log(err);
            return res.status(400).json({ password: err.sqlMessage })
        }
        else {
            console.log(result);
            return res.status(400).json({ password: err.sqlMessage })
        }
    })
})

// Find posts from a given user
app.get("/posts/:target", (req,res) => {
    const targetUser = req.params["target"];
    const username = req.headers['username'];
    let sql;
    if(targetUser === username){
        sql="SELECT * FROM user_post WHERE user_name='"+ username +"'";
    }
    else{
        sql = "SELECT up.* FROM user_post up WHERE up.user_name in "+ isFriendsSQL(username, targetUser)
            + "OR up.user_name in " + "(SELECT user_name from user WHERE up.user_name='"+ targetUser
            +"' AND private_account=0)";
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

// Find comments to a given post
app.get("/comments/:postKey", (req,res) => {
    const postkey = req.params["postKey"];

    const sql = "SELECT DISTINCT pc.message FROM user-post up, post_meta pm, post_comment pc WHERE up.post_id = pm.post_id AND up.post_id = pc.post_id AND pm.key = '" + postkey + "'";
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

// Find likes to a given comment
app.get("/comments/likes/:message", (req,res) => {
    const message = req.params["message"];

    const sql = "SELECT COUNT(cl.comment_id) FROM post_comment pc, comment_like cl WHERE pc.comment_id = cl.comment_id AND pc.message LIKE '" + message +"'";
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
        sql="SELECT * FROM completed_move WHERE user_name='"+ self +"'";
    else
        sql="SELECT * FROM completed_move WHERE user_name='"+ target +"' AND '"+ target + "' in "
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
    const target= req.body.target;
    const source= req.headers['username'];

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = "INSERT INTO user_follow (source_user, target_user, follow_time, approved) SELECT " +
        "'"+ source +"', '"+ target +"','"+ now +"', not user.private_account FROM user WHERE user_name=''";

    return runSQL_NoResult(sql,res);
})

// accepts friend requests sent to you
// target: user
// source: other user
app.post("/api/acceptFriend", (req,res)=>{
    const target=req.headers['username'];
    const source= req.body.source;

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql="UPDATE user_follow SET approved=true WHERE source_user='"+ source + "' and target_user='"+ target
        +"' AND follow_time='"+ now +"'";

    return runSQL_NoResult(sql,res);
})

// removes someone you're following or someone following you
app.delete("/api/removeFriend", (req,res)=>{
    const source=req.body.source;
    const target=req.body.target;

    const sql="DELETE FROM user_follow WHERE source_user='"+ source +"' and target_user='" + target + "'";

    return runSQL_NoResult(sql,res);
})

app.delete("/api/deletePost",(req,res)=>{
    const username=req.headers['username'];
    const postID=req.body.postID;

    const sql="DELETE FROM user_post WHERE post_id='"+ postID +"' AND user_name='"+ username + "'";

    return runSQL_NoResult(sql,res);
})

app.delete("/api/deleteComment", (req,res)=>{
    const username=req.headers['username'];
    const commentID=req.body.commentID;

    const sql="DELETE FROM post_comment WHERE comment_id='"+ commentID+ "' AND user_name='"+ username +"'";

    return runSQL_NoResult(sql,res);
})

app.delete("/api/deleteWorkout", (req,res)=>{
    const username=req.headers['username'];
    const workout_id=req.body.workoutID;

    const sql="DELETE FROM 'set' WHERE workout_id='"+ workout_id +
        "' AND true IN (SELECT true FROM workout WHERE workout_id= '"+ workout_id +"' AND creator_user_name='"+ username
    +"'); DELETE FROM workout WHERE workout_id='"+ workout_id +"' AND creator_user_name='"+ username +"'";

    return runSQL_NoResult(sql,res);
})

app.delete("/api/deleteSet", (req,res)=>{
    const username=req.headers['username'];
    const workout_id=req.body.workoutID;
    const set_id=req.body.setID;

    const sql="DELETE FROM 'ser' WHERE set_id='"+ set_id +"' AND true IN (SELECT true FROM workout WHERE workout_id= '"
        + workout_id +"' AND creator_user_name='"+ username +"')";

    return runSQL_NoResult(sql,res);

})
