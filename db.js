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
        if (err) throw err;
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


// searchs a username from either a name or creator username
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
