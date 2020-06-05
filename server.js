const fs = require('fs');
const dgram = require('dgram');
const { config } = require("./config/default");
const { sendIcmp } = require("./util/icmp");


const server = dgram.createSocket('udp4');
const writer = fs.createWriteStream(config.filepath);


server.on('listening', function () {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

let count = 0;
let done = new Set();
let datamap = new Map();

server.on('message', function (chunk, remote) {

    const head = parseInt(chunk.slice(0, 10).toString());
    const body = chunk.slice(10);

    if (!done.has(head)) {
        //writer.write(body, () => { });
        datamap.set(head, body);
        //console.log(`datamap length:${datamap.size}`);
    }

    done.add(head);
    //console.log(`receive datagram:${head}`);

    sendIcmp(head, function (error, target, sent, rcvd) {
        const ms = rcvd - sent;
        if (error) {
            console.log(target + ": " + error.toString());
        }
        else {
            //console.log(target + ": Alive (ms=" + ms + ")");
            //console.log(`send icmp:${head}`);
        }

    });
});

setInterval(() => {
    console.log(datamap.size);
}, 5000);


server.bind(config.port, config.host);