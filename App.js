const express = require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./src/router/user-router');
const { connectToDB } = require('./src/db/index')

app.use(express.json());
app.use('/api/v1', userRouter)

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`);
    console.log('server running on port', process.env.PORT);
    connectToDB()
})
