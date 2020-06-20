const Timeout = require("await-timeout");
const { config } = require("../config/default");

class Task {
    constructor() {
        this.done = new Set();
        this.max = 0;
        this.fileChunks = [];
    }

    receiveChunk(chunk) {
        const head = parseInt(chunk.slice(0, 10).toString());
        const body = chunk.slice(10);
        this.fileChunks[head] = body;
        this.max = head > this.max ? head : this.max;
        this.done.add(head);
    }

    async monitor() {
        let lastSize = -1;
        let lastTime = new Date().getTime();

        while (lastSize != this.done.size) {
            const now = new Date().getTime();
            if (now - lastTime > 10 * 1000) {
                lastSize = this.done.size;
                lastTime = now;
            }

            await Timeout.set(config.sendInterval);
            console.log(`chunks received:${this.done.size}`);
            //console.log(`max:${max}`);
        }
        console.log("end");
    }

    checkLost() {
        let lost = [];
        for (let i = 0; i <= this.max; i++) {
            if (!this.done.has(i)) {
                lost.push(i);
            }
        }
        console.log(lost);
        return lost;
    }
}

module.exports = Task;
