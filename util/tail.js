Tail = require("tail").Tail;

tail = new Tail("../data/tcpdump.log");

tail.on("line", function (data) {
    //head = data.split("ICMP echo request, id ")[1].split(", seq")[0];
    console.log(data);
});

tail.on("error", function (error) {
    console.log("ERROR: ", error);
});

//tcpdump -l -nn -i eth0 icmp and src 103.118.42.223 >> data/tcpdump.log
//tcpdump -l -nn -i en0 icmp and src 182.119.80.185 >> data/tcpdump.log
