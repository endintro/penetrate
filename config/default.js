exports.config = {
    icmp_target: "127.0.0.1",
    host: "127.0.0.1",
    port: 33333,
    filepath: "./data/Git-2.25.1",
    sendInterval: 4000,
    highWaterMark: 3 * 1024 - 10,
    batchSize: 5000,
};
