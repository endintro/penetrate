const ping = require("net-ping");
const { config } = require("../config/default");

// Default options
const options = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 1024,
    retries: 1,
    sessionId: process.pid % 65535,
    timeout: 2000,
    ttl: 128,
};

const session = ping.createSession(options);

exports.feedbackPing = async (lost) => {
    return await new Promise((resolve) => {
        session.pingHost(config.icmp_target, lost, function (
            error,
            target,
            sent,
            rcvd
        ) {
            const ms = rcvd - sent;
            if (error) console.log(target + ": " + error.toString());
            else console.log(target + ": Alive (ms=" + ms + ")");
            resolve();
        });
    });
};
