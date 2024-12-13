const express = require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./src/router/user-router');
const { connectToDB } = require('./src/db/index')
const userQuestion = require('./src/router/question-router');
const userAnswer = require('./src/router/answer-router');
const userProfile = require('./src/router/profile-router');
const adminRouter = require('./src/router/admin-router');
const subjectRouter = require('./src/router/subject-router');
const userVote = require('./src/router/vote-router');
const server = require('http').createServer(app); 
const  WebSocket = require('ws');
const cors = require('cors')

app.use(express.json());
app.use('/api/v1', userRouter)
app.use('/question', userQuestion);
app.use('/answer', userAnswer);
app.use('/profile', userProfile);
app.use('/Admin', adminRouter);
app.use('/Subject', subjectRouter);
app.use('/vote', userVote);

const wss = new WebSocket.Server({ server: server });
wss.on('connection', function connection(ws){
    console.log('A new client connected!');
    ws.send("welcome client");
    ws.on('message', function incoming(message){
        console.log("recieved: %s", message);
        ws.send('Got ur msg its: ' + message);
    })
});



cors({
    "origin": ["*", 'http://localhost:3000'],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  });

server.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
    console.log('server running on port', process.env.PORT);
    connectToDB()
});

