const { config } = require("./config/default");
const fs = require('fs');
const dgram = require('dgram');


//const message = Buffer.from('My KungFu is Good!');
//const message = fs.readFileSync('data/zshrc');
const reader = fs.createReadStream('data/zshrc', { highWaterMark: 64 });

const client = dgram.createSocket('udp4');

let offset = 0;

reader.on('data', (chunk) => {
    //chunk是每次读取到的一小块字节
    console.log(chunk.length);
    offset++;
    const segment = offset.toString().padStart(10, '0');
    const head = Buffer.from(segment);

    client.send(head + chunk, config.port, config.host, function (err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + config.host + ':' + config.port);
    });
});

reader.on('end', () => {
    console.log("读取完毕");
    client.close();
});


