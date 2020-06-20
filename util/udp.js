const dgram = require("dgram");
const { config } = require("../config/default");
const Timeout = require("await-timeout");

exports.sendUdpByInterval = async (fileChunks) => {
    const client = dgram.createSocket("udp4");
    let done = new Set();

    while (fileChunks.length > 0) {
        sendChunks();
        await Timeout.set(config.sendInterval);
    }
    console.log("end");

    function sendChunks() {
        const todo = getChunks();
        todo.forEach((chunk) => {
            client.send(chunk, config.port, config.host, function (err, bytes) {
                if (err) throw err;
                //console.log("UDP message sent to " + config.host + ":" + config.port);
            });
        });
        console.log(`chunks sent:${done.size}`);
    }

    function getChunks() {
        let todo = [];
        for (let i = 0; i < config.batchSize; i++) {
            if (fileChunks.length > 0) {
                const chunk = fileChunks.shift();
                todo.push(chunk);
                done.add(chunk.slice(0, 10).toString());
            }
        }
        return todo;
    }
};

exports.listenUdp = (task) => {
    const server = dgram.createSocket("udp4");

    server.on("listening", function () {
        const address = server.address();
        console.log(
            "UDP Server listening on " + address.address + ":" + address.port
        );
    });

    server.on("message", function (chunk, remote) {
        task.receiveChunk(chunk);
    });

    server.bind(config.port, config.host);
};
