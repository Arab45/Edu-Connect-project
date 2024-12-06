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
const userNotification = require('./src/router/notification-router');
const userVote = require('./src/router/vote-router');
const http = require('http');
const server = http.createServer(app);
const websocket = require('ws');


app.use(express.json());
app.use('/api/v1', userRouter)
app.use('/question', userQuestion);
app.use('/answer', userAnswer);
app.use('/profile', userProfile);
app.use('/Admin', adminRouter);
app.use('/Subject', subjectRouter);
app.use('/notification', userNotification);
app.use('/vote', userVote);

const wss = new websocket.Server({server: server});
wss.on('connection', function connection(ws){
    console.log('A new client connected!');
    ws.send("welcome client");
    ws.on('message', function incoming(message){
        console.log("recieved: %s", message);
    })
});



server.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
    console.log('server running on port', process.env.PORT);
    connectToDB()
});

