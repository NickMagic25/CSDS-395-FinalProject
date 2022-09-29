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

app.get("/login", (reg, res) =>{
    // hard code information in for now
    `const username = reg.body.username;
    const email = reg.body.username;
    const number  = reg.body.username;
    const password = reg.body.password;`
    const username = "user0"
    const email = "0@gmail.com"
    const number = "0"
    const password = "secure password"
    const sql = "SELECT * FROM user WHERE (user_name = '" + username + "' OR email = '" + email + "' or mobile_number "+
        "= '" + number + "') AND hashed_password = '" + password + "'";
    db.query(sql, function(err, result){
        if (err) throw err;
        console.log(result);
        res.send("Found user0")
})});
