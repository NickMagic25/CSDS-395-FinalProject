var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');

const app = express();
app.use(express.json());

app.listen('3000', () => {
    console.log("Server started on port 3000")
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
