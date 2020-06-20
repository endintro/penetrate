const Task = require("./util/task");
const udp = require("./util/udp");
const icmp = require("./util/icmp");

main();

async function main() {
    const task = new Task();
    udp.listenUdp(task);
    await task.monitor();
    const lost = task.checkLost();
    await icmp.feedbackPing(lost);
}
