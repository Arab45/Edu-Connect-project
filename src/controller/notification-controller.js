const webSocket = require('ws');



const notification = async (req, res) => {
    const wss = new webSocket.Server({ server: server });
    wss.on("connection", function connection(ws){
        console.log("A new client connected");
        ws.send("welcome now!");
        ws.on("message", function incoming(message){
            console.log('recieved: %s', message);
        })
    })
};

module.exports = {
    notification
}

