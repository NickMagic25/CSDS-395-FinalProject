const mysql = require('mysql');
const express = require('express');
const sendgrid = require('@sendgrid/mail');
const cors = require("cors");
const send = require("@sendgrid/mail");
const CryptoJS = require("crypto-js");
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

const app=express();
app.use(cors());
app.use(express.json());
const port=5001;

app.listen(port, () =>{console.log('listening on port ' + port)});


const SENDGRID_API_KEY="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"
sendgrid.setApiKey(SENDGRID_API_KEY)

const db = mysql.createConnection({
    host: "csds-395-group4.co1rrt8vxy1n.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: 'admin',
    password: "superman",
    database: "insta-jacked",
    multipleStatements: true
})


function sendMessage(receiver, subject, message){
    console.log(receiver, subject, message);
    const msg = {
        to: receiver,
        from: 'insta-jacked@mail.com',
        // Change to your verified sender
        subject: subject,
        text: message,
    }
    sendgrid
        .send(msg)
        .then((resp) => {
            console.log('Email sent\n', resp)
        })
        .catch((error) => {
            console.error(error)
        })
}

function sqlHandler(sql, message, subject, res){
    db.query(sql, (err, result)=>{
        if(err){
            console.log(err);
            return res.status(400).json({ password: err.sqlMessage });
        }
        else{
            for(const i in result){
                let email = decrypt(result[i]['email']);
                sendMessage(email, subject, message);
            }
        }
        return res.json({ status:'ok'});
    })
}

app.post("/api/message", (req,res)=>{
    const senderUserName = req.body.username;
    const groupID = req.body.groupID;
    const groupName= req.body.groupName;
    const message = req.body.message;

    const subject="New message from "+ senderUserName + " in " + groupName;

    const sql = "SELECT email FROM user WHERE user_name in (SELECT user_name FROM message_group_member WHERE " +
        "group_ID= '"+ groupID +"' and message_group_member.user_name!='"+ senderUserName +"')";
    return sqlHandler(sql, message,subject,res);
})

app.post("/api/comment", (req,res)=>{
    const postID=req.body.postID;
    const comment=req.body.comment;
    const user=req.body.username;

    const subject="New comment from "+ user;
    const message=user + " said " + comment;

    const sql="SELECT u.email FROM user u, user_post up WHERE u.user_name=up.user_name AND up.post_id='"+ postID +"'";
    return sqlHandler(sql,message,subject,res);
})


