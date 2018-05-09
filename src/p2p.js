const WebSockets = require("ws");

const socket = [];

const startP2PServer = server => {
    const wsServer = new WebSockets.Server({server});
    wsServer.on("connection", ws => {
        console.log(`Hello ${ws}`);
    });
    console.log('Rapsbycoin P2P Server running!')
};

module.exports = {
    startP2PServer
};