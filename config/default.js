exports.config = {
    icmp_target: "175.24.98.84",
    host: "127.0.0.1",
    port: 33333,
    filepath: "./data/test.dat",
    sendInterval: 4000,
    highWaterMark: 3 * 1024 - 10,
    batchSize: 5000,
};
