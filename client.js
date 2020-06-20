const { config } = require("./config/default");
const { readFile } = require("./util/fileReader");
const { sendUdpByInterval } = require("./util/udp");

main();

async function main() {
    const fileChunks = await readFile(config);
    await sendUdpByInterval(fileChunks);
}
