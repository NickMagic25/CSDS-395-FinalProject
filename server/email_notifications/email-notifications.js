const mysql = require('mysql');
const express = require('express');

const app=express();
const port=5001;

app.listen(port, () =>{console.log('listening on port ' + port)});

app.post