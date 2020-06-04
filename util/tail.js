Tail = require('tail').Tail;

tail = new Tail("../data/tcpdump.log");

tail.on("line", function (data) {
    console.log(data);
});

tail.on("error", function (error) {
    console.log('ERROR: ', error);
});

//tcpdump -l -nn -i eth0 icmp and src 103.118.42.223 >> data/tcpdump.log