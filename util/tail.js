Tail = require("tail").Tail;

exports.listenIcmp = () => {
    tail = new Tail("./data/tcpdump.log");

    tail.on("line", function (data) {
        //head = data.split("ICMP echo request, id ")[1].split(", seq")[0];
        console.log(data);
        /*
    if (data.split("ICMP echo request, id ")[1]) {
        latesttime = new Date().getTime();
        const head = data.split("ICMP echo request, id ")[1].split(", seq")[0];
        done.add(head);
    }
    */
    });

    tail.on("error", function (error) {
        console.log("ERROR: ", error);
    });
};

//tcpdump -l -nn -i eth0 icmp and src 103.118.42.223 >> data/tcpdump.log
//tcpdump -l -nn -i en0 icmp and src 182.119.80.185 >> data/tcpdump.log
//tcpdump -l -nn -XX -vv -i lo0 icmp and src 127.0.0.1 >> data/tcpdump.log
