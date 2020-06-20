Tail = require("tail").Tail;
const Timeout = require("await-timeout");
const { config } = require("../config/default");

class icmpdump {
    constructor() {
        this.tail = new Tail("./data/tcpdump.log");
        this.lost;
        this.flag = false;
        this.end = false;

        this.listenIcmp();
    }

    listenIcmp() {
        this.tail.on("line", (data) => {

            if (!this.end) {
                if (data.includes("[")) {
                    this.flag = true;
                    this.lost = data.split("[")[1];
                } else if (data.includes("]")) {
                    this.flag = false;
                    this.end = true;
                    this.lost += data.split("  ")[2].split("]")[0];
                } else if (this.flag) {
                    this.lost += data.split("  ")[2];
                }
            }
        });

        this.tail.on("error", function (error) {
            console.log("ERROR: ", error);
        });
    }

    async monitor() {
        while (!this.end) {
            await Timeout.set(config.sendInterval);
        }
        return this.lost;
    }
};

module.exports = icmpdump;




//tcpdump -l -nn -i eth0 icmp and src 103.118.42.223 >> data/tcpdump.log
//tcpdump -l -nn -i en0 icmp and src 182.119.80.185 >> data/tcpdump.log
//tcpdump -l -nn -XX -vv -i lo0 icmp and src 127.0.0.1 >> data/tcpdump.log

//tcpdump -l -nn -i eth0 icmp and src 103.118.42.223 >> data/tcpdump.log
//tcpdump -nn -XX -vvv -i eth0 icmp and src 103.118.42.223

//tcpdump -l -nn -x -i eth0 icmp and src 175.24.98.84 >> data/tcpdump.log