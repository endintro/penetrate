const { listenUdp } = require("./util/udp");
const Task = require("./util/task");
const { feedbackPing } = require("./util/icmp");

main();

async function main() {
    const task = new Task();
    listenUdp(task);
    await task.monitor();
    const lost = task.checkLost();
    await feedbackPing(lost);
}
