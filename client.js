const { config } = require("./config/default");
const fs = require("fs");
const dgram = require("dgram");
Tail = require("tail").Tail;

tail = new Tail("./data/tcpdump.log");

//const message = Buffer.from('My KungFu is Good!');
//const message = fs.readFileSync('data/zshrc');
const reader = fs.createReadStream(config.filepath, {
    highWaterMark: 3 * 1024,
});

const client = dgram.createSocket("udp4");

let offset = 0;
let arr = [];
let done = new Set();
let latesttime = new Date().getTime();

reader.on("data", (chunk) => {
    //chunk是每次读取到的一小块字节
    const head = Buffer.from(offset.toString().padStart(10, "0"));
    arr[offset] = head + chunk;
    offset++;

    /*
    client.send(head + chunk, config.port, config.host, function (err, bytes) {
        if (err) throw err;
        //console.log("UDP message sent to " + config.host + ":" + config.port);
    });
    */
});

tail.on("line", function (data) {
    if (data.split("ICMP echo request, id ")[1]) {
        latesttime = new Date().getTime();
        const head = data.split("ICMP echo request, id ")[1].split(", seq")[0];
        done.add(head);
    }
});

setInterval(() => {
    const now = new Date().getTime();
    if (now - latesttime > 5000) {
        console.log(`done set:${done.size}`);
        sendChunks();
    }
}, 1000);

reader.on("end", () => {
    console.log("读取完毕");
    sendChunks();
});

function sendChunks() {
    const chunks = getChunks();
    chunks.forEach((chunk) => {
        client.send(chunk, config.port, config.host, function (err, bytes) {
            if (err) throw err;
            //console.log("UDP message sent to " + config.host + ":" + config.port);
        });
    });
}

let iter = 0;

setTimeout(() => {}, 10000);

function getChunks() {
    let todo = [];
    for (let [index, chunk] of arr.entries()) {
        if (todo.length >= 500) {
            break;
        }
        if (!done.has(index.toString()) && index != 0) {
            todo.push(chunk);
            done.add(index.toString());
        }
    }
    return todo;
}
