const { config } = require("./config/default");
const fs = require('fs');
const dgram = require('dgram');

const server = dgram.createSocket('udp4');
const writer = fs.createWriteStream('data/newzshrc');

server.on('listening', function () {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (chunk, remote) {

    const head = parseInt(chunk.slice(0, 10).toString());
    const body = chunk.slice(10);

    console.log(remote.address + ':' + remote.port + ' - head:' + head);
    console.log(remote.address + ':' + remote.port + ' - body:' + body);
    writer.write(body, () => { })
});


server.bind(config.port, config.host);