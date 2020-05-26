const ping = require("net-ping");
const { config } = require("./config/default");

// Default options
const options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 1,
    sessionId: (process.pid % 65535),
    timeout: 2000,
    ttl: 128
};

const session = ping.createSession(options);

session.pingHost(config.target, function (error, target, sent, rcvd) {
    const ms = rcvd - sent;
    if (error)
        console.log(target + ": " + error.toString());
    else
        console.log(target + ": Alive (ms=" + ms + ")");
});