const mysql = require("mysql");

function findUser(username, email, number, password) {
    const sql = "SELECT * FROM user WHERE (user_name = '" + username + "' OR email = '" + email + "' or mobile_number "+
        "= '" + number + "') AND hashed_password = '" + password + "'";
    const connection = mysql.createConnection({
        host: "csds-395-group4.co1rrt8vxy1n.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: 'admin',
        password: "superman",
        database: "insta-jacked"
    })
    connection.connect(function(err){
        if (err) throw err;
        connection.query(sql, function(err, result, fields){
            if (err) throw err;
            console.log(result);
        })
    })
}

findUser("user0", "0@gmail.com", "0", "secure password");