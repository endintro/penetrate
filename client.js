const { config } = require("./config/default");
const file = require("./util/fileReader");
const udp = require("./util/udp");
const icmpdump = require("./util/icmpdump");

main();

async function main() {
    const fileChunks = await file.readFile(config);
    await udp.sendUdpByInterval(fileChunks);

    const idump = new icmpdump();
    const lost = await idump.monitor();
    console.log(lost);
}
