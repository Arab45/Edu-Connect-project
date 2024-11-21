const express = require('express');
const app = express();
require('dotenv').config();



app.listen(process.env.PORT_NUM, () => {
    console.log(`http://localhost:${process.env.PORT_NUM}`);
    console.log('server running on port', process.env.PORT_NUM);
})
