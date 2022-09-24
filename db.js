var mysql = require('mysql');

const connection = mysql.createConnection({
    host: "csds-395-group4.co1rrt8vxy1n.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: 'admin',
    password: "superman",
    database: "insta-jacked"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("mysql connected");
})


module.exports = connection;