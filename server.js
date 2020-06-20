const dgram = require("dgram");
const { config } = require("./config/default");
const Timeout = require("await-timeout");

const server = dgram.createSocket("udp4");

main();

async function main() {
    let lastSize = -1;
    let lastTime = new Date().getTime();

    let done = new Set();
    let datamap = new Map();
    let max = 0;
    let fileChunks = [];

    server.on("listening", function () {
        const address = server.address();
        console.log(
            "UDP Server listening on " + address.address + ":" + address.port
        );
    });

    server.on("message", function (chunk, remote) {
        const head = parseInt(chunk.slice(0, 10).toString());
        const body = chunk.slice(10);
        fileChunks[head] = body;
        max = head > max ? head : max;

        if (!done.has(head)) {
            datamap.set(head, body);
        }

        done.add(head);
    });

    server.bind(config.port, config.host);

    //lastSize != datamap.size
    while (1) {
        const now = new Date().getTime();
        if (now - lastTime > 10 * 1000) {
            lastSize = datamap.size;
            lastTime = now;
        }

        console.log(`chunks received:${datamap.size}`);
        //console.log(`max:${max}`);
        await Timeout.set(config.sendInterval);
    }

    console.log("end");
}
