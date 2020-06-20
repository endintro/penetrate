const { config } = require("./config/default");
const { readFile } = require("./util/fileReader");
const { sendUdpByInterval } = require("./util/udp");
const { listenIcmp } = require("./util/tail");

main();

async function main() {
    listenIcmp();
    const fileChunks = await readFile(config);
    await sendUdpByInterval(fileChunks);
}
